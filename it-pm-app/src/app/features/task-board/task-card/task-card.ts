import { Component, input, inject } from '@angular/core';
import { Task } from '../../../core/models';
import { TeamService } from '../../../core/services/team.service';

const PRIORITY_BORDER: Record<string, string> = {
  critical: 'border-l-red-500',
  high: 'border-l-orange-400',
  medium: 'border-l-yellow-400',
  low: 'border-l-slate-300',
};

const PRIORITY_BADGE: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-slate-100 text-slate-600',
};

@Component({
  selector: 'app-task-card',
  template: `
    <div [class]="'bg-white rounded-lg border-l-4 shadow-sm p-3.5 hover:shadow-md transition-shadow cursor-pointer ' + priorityBorder[task().priority]">
      <div class="flex items-start justify-between gap-2 mb-2">
        <p class="text-sm font-medium text-gray-800 leading-tight">{{ task().title }}</p>
        <span [class]="'text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ' + priorityBadge[task().priority]">
          {{ task().priority }}
        </span>
      </div>

      @if (task().labels.length) {
        <div class="flex flex-wrap gap-1 mb-2.5">
          @for (label of task().labels; track label) {
            <span class="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{{ label }}</span>
          }
        </div>
      }

      <div class="flex items-center justify-between mt-2">
        @if (assignee()) {
          <div class="flex items-center gap-1.5">
            <img [src]="assignee()!.avatarUrl" class="w-6 h-6 rounded-full border border-gray-200" [alt]="assignee()!.name" />
            <span class="text-xs text-gray-500">{{ assignee()!.name.split(' ')[0] }}</span>
          </div>
        } @else {
          <span class="text-xs text-gray-400 italic">Unassigned</span>
        }
        <span class="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{{ task().storyPoints }} pts</span>
      </div>

      @if (task().dueDate) {
        <p class="text-xs text-gray-400 mt-1.5">Due {{ task().dueDate }}</p>
      }
    </div>
  `
})
export class TaskCard {
  task = input.required<Task>();
  private teamSvc = inject(TeamService);

  priorityBorder = PRIORITY_BORDER;
  priorityBadge = PRIORITY_BADGE;

  assignee = () => this.task().assigneeId ? this.teamSvc.getById(this.task().assigneeId!) : undefined;
}
