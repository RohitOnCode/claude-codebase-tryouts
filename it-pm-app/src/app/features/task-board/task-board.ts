import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskColumn } from './task-column/task-column';
import { TaskStatus } from '../../core/models';

const COLUMNS: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];

@Component({
  selector: 'app-task-board',
  imports: [TaskColumn, RouterLink, FormsModule],
  template: `
    <div class="p-8 min-h-screen">
      <!-- Header -->
      <div class="mb-6">
        @if (project()) {
          <a [routerLink]="['/projects', project()!.id]" class="text-sm text-indigo-600 hover:underline">← {{ project()!.name }}</a>
        } @else {
          <a routerLink="/projects" class="text-sm text-indigo-600 hover:underline">← Projects</a>
        }
        <h1 class="text-2xl font-bold text-gray-900 mt-1">
          {{ project() ? project()!.name + ' — Board' : 'All Tasks' }}
        </h1>

        <!-- Project selector when no project in route -->
        @if (!projectIdFromRoute()) {
          <div class="mt-3">
            <select [(ngModel)]="selectedProjectId" class="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Projects</option>
              @for (p of projects(); track p.id) {
                <option [value]="p.id">{{ p.name }}</option>
              }
            </select>
          </div>
        }
      </div>

      <!-- Kanban Board -->
      <div class="flex gap-4 overflow-x-auto pb-4">
        @for (status of columns; track status) {
          <app-task-column [status]="status" [tasks]="tasksByStatus(status)" />
        }
      </div>
    </div>
  `
})
export class TaskBoard {
  private route = inject(ActivatedRoute);
  private taskSvc = inject(TaskService);
  private projectSvc = inject(ProjectService);

  columns = COLUMNS;
  selectedProjectId = '';

  projectIdFromRoute = toSignal(this.route.paramMap.pipe(map(p => p.get('id'))));

  projects = this.projectSvc.projects;

  project = computed(() => {
    const id = this.projectIdFromRoute();
    return id ? this.projectSvc.getById(id) : null;
  });

  private effectiveProjectId = computed(() => this.projectIdFromRoute() ?? this.selectedProjectId);

  private filteredTasks = computed(() => {
    const pid = this.effectiveProjectId();
    return pid ? this.taskSvc.getByProject(pid) : this.taskSvc.tasks();
  });

  tasksByStatus(status: TaskStatus) {
    return this.filteredTasks().filter(t => t.status === status);
  }
}
