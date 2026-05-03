import { Component, computed, inject, signal } from '@angular/core';
import { TeamService } from '../../core/services/team.service';
import { MemberCard } from './member-card/member-card';
import { MemberRole } from '../../core/models';

const ROLES: Array<MemberRole | 'all'> = [
  'all', 'Tech Lead', 'Backend Engineer', 'Frontend Engineer',
  'QA Engineer', 'DevOps Engineer', 'Product Manager', 'UX Designer'
];

@Component({
  selector: 'app-team-list',
  imports: [MemberCard],
  template: `
    <div class="p-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Team</h1>
        <p class="text-gray-500 text-sm mt-1">{{ filtered().length }} members</p>
      </div>

      <!-- Role Filter -->
      <div class="flex flex-wrap gap-2 mb-6">
        @for (role of roles; track role) {
          <button
            (click)="roleFilter.set(role)"
            [class]="'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ' +
              (roleFilter() === role ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')"
          >{{ role === 'all' ? 'All Roles' : role }}</button>
        }
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        @for (member of filtered(); track member.id) {
          <app-member-card [member]="member" />
        }
      </div>
    </div>
  `
})
export class TeamList {
  private teamSvc = inject(TeamService);

  roles = ROLES;
  roleFilter = signal<MemberRole | 'all'>('all');

  filtered = computed(() => {
    const role = this.roleFilter();
    return role === 'all' ? this.teamSvc.members() : this.teamSvc.members().filter(m => m.role === role);
  });
}
