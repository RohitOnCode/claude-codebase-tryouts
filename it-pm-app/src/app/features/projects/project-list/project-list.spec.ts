import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { ProjectList } from './project-list';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models';

const makeProject = (overrides: Partial<Project> = {}): Project => ({
  id: 'p1',
  name: 'Test Project',
  description: 'A test project description',
  status: 'active',
  priority: 'high',
  progress: 50,
  startDate: '2026-01-01',
  endDate: '2026-06-30',
  teamMemberIds: [],
  techStack: ['Angular', 'Node.js'],
  sprints: [],
  repository: 'https://github.com/test/repo',
  ...overrides,
});

const SAMPLE_PROJECTS: Project[] = [
  makeProject({ id: 'p1', name: 'Alpha Project', description: 'Alpha desc', status: 'active', techStack: ['Angular'] }),
  makeProject({ id: 'p2', name: 'Beta Project', description: 'Beta desc', status: 'planning', techStack: ['React'] }),
  makeProject({ id: 'p3', name: 'Gamma Project', description: 'Gamma desc', status: 'completed', techStack: ['Vue'] }),
  makeProject({ id: 'p4', name: 'Delta Project', description: 'Delta with Angular', status: 'on-hold', techStack: ['Angular', 'Go'] }),
];

function createComponent(projects: Project[] = SAMPLE_PROJECTS) {
  const projectsSignal = signal(projects);
  const mockProjectSvc = { projects: projectsSignal.asReadonly() };

  TestBed.configureTestingModule({
    imports: [ProjectList],
    providers: [
      { provide: ProjectService, useValue: mockProjectSvc },
      provideRouter([]),
    ],
  });

  const fixture = TestBed.createComponent(ProjectList);
  const component = fixture.componentInstance;
  // Do not call detectChanges here so search can be set before the computed's first evaluation
  return { fixture, component };
}

describe('ProjectList', () => {
  describe('initialization', () => {
    it('should create the component', () => {
      const { component } = createComponent();
      expect(component).toBeTruthy();
    });

    it('should default search to empty string', () => {
      const { component } = createComponent();
      expect(component.search).toBe('');
    });

    it('should default statusFilter to "all"', () => {
      const { component } = createComponent();
      expect(component.statusFilter()).toBe('all');
    });

    it('should expose STATUS_FILTERS with 5 entries', () => {
      const { component } = createComponent();
      expect(component.statusFilters.length).toBe(5);
    });

    it('should include "all" as first status filter', () => {
      const { component } = createComponent();
      expect(component.statusFilters[0].value).toBe('all');
    });
  });

  describe('total', () => {
    it('should return total count of all projects', () => {
      const { component } = createComponent();
      expect(component.total()).toBe(4);
    });

    it('should return 0 when no projects exist', () => {
      const { component } = createComponent([]);
      expect(component.total()).toBe(0);
    });

    it('should return 1 when only one project exists', () => {
      const { component } = createComponent([makeProject()]);
      expect(component.total()).toBe(1);
    });
  });

  describe('filtered — no filters applied', () => {
    it('should return all projects when search is empty and status is "all"', () => {
      const { component } = createComponent();
      expect(component.filtered().length).toBe(4);
    });
  });

  describe('filtered — search', () => {
    // Note: `search` is a plain property (not a signal), so the computed captures its value
    // on first evaluation. Each test sets search before the first filtered() call.

    it('should filter by project name (case-insensitive)', () => {
      const { component } = createComponent();
      component.search = 'alpha';
      expect(component.filtered().length).toBe(1);
      expect(component.filtered()[0].id).toBe('p1');
    });

    it('should filter by project name with uppercase query', () => {
      const { component } = createComponent();
      component.search = 'BETA';
      expect(component.filtered().length).toBe(1);
      expect(component.filtered()[0].id).toBe('p2');
    });

    it('should filter by description', () => {
      const { component } = createComponent();
      component.search = 'gamma desc';
      expect(component.filtered().length).toBe(1);
      expect(component.filtered()[0].id).toBe('p3');
    });

    it('should filter by tech stack entry', () => {
      const { component } = createComponent();
      component.search = 'react';
      expect(component.filtered().length).toBe(1);
      expect(component.filtered()[0].id).toBe('p2');
    });

    it('should match multiple projects when query appears in several', () => {
      const { component } = createComponent();
      component.search = 'angular';
      const ids = component.filtered().map(p => p.id);
      expect(ids).toContain('p1');
      expect(ids).toContain('p4');
      expect(component.filtered().length).toBe(2);
    });

    it('should return empty array when search matches nothing', () => {
      const { component } = createComponent();
      component.search = 'zzznomatch';
      expect(component.filtered().length).toBe(0);
    });

    it('should trim whitespace from search query', () => {
      const { component } = createComponent();
      component.search = '  alpha  ';
      expect(component.filtered().length).toBe(1);
    });

    it('should return all projects when search is only whitespace', () => {
      const { component } = createComponent();
      component.search = '   ';
      expect(component.filtered().length).toBe(4);
    });

    it('should return all projects when search is empty string', () => {
      const { component } = createComponent();
      component.search = '';
      expect(component.filtered().length).toBe(4);
    });
  });

  describe('filtered — status filter', () => {
    it('should filter to only active projects', () => {
      const { component } = createComponent();
      component.statusFilter.set('active');
      expect(component.filtered().every(p => p.status === 'active')).toBe(true);
      expect(component.filtered().length).toBe(1);
    });

    it('should filter to only planning projects', () => {
      const { component } = createComponent();
      component.statusFilter.set('planning');
      expect(component.filtered().length).toBe(1);
      expect(component.filtered()[0].id).toBe('p2');
    });

    it('should filter to only completed projects', () => {
      const { component } = createComponent();
      component.statusFilter.set('completed');
      expect(component.filtered().length).toBe(1);
      expect(component.filtered()[0].id).toBe('p3');
    });

    it('should filter to only on-hold projects', () => {
      const { component } = createComponent();
      component.statusFilter.set('on-hold');
      expect(component.filtered().length).toBe(1);
      expect(component.filtered()[0].id).toBe('p4');
    });

    it('should return all projects when status is "all"', () => {
      const { component } = createComponent();
      component.statusFilter.set('all');
      expect(component.filtered().length).toBe(4);
    });

    it('should return empty array when no projects match the status', () => {
      const { component } = createComponent([makeProject({ status: 'active' })]);
      component.statusFilter.set('completed');
      expect(component.filtered().length).toBe(0);
    });

    it('should re-evaluate when status filter changes', () => {
      const { component } = createComponent();
      component.statusFilter.set('active');
      expect(component.filtered().length).toBe(1);
      component.statusFilter.set('all');
      expect(component.filtered().length).toBe(4);
    });
  });

  describe('filtered — combined search and status filter', () => {
    it('should apply both search and status filter together', () => {
      const { component } = createComponent();
      component.search = 'angular';
      component.statusFilter.set('active');
      expect(component.filtered().length).toBe(1);
      expect(component.filtered()[0].id).toBe('p1');
    });

    it('should return empty when search matches but status does not', () => {
      const { component } = createComponent();
      component.search = 'alpha';
      component.statusFilter.set('completed');
      expect(component.filtered().length).toBe(0);
    });

    it('should return empty when status matches but search does not', () => {
      const { component } = createComponent();
      component.search = 'zzznomatch';
      component.statusFilter.set('active');
      expect(component.filtered().length).toBe(0);
    });
  });

  describe('filtered — edge cases', () => {
    it('should handle empty project list gracefully', () => {
      const { component } = createComponent([]);
      component.search = 'anything';
      expect(component.filtered().length).toBe(0);
    });

    it('should handle project with empty techStack', () => {
      const { component } = createComponent([makeProject({ name: 'No Stack', description: 'desc', techStack: [] })]);
      component.search = 'vue';
      expect(component.filtered().length).toBe(0);
    });

    it('should match partial tech stack entry', () => {
      const { component } = createComponent();
      component.search = 'go'; // matches 'Go' in p4's techStack
      expect(component.filtered().length).toBeGreaterThan(0);
    });

    it('should handle a single project list with matching search', () => {
      const { component } = createComponent([makeProject({ name: 'Solo Project', techStack: ['Svelte'] })]);
      component.search = 'solo';
      expect(component.filtered().length).toBe(1);
    });
  });
});
