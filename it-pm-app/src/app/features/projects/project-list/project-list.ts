import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { ProjectCard } from '../project-card/project-card';
import { ProjectStatus } from '../../../core/models';

const STATUS_FILTERS: Array<{ label: string; value: ProjectStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Planning', value: 'planning' },
  { label: 'On Hold', value: 'on-hold' },
  { label: 'Completed', value: 'completed' },
];

@Component({
  selector: 'app-project-list',
  imports: [FormsModule, ProjectCard],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectList {
  private projectSvc = inject(ProjectService);

  search = '';
  statusFilter = signal<ProjectStatus | 'all'>('all');
  statusFilters = STATUS_FILTERS;

  total = computed(() => this.projectSvc.projects().length);

  filtered = computed(() => {
    const q = this.search.toLowerCase().trim();
    const status = this.statusFilter();
    return this.projectSvc.projects().filter(p => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.techStack.some(t => t.toLowerCase().includes(q));
      const matchStatus = status === 'all' || p.status === status;
      return matchSearch && matchStatus;
    });
  });
}
