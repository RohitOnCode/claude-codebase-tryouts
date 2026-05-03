import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/project-list/project-list').then(m => m.ProjectList)
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('./features/projects/project-detail/project-detail').then(m => m.ProjectDetail)
      },
      {
        path: 'projects/:id/board',
        loadComponent: () => import('./features/task-board/task-board').then(m => m.TaskBoard)
      },
      {
        path: 'board',
        loadComponent: () => import('./features/task-board/task-board').then(m => m.TaskBoard)
      },
      {
        path: 'team',
        loadComponent: () => import('./features/team/team-list').then(m => m.TeamList)
      },
      {
        path: 'bugs',
        loadComponent: () => import('./features/bugs/bug-tracker').then(m => m.BugTracker)
      },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];
