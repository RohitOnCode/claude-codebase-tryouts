import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { BugService } from '../../core/services/bug.service';
import { TeamService } from '../../core/services/team.service';
import { KpiCard } from './kpi-card/kpi-card';

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-slate-100 text-slate-600',
};

const STATUS_COLORS: Record<string, string> = {
  'todo': 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  'review': 'bg-purple-100 text-purple-700',
  'done': 'bg-green-100 text-green-700',
};

const BUG_SEV_COLORS: Record<string, string> = {
  blocker: 'bg-red-600 text-white',
  major: 'bg-red-100 text-red-700',
  minor: 'bg-amber-100 text-amber-700',
  trivial: 'bg-slate-100 text-slate-600',
};

@Component({
  selector: 'app-dashboard',
  imports: [KpiCard, RouterLink],
  template: `
    <div class="p-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500 text-sm mt-1">Welcome back, Natasha — here's what's happening today.</p>
      </div>

      <!-- KPI Row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <app-kpi-card label="Active Projects" [value]="kpi().activeProjects" icon="📁" iconBg="bg-indigo-50" [sub]="kpi().totalProjects + ' total'" />
        <app-kpi-card label="Open Tasks" [value]="kpi().totalTasks - kpi().completedTasks" icon="✅" iconBg="bg-blue-50" [sub]="kpi().completedTasks + ' completed'" />
        <app-kpi-card label="Open Bugs" [value]="kpi().openBugs" icon="🐛" iconBg="bg-red-50" [sub]="kpi().criticalBugs + ' critical'" [trend]="-12" />
        <app-kpi-card label="Team Members" [value]="kpi().teamSize" icon="👥" iconBg="bg-green-50" [sub]="'Sprint velocity: ' + kpi().sprintVelocity + ' pts'" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Recent Tasks -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 class="font-semibold text-gray-900">Recent Tasks</h2>
            <a routerLink="/board" class="text-xs text-indigo-600 hover:underline font-medium">View board →</a>
          </div>
          <ul class="divide-y divide-gray-50">
            @for (task of recentTasks(); track task.id) {
              <li class="px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                <span [class]="'mt-0.5 inline-flex text-xs px-2 py-0.5 rounded-full font-medium ' + statusColors[task.status]">
                  {{ task.status }}
                </span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 truncate">{{ task.title }}</p>
                  <p class="text-xs text-gray-400">{{ projectName(task.projectId) }}</p>
                </div>
                <span [class]="'text-xs px-2 py-0.5 rounded-full font-medium ' + priorityColors[task.priority]">
                  {{ task.priority }}
                </span>
              </li>
            }
          </ul>
        </div>

        <!-- Recent Bugs -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 class="font-semibold text-gray-900">Open Bugs</h2>
            <a routerLink="/bugs" class="text-xs text-indigo-600 hover:underline font-medium">View all →</a>
          </div>
          <ul class="divide-y divide-gray-50">
            @for (bug of openBugs(); track bug.id) {
              <li class="px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                <span [class]="'mt-0.5 inline-flex text-xs px-2 py-0.5 rounded-full font-medium ' + bugSevColors[bug.severity]">
                  {{ bug.severity }}
                </span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 truncate">{{ bug.title }}</p>
                  <p class="text-xs text-gray-400">{{ projectName(bug.projectId) }} · {{ bug.environment }}</p>
                </div>
              </li>
            }
          </ul>
        </div>
      </div>

      <!-- Project Status Overview -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 class="font-semibold text-gray-900">Projects Overview</h2>
          <a routerLink="/projects" class="text-xs text-indigo-600 hover:underline font-medium">View all →</a>
        </div>
        <div class="divide-y divide-gray-50">
          @for (p of projects(); track p.id) {
            <a [routerLink]="['/projects', p.id]" class="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium text-gray-800 group-hover:text-indigo-600 truncate">{{ p.name }}</span>
                  <span [class]="'text-xs px-2 py-0.5 rounded-full font-medium ' + projectStatusColor(p.status)">{{ p.status }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full bg-indigo-500 rounded-full" [style.width.%]="p.progress"></div>
                  </div>
                  <span class="text-xs text-gray-400 w-8 text-right">{{ p.progress }}%</span>
                </div>
              </div>
              <div class="flex -space-x-2">
                @for (memberId of p.teamMemberIds.slice(0,4); track memberId) {
                  <img [src]="'https://i.pravatar.cc/150?u=' + memberId" class="w-6 h-6 rounded-full border-2 border-white" [alt]="memberId" />
                }
                @if (p.teamMemberIds.length > 4) {
                  <div class="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium">+{{ p.teamMemberIds.length - 4 }}</div>
                }
              </div>
            </a>
          }
        </div>
      </div>
    </div>
  `
})
export class Dashboard {
  private projectSvc = inject(ProjectService);
  private taskSvc = inject(TaskService);
  private bugSvc = inject(BugService);
  private teamSvc = inject(TeamService);

  priorityColors = PRIORITY_COLORS;
  statusColors = STATUS_COLORS;
  bugSevColors = BUG_SEV_COLORS;

  projects = this.projectSvc.projects;

  kpi = computed(() => {
    const projects = this.projectSvc.projects();
    const tasks = this.taskSvc.tasks();
    const bugs = this.bugSvc.bugs();
    const members = this.teamSvc.members();
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'done').length,
      openBugs: bugs.filter(b => b.status === 'open' || b.status === 'in-progress').length,
      criticalBugs: bugs.filter(b => b.severity === 'blocker' && (b.status === 'open' || b.status === 'in-progress')).length,
      teamSize: members.length,
      sprintVelocity: 34,
    };
  });

  recentTasks = computed(() =>
    this.taskSvc.tasks()
      .filter(t => t.status !== 'done')
      .slice(0, 6)
  );

  openBugs = computed(() =>
    this.bugSvc.getOpen().slice(0, 6)
  );

  projectName(id: string): string {
    return this.projectSvc.getById(id)?.name ?? id;
  }

  projectStatusColor(status: string): string {
    const map: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      'on-hold': 'bg-yellow-100 text-yellow-700',
      completed: 'bg-blue-100 text-blue-700',
      planning: 'bg-purple-100 text-purple-700',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
  }
}
