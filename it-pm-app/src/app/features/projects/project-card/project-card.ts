import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../../core/models';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  'on-hold': 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
  planning: 'bg-purple-100 text-purple-700',
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'text-red-600',
  high: 'text-orange-500',
  medium: 'text-yellow-600',
  low: 'text-slate-500',
};

@Component({
  selector: 'app-project-card',
  imports: [RouterLink],
  template: `
    <a [routerLink]="['/projects', project().id]"
       class="block bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-indigo-200 transition-all group">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1 min-w-0 pr-2">
          <h3 class="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{{ project().name }}</h3>
          <p class="text-xs text-gray-400 mt-0.5">{{ project().startDate }} → {{ project().endDate }}</p>
        </div>
        <span [class]="'text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ' + statusColors[project().status]">
          {{ project().status }}
        </span>
      </div>

      <p class="text-sm text-gray-500 line-clamp-2 mb-4">{{ project().description }}</p>

      <!-- Progress -->
      <div class="mb-4">
        <div class="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span class="font-semibold" [class]="priorityColors[project().priority]">{{ project().progress }}%</span>
        </div>
        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full bg-indigo-500 rounded-full transition-all" [style.width.%]="project().progress"></div>
        </div>
      </div>

      <!-- Tech Stack -->
      <div class="flex flex-wrap gap-1.5 mb-4">
        @for (tech of project().techStack.slice(0, 4); track tech) {
          <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{{ tech }}</span>
        }
        @if (project().techStack.length > 4) {
          <span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">+{{ project().techStack.length - 4 }}</span>
        }
      </div>

      <!-- Team Avatars -->
      <div class="flex items-center justify-between">
        <div class="flex -space-x-2">
          @for (memberId of project().teamMemberIds.slice(0, 5); track memberId) {
            <img [src]="'https://i.pravatar.cc/150?u=' + memberId"
                 class="w-7 h-7 rounded-full border-2 border-white" [alt]="memberId" />
          }
          @if (project().teamMemberIds.length > 5) {
            <div class="w-7 h-7 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium">
              +{{ project().teamMemberIds.length - 5 }}
            </div>
          }
        </div>
        <span class="text-xs text-gray-400">{{ project().sprints.length }} sprints</span>
      </div>
    </a>
  `
})
export class ProjectCard {
  project = input.required<Project>();
  statusColors = STATUS_COLORS;
  priorityColors = PRIORITY_COLORS;
}
