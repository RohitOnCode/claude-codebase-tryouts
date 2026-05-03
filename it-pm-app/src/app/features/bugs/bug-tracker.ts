import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BugService } from '../../core/services/bug.service';
import { ProjectService } from '../../core/services/project.service';
import { TeamService } from '../../core/services/team.service';
import { BugSeverity, BugStatus } from '../../core/models';

const SEV_COLORS: Record<string, string> = {
  blocker: 'bg-red-600 text-white',
  major: 'bg-red-100 text-red-700',
  minor: 'bg-amber-100 text-amber-700',
  trivial: 'bg-slate-100 text-slate-600',
};

const STATUS_COLORS: Record<string, string> = {
  'open': 'bg-red-50 text-red-600',
  'in-progress': 'bg-blue-50 text-blue-600',
  'resolved': 'bg-green-50 text-green-600',
  'closed': 'bg-gray-100 text-gray-500',
};

const SEV_ROW_BORDER: Record<string, string> = {
  blocker: 'border-l-4 border-l-red-600',
  major: 'border-l-4 border-l-red-400',
  minor: 'border-l-4 border-l-amber-400',
  trivial: 'border-l-4 border-l-slate-300',
};

@Component({
  selector: 'app-bug-tracker',
  imports: [FormsModule],
  template: `
    <div class="p-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Bug Tracker</h1>
        <p class="text-gray-500 text-sm mt-1">{{ filtered().length }} issues</p>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <select [(ngModel)]="projectFilter" class="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Projects</option>
          @for (p of projects(); track p.id) {
            <option [value]="p.id">{{ p.name }}</option>
          }
        </select>

        <select [(ngModel)]="severityFilter" class="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Severities</option>
          <option value="blocker">Blocker</option>
          <option value="major">Major</option>
          <option value="minor">Minor</option>
          <option value="trivial">Trivial</option>
        </select>

        <select [(ngModel)]="statusFilter" class="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <button (click)="clearFilters()" class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
          Clear
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-8"></th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bug</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Severity</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignee</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Env</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              @for (bug of filtered(); track bug.id) {
                <tr [class]="'hover:bg-gray-50 transition-colors ' + sevRowBorder[bug.severity]">
                  <td class="px-3 py-3.5"></td>
                  <td class="px-5 py-3.5">
                    <p class="font-medium text-gray-800 max-w-sm">{{ bug.title }}</p>
                    <p class="text-xs text-gray-400 truncate max-w-sm">{{ bug.description }}</p>
                  </td>
                  <td class="px-5 py-3.5">
                    <span [class]="'text-xs px-2 py-0.5 rounded-full font-medium ' + sevColors[bug.severity]">{{ bug.severity }}</span>
                  </td>
                  <td class="px-5 py-3.5">
                    <span [class]="'text-xs px-2 py-0.5 rounded-full font-medium ' + statusColors[bug.status]">{{ bug.status }}</span>
                  </td>
                  <td class="px-5 py-3.5 text-xs text-gray-600">{{ projectName(bug.projectId) }}</td>
                  <td class="px-5 py-3.5">
                    @if (bug.assigneeId) {
                      <div class="flex items-center gap-1.5">
                        <img [src]="'https://i.pravatar.cc/150?u=' + bug.assigneeId" class="w-5 h-5 rounded-full" [alt]="bug.assigneeId" />
                        <span class="text-xs text-gray-600">{{ assigneeName(bug.assigneeId) }}</span>
                      </div>
                    } @else {
                      <span class="text-xs text-gray-400 italic">Unassigned</span>
                    }
                  </td>
                  <td class="px-5 py-3.5">
                    <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{{ bug.environment }}</span>
                  </td>
                  <td class="px-5 py-3.5 text-xs text-gray-400">{{ bug.createdAt }}</td>
                </tr>
              }
            </tbody>
          </table>

          @if (filtered().length === 0) {
            <div class="text-center py-16 text-gray-400">
              <p class="text-4xl mb-3">🐛</p>
              <p class="font-medium">No bugs match the current filters</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class BugTracker {
  private bugSvc = inject(BugService);
  private projectSvc = inject(ProjectService);
  private teamSvc = inject(TeamService);

  sevColors = SEV_COLORS;
  statusColors = STATUS_COLORS;
  sevRowBorder = SEV_ROW_BORDER;

  projectFilter = '';
  severityFilter = '';
  statusFilter = '';

  projects = this.projectSvc.projects;

  filtered = computed(() => {
    return this.bugSvc.bugs().filter(b => {
      const matchProject = !this.projectFilter || b.projectId === this.projectFilter;
      const matchSev = !this.severityFilter || b.severity === this.severityFilter;
      const matchStatus = !this.statusFilter || b.status === this.statusFilter;
      return matchProject && matchSev && matchStatus;
    });
  });

  projectName(id: string): string {
    return this.projectSvc.getById(id)?.name ?? id;
  }

  assigneeName(id: string): string {
    const m = this.teamSvc.getById(id);
    return m ? m.name.split(' ')[0] : id;
  }

  clearFilters() {
    this.projectFilter = '';
    this.severityFilter = '';
    this.statusFilter = '';
  }
}
