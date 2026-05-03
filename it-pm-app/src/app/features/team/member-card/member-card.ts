import { Component, input, inject } from '@angular/core';
import { TeamMember } from '../../../core/models';
import { ProjectService } from '../../../core/services/project.service';

const ROLE_COLORS: Record<string, string> = {
  'Tech Lead': 'bg-indigo-100 text-indigo-700',
  'Backend Engineer': 'bg-blue-100 text-blue-700',
  'Frontend Engineer': 'bg-cyan-100 text-cyan-700',
  'QA Engineer': 'bg-green-100 text-green-700',
  'DevOps Engineer': 'bg-orange-100 text-orange-700',
  'Product Manager': 'bg-purple-100 text-purple-700',
  'UX Designer': 'bg-pink-100 text-pink-700',
};

@Component({
  selector: 'app-member-card',
  template: `
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col">
      <div class="flex items-center gap-4 mb-4">
        <img [src]="member().avatarUrl" class="w-14 h-14 rounded-full border-2 border-gray-200" [alt]="member().name" />
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 truncate">{{ member().name }}</h3>
          <span [class]="'text-xs px-2 py-0.5 rounded-full font-medium ' + roleColors[member().role]">{{ member().role }}</span>
          <p class="text-xs text-gray-400 mt-1 truncate">{{ member().email }}</p>
        </div>
      </div>

      <div class="mb-3">
        <p class="text-xs text-gray-500 font-medium mb-1.5">Skills</p>
        <div class="flex flex-wrap gap-1.5">
          @for (skill of member().skills.slice(0, 4); track skill) {
            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{{ skill }}</span>
          }
        </div>
      </div>

      <div class="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
        <div class="text-xs text-gray-400">Joined {{ member().joinedDate }}</div>
        <div class="flex items-center gap-1 text-xs text-gray-500">
          <span class="font-semibold text-gray-700">{{ activeProjectCount() }}</span> projects
        </div>
      </div>
    </div>
  `
})
export class MemberCard {
  member = input.required<TeamMember>();
  private projectSvc = inject(ProjectService);

  roleColors = ROLE_COLORS;

  activeProjectCount = () => this.member().projectIds.filter(pid => {
    const p = this.projectSvc.getById(pid);
    return p && p.status === 'active';
  }).length;
}
