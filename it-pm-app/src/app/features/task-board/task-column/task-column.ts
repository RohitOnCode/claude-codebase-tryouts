import { Component, input } from '@angular/core';
import { Task, TaskStatus } from '../../../core/models';
import { TaskCard } from '../task-card/task-card';

const COLUMN_CONFIG: Record<TaskStatus, { label: string; color: string; dot: string }> = {
  'todo': { label: 'To Do', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  'review': { label: 'In Review', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  'done': { label: 'Done', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
};

@Component({
  selector: 'app-task-column',
  imports: [TaskCard],
  template: `
    <div class="flex flex-col bg-gray-50 rounded-xl p-3 min-w-[280px] w-[280px]">
      <!-- Column Header -->
      <div class="flex items-center justify-between mb-3 px-1">
        <div class="flex items-center gap-2">
          <div [class]="'w-2.5 h-2.5 rounded-full ' + config.dot"></div>
          <span class="text-sm font-semibold text-gray-700">{{ config.label }}</span>
          <span [class]="'text-xs px-2 py-0.5 rounded-full font-medium ' + config.color">{{ tasks().length }}</span>
        </div>
        <span class="text-xs text-gray-400">{{ totalPoints() }} pts</span>
      </div>

      <!-- Cards -->
      <div class="flex flex-col gap-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-220px)]">
        @for (task of tasks(); track task.id) {
          <app-task-card [task]="task" />
        }
        @if (tasks().length === 0) {
          <div class="flex flex-col items-center justify-center py-10 text-gray-400">
            <p class="text-2xl mb-1">✨</p>
            <p class="text-xs">No tasks here</p>
          </div>
        }
      </div>
    </div>
  `
})
export class TaskColumn {
  status = input.required<TaskStatus>();
  tasks = input.required<Task[]>();

  get config() { return COLUMN_CONFIG[this.status()]; }
  totalPoints = () => this.tasks().reduce((sum, t) => sum + t.storyPoints, 0);
}
