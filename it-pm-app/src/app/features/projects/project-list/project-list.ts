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
  template: `
    <div class="p-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Projects</h1>
        <p class="text-gray-500 text-sm mt-1">{{ filtered().length }} of {{ total() }} projects</p>
      </div>

      <!-- Controls -->
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          [(ngModel)]="search"
          placeholder="Search projects..."
          class="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
        <div class="flex gap-2 flex-wrap">
          @for (f of statusFilters; track f.value) {
            <button
              (click)="statusFilter.set(f.value)"
              [class]="'px-3 py-2 rounded-lg text-sm font-medium transition-colors ' +
                (statusFilter() === f.value ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')"
            >{{ f.label }}</button>
          }
        </div>
      </div>

      <!-- Grid -->
      @if (filtered().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          @for (project of filtered(); track project.id) {
            <app-project-card [project]="project" />
          }
        </div>
      } @else {
        <div class="text-center py-20 text-gray-400">
          <p class="text-4xl mb-3">📁</p>
          <p class="font-medium">No projects found</p>
          <p class="text-sm">Try adjusting your search or filter.</p>
        </div>
      }
    </div>
  `
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
