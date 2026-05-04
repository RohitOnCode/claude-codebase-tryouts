import { Component, computed, inject } from '@angular/core';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';

interface SprintVelocity {
  sprintName: string;
  projectName: string;
  endDate: string;
  points: number;
}

@Component({
  selector: 'app-project-velocity-widget',
  imports: [],
  template: `
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div>
          <h2 class="font-semibold text-gray-900">Project Velocity</h2>
          <p class="text-xs text-gray-400 mt-0.5">Story points completed per sprint</p>
        </div>
        <div [class]="'text-xs font-semibold px-2.5 py-1 rounded-full ' + (stats().trend >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600')">
          {{ stats().trend >= 0 ? '▲' : '▼' }} {{ mathAbs(stats().trend) }}% vs prev
        </div>
      </div>

      <div class="px-5 pt-4 pb-2">
        <!-- Stats row -->
        <div class="grid grid-cols-3 gap-4 mb-5">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">{{ stats().current }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Current</p>
          </div>
          <div class="text-center border-x border-gray-100">
            <p class="text-2xl font-bold text-indigo-600">{{ stats().average }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Avg / sprint</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">{{ velocityData().length }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Sprints tracked</p>
          </div>
        </div>

        <!-- Bar chart -->
        <div class="flex items-end gap-1.5 h-24">
          @for (entry of velocityData(); track entry.endDate) {
            <div class="flex-1 flex flex-col items-center gap-1 min-w-0">
              <span class="text-xs text-gray-500 font-medium">{{ entry.points }}</span>
              <div
                class="w-full rounded-t-md transition-all"
                [class]="isLastSprint(entry) ? 'bg-indigo-500' : 'bg-indigo-200'"
                [style.height.%]="barHeight(entry.points)"
                style="max-height: 56px; min-height: 4px;"
              ></div>
            </div>
          }
        </div>

        <!-- X-axis labels -->
        <div class="flex gap-1.5 mt-1">
          @for (entry of velocityData(); track entry.endDate) {
            <div class="flex-1 text-center min-w-0">
              <p class="text-xs text-gray-400 truncate" [title]="entry.sprintName + ' · ' + entry.projectName">
                S{{ sprintIndex($index + 1) }}
              </p>
            </div>
          }
        </div>

        <!-- Legend for last bar -->
        @if (velocityData().length) {
          <p class="text-xs text-gray-400 mt-3">
            <span class="inline-block w-2 h-2 rounded-sm bg-indigo-500 mr-1"></span>
            Latest: {{ velocityData()[velocityData().length - 1].sprintName }} · {{ velocityData()[velocityData().length - 1].projectName }}
          </p>
        }
      </div>
    </div>
  `
})
export class ProjectVelocityWidget {
  private projectSvc = inject(ProjectService);
  private taskSvc = inject(TaskService);

  velocityData = computed<SprintVelocity[]>(() => {
    const projects = this.projectSvc.projects();
    const tasks = this.taskSvc.tasks();
    const result: SprintVelocity[] = [];

    for (const project of projects) {
      for (const sprint of project.sprints) {
        if (!sprint.isActive) {
          const points = tasks
            .filter(t => t.sprintId === sprint.id && t.status === 'done')
            .reduce((sum, t) => sum + t.storyPoints, 0);
          result.push({
            sprintName: sprint.name,
            projectName: project.name,
            endDate: sprint.endDate,
            points,
          });
        }
      }
    }

    return result.sort((a, b) => a.endDate.localeCompare(b.endDate)).slice(-8);
  });

  stats = computed(() => {
    const data = this.velocityData();
    if (!data.length) return { current: 0, average: 0, trend: 0 };
    const points = data.map(d => d.points);
    const current = points[points.length - 1];
    const average = Math.round(points.reduce((s, p) => s + p, 0) / points.length);
    const prev = points.length > 1 ? points[points.length - 2] : current;
    const trend = prev ? Math.round(((current - prev) / prev) * 100) : 0;
    return { current, average, trend };
  });

  maxPoints = computed(() => Math.max(...this.velocityData().map(d => d.points), 1));

  barHeight(points: number): number {
    return Math.round((points / this.maxPoints()) * 100);
  }

  isLastSprint(entry: SprintVelocity): boolean {
    const data = this.velocityData();
    return data.length > 0 && data[data.length - 1].endDate === entry.endDate;
  }

  sprintIndex(n: number): number {
    return n;
  }

  mathAbs(n: number): number {
    return Math.abs(n);
  }
}
