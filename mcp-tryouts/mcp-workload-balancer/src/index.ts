import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  MEMBERS,
  TASKS,
  getActiveTasks,
  getMemberById,
  findMember,
  OVERLOADED_THRESHOLD_SP,
  UNDERLOADED_THRESHOLD_SP,
} from './data.js';

const server = new McpServer({
  name: 'mcp-workload-balancer',
  version: '1.0.0',
});

// ── Tool 1: get_member_workload ──────────────────────────────────────────────
server.tool(
  'get_member_workload',
  'Get active task workload for a specific team member or all members. Returns task count, total story points, and status breakdown.',
  { identifier: z.string().optional().describe('Member ID (e.g. tm1) or name / partial name (e.g. "Alex"). Omit for all members.') },
  async ({ identifier }) => {
    const activeTasks = getActiveTasks();

    let targets = MEMBERS;
    if (identifier) {
      const found = findMember(identifier);
      if (!found) {
        return { content: [{ type: 'text', text: `No member found matching "${identifier}".` }] };
      }
      targets = [found];
    }

    const result = targets.map(member => {
      const tasks = activeTasks.filter(t => t.assignee_id === member.id);
      const totalSP = tasks.reduce((sum, t) => sum + t.story_points, 0);
      const statusBreakdown = {
        todo: tasks.filter(t => t.status === 'todo').length,
        'in-progress': tasks.filter(t => t.status === 'in-progress').length,
        review: tasks.filter(t => t.status === 'review').length,
      };
      const priorityBreakdown = {
        critical: tasks.filter(t => t.priority === 'critical').length,
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length,
      };
      const load =
        totalSP >= OVERLOADED_THRESHOLD_SP ? 'overloaded' :
        totalSP <= UNDERLOADED_THRESHOLD_SP ? 'underloaded' : 'balanced';

      return {
        member: { id: member.id, name: member.name, role: member.role },
        task_count: tasks.length,
        total_story_points: totalSP,
        load_status: load,
        status_breakdown: statusBreakdown,
        priority_breakdown: priorityBreakdown,
        tasks: tasks.map(t => ({ id: t.id, title: t.title, status: t.status, priority: t.priority, story_points: t.story_points, due_date: t.due_date })),
      };
    });

    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

// ── Tool 2: get_capacity_summary ─────────────────────────────────────────────
server.tool(
  'get_capacity_summary',
  'Get a team-wide capacity summary showing overloaded, balanced, and underloaded members with total story points distribution.',
  {},
  async () => {
    const activeTasks = getActiveTasks();

    const summary = MEMBERS.map(member => {
      const tasks = activeTasks.filter(t => t.assignee_id === member.id);
      const totalSP = tasks.reduce((sum, t) => sum + t.story_points, 0);
      const load =
        totalSP >= OVERLOADED_THRESHOLD_SP ? 'overloaded' :
        totalSP <= UNDERLOADED_THRESHOLD_SP ? 'underloaded' : 'balanced';
      return { id: member.id, name: member.name, role: member.role, total_story_points: totalSP, task_count: tasks.length, load_status: load };
    });

    const overloaded = summary.filter(m => m.load_status === 'overloaded');
    const balanced   = summary.filter(m => m.load_status === 'balanced');
    const underloaded = summary.filter(m => m.load_status === 'underloaded');

    const totalSP = summary.reduce((sum, m) => sum + m.total_story_points, 0);
    const avgSP   = Math.round(totalSP / MEMBERS.length);

    const result = {
      team_size: MEMBERS.length,
      total_active_story_points: totalSP,
      average_story_points_per_member: avgSP,
      thresholds: { overloaded: `>= ${OVERLOADED_THRESHOLD_SP} SP`, underloaded: `<= ${UNDERLOADED_THRESHOLD_SP} SP` },
      overloaded: overloaded,
      balanced: balanced,
      underloaded: underloaded,
    };

    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

// ── Tool 3: suggest_task_reassignment ────────────────────────────────────────
server.tool(
  'suggest_task_reassignment',
  'Suggest which tasks to reassign from an overloaded member to underloaded members, based on story points and role compatibility.',
  { from_member_id: z.string().describe('ID of the overloaded member to reassign tasks from (e.g. tm1)') },
  async ({ from_member_id }) => {
    const activeTasks = getActiveTasks();
    const fromMember = getMemberById(from_member_id);

    if (!fromMember) {
      return { content: [{ type: 'text', text: `Member "${from_member_id}" not found.` }] };
    }

    const fromTasks = activeTasks.filter(t => t.assignee_id === from_member_id);
    const fromSP = fromTasks.reduce((sum, t) => sum + t.story_points, 0);

    if (fromSP < OVERLOADED_THRESHOLD_SP) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            message: `${fromMember.name} is not overloaded (${fromSP} SP). No reassignment needed.`,
            current_story_points: fromSP,
            threshold: OVERLOADED_THRESHOLD_SP,
          }, null, 2),
        }],
      };
    }

    // Find underloaded members (not the same person)
    const candidates = MEMBERS
      .filter(m => m.id !== from_member_id)
      .map(m => {
        const tasks = activeTasks.filter(t => t.assignee_id === m.id);
        const sp = tasks.reduce((sum, t) => sum + t.story_points, 0);
        return { member: m, current_sp: sp, available_capacity: OVERLOADED_THRESHOLD_SP - sp };
      })
      .filter(c => c.current_sp <= UNDERLOADED_THRESHOLD_SP)
      .sort((a, b) => a.current_sp - b.current_sp);

    if (candidates.length === 0) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ message: 'No underloaded members available to absorb tasks right now.' }, null, 2),
        }],
      };
    }

    // Suggest lowest-priority, lowest-SP tasks to move (not critical ones)
    const movableTasks = fromTasks
      .filter(t => t.priority !== 'critical' && t.status === 'todo')
      .sort((a, b) => a.story_points - b.story_points);

    const suggestions: Array<{ task: typeof movableTasks[0]; reassign_to: (typeof candidates[0])['member'] }> = [];
    let relievedSP = 0;
    const targetSP = OVERLOADED_THRESHOLD_SP - 1;

    for (const task of movableTasks) {
      if (fromSP - relievedSP <= targetSP) break;
      const recipient = candidates.find(c =>
        c.current_sp + task.story_points <= OVERLOADED_THRESHOLD_SP
      );
      if (recipient) {
        suggestions.push({ task, reassign_to: recipient.member });
        recipient.current_sp += task.story_points;
        relievedSP += task.story_points;
      }
    }

    const result = {
      from: { id: fromMember.id, name: fromMember.name, role: fromMember.role, current_story_points: fromSP },
      suggested_reassignments: suggestions.map(s => ({
        task_id: s.task.id,
        task_title: s.task.title,
        story_points: s.task.story_points,
        priority: s.task.priority,
        reassign_to: { id: s.reassign_to.id, name: s.reassign_to.name, role: s.reassign_to.role },
      })),
      projected_relief_sp: relievedSP,
      projected_remaining_sp: fromSP - relievedSP,
      available_recipients: candidates.map(c => ({
        id: c.member.id,
        name: c.member.name,
        role: c.member.role,
        current_sp: c.current_sp,
      })),
    };

    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

// ── Start ────────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
