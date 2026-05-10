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
  templateUrl: './member-card.html',
  styleUrl: './member-card.css'
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
