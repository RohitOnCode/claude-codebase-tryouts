import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';
import { BugService } from '../../../core/services/bug.service';
import { TeamService } from '../../../core/services/team.service';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  'on-hold': 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
  planning: 'bg-purple-100 text-purple-700',
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-slate-100 text-slate-600',
};

const TASK_STATUS_COLORS: Record<string, string> = {
  'todo': 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  'review': 'bg-purple-100 text-purple-700',
  'done': 'bg-green-100 text-green-700',
};

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink],
  template: `
    @if (project()) {
      <div class="p-8">
        <!-- Header -->
        <div class="mb-2">
          <a routerLink="/projects" class="text-sm text-indigo-600 hover:underline">← Back to Projects</a>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div class="flex items-center gap-3 mb-1">
              <h1 class="text-2xl font-bold text-gray-900">{{ project()!.name }}</h1>
              <span [class]="'text-xs px-2.5 py-1 rounded-full font-medium ' + statusColors[project()!.status]">{{ project()!.status }}</span>
              <span [class]="'text-xs px-2.5 py-1 rounded-full font-medium ' + priorityColors[project()!.priority]">{{ project()!.priority }} priority</span>
            </div>
            <p class="text-gray-500 text-sm">{{ project()!.description }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ project()!.startDate }} → {{ project()!.endDate }}</p>
          </div>
          <div class="flex gap-3 shrink-0">
            <a [href]="project()!.repository" target="_blank"
               class="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              🔗 Repository
            </a>
            <a [routerLink]="['/projects', project()!.id, 'board']"
               class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              🗂️ View Board
            </a>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <!-- Progress Card -->
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 class="text-sm font-semibold text-gray-700 mb-3">Progress</h2>
            <div class="flex items-center gap-3 mb-2">
              <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-indigo-500 rounded-full transition-all" [style.width.%]="project()!.progress"></div>
              </div>
              <span class="text-lg font-bold text-gray-900">{{ project()!.progress }}%</span>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-4 text-center">
              <div class="bg-gray-50 rounded-lg p-2">
                <p class="text-xl font-bold text-gray-900">{{ taskCounts().done }}</p>
                <p class="text-xs text-gray-500">Done</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-2">
                <p class="text-xl font-bold text-gray-900">{{ taskCounts().total - taskCounts().done }}</p>
                <p class="text-xs text-gray-500">Remaining</p>
              </div>
            </div>
          </div>

          <!-- Tech Stack -->
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 class="text-sm font-semibold text-gray-700 mb-3">Tech Stack</h2>
            <div class="flex flex-wrap gap-2">
              @for (tech of project()!.techStack; track tech) {
                <span class="bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full font-medium">{{ tech }}</span>
              }
            </div>
          </div>

          <!-- Bugs Summary -->
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 class="text-sm font-semibold text-gray-700 mb-3">Bugs</h2>
            <div class="grid grid-cols-2 gap-2 text-center">
              <div class="bg-red-50 rounded-lg p-2">
                <p class="text-xl font-bold text-red-700">{{ openBugCount() }}</p>
                <p class="text-xs text-red-500">Open</p>
              </div>
              <div class="bg-green-50 rounded-lg p-2">
                <p class="text-xl font-bold text-green-700">{{ resolvedBugCount() }}</p>
                <p class="text-xs text-green-500">Resolved</p>
              </div>
            </div>
            <a routerLink="/bugs" class="block text-center text-xs text-indigo-600 hover:underline mt-3">View all bugs →</a>
          </div>
        </div>

        <!-- Team -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
          <h2 class="text-sm font-semibold text-gray-700 mb-4">Team ({{ team().length }})</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            @for (member of team(); track member.id) {
              <a routerLink="/team" class="flex flex-col items-center gap-2 text-center hover:bg-gray-50 rounded-xl p-3 transition-colors">
                <img [src]="member.avatarUrl" class="w-12 h-12 rounded-full border-2 border-gray-200" [alt]="member.name" />
                <div>
                  <p class="text-sm font-medium text-gray-800 leading-tight">{{ member.name }}</p>
                  <p class="text-xs text-gray-400">{{ member.role }}</p>
                </div>
              </a>
            }
          </div>
        </div>

        <!-- Sprints -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
          <h2 class="text-sm font-semibold text-gray-700 mb-4">Sprints</h2>
          <div class="space-y-3">
            @for (sprint of project()!.sprints; track sprint.id) {
              <div [class]="'flex items-center gap-4 p-3 rounded-lg border ' + (sprint.isActive ? 'border-indigo-200 bg-indigo-50' : 'border-gray-100 bg-gray-50')">
                <div [class]="'w-2.5 h-2.5 rounded-full shrink-0 ' + (sprint.isActive ? 'bg-indigo-500' : 'bg-gray-300')"></div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-gray-800">{{ sprint.name }}</span>
                    @if (sprint.isActive) {
                      <span class="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">Active</span>
                    }
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5">{{ sprint.goal }}</p>
                </div>
                <div class="text-xs text-gray-400 text-right shrink-0">
                  <p>{{ sprint.startDate }}</p>
                  <p>{{ sprint.endDate }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Tasks -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-semibold text-gray-700">Tasks ({{ tasks().length }})</h2>
            <a [routerLink]="['/projects', project()!.id, 'board']" class="text-xs text-indigo-600 hover:underline">Open Kanban →</a>
          </div>
          <div class="space-y-2">
            @for (task of tasks(); track task.id) {
              <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span [class]="'text-xs px-2 py-0.5 rounded-full font-medium ' + taskStatusColors[task.status]">{{ task.status }}</span>
                <span class="flex-1 text-sm text-gray-700 truncate">{{ task.title }}</span>
                <span [class]="'text-xs px-2 py-0.5 rounded-full ' + priorityColors[task.priority]">{{ task.priority }}</span>
                <span class="text-xs text-gray-400 w-16 text-right">{{ task.storyPoints }} pts</span>
              </div>
            }
          </div>
        </div>
      </div>
    } @else {
      <div class="flex items-center justify-center h-screen text-gray-400">
        <div class="text-center">
          <p class="text-5xl mb-4">🔍</p>
          <p class="font-medium">Project not found</p>
          <a routerLink="/projects" class="text-indigo-600 text-sm hover:underline mt-2 block">← Back to Projects</a>
        </div>
      </div>
    }
  `
})
export class ProjectDetail {
  private route = inject(ActivatedRoute);
  private projectSvc = inject(ProjectService);
  private taskSvc = inject(TaskService);
  private bugSvc = inject(BugService);
  private teamSvc = inject(TeamService);

  statusColors = STATUS_COLORS;
  priorityColors = PRIORITY_COLORS;
  taskStatusColors = TASK_STATUS_COLORS;

  private projectId = toSignal(this.route.paramMap.pipe(map(p => p.get('id') ?? '')));

  project = computed(() => this.projectSvc.getById(this.projectId() ?? ''));

  tasks = computed(() => this.taskSvc.getByProject(this.projectId() ?? ''));

  taskCounts = computed(() => {
    const tasks = this.tasks();
    return { total: tasks.length, done: tasks.filter(t => t.status === 'done').length };
  });

  team = computed(() => this.teamSvc.getByProject(this.projectId() ?? ''));

  openBugCount = computed(() =>
    this.bugSvc.getByProject(this.projectId() ?? '').filter(b => b.status === 'open' || b.status === 'in-progress').length
  );

  resolvedBugCount = computed(() =>
    this.bugSvc.getByProject(this.projectId() ?? '').filter(b => b.status === 'resolved' || b.status === 'closed').length
  );
}
