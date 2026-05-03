import { Injectable, signal } from '@angular/core';
import { Project, ProjectStatus } from '../models';

const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1', name: 'Customer Portal Redesign', priority: 'high',
    description: 'Full redesign of the customer-facing portal with improved UX, accessibility compliance, and mobile-first approach.',
    status: 'active', progress: 62,
    startDate: '2026-01-15', endDate: '2026-06-30',
    teamMemberIds: ['tm1', 'tm2', 'tm4', 'tm5', 'tm6', 'tm9'],
    techStack: ['Angular', 'Node.js', 'PostgreSQL', 'AWS'],
    repository: 'https://github.com/itpm/customer-portal',
    sprints: [
      { id: 's1-1', name: 'Sprint 1', startDate: '2026-01-15', endDate: '2026-01-29', goal: 'Auth & user profile flows', isActive: false },
      { id: 's1-2', name: 'Sprint 2', startDate: '2026-01-29', endDate: '2026-02-12', goal: 'Dashboard & notifications', isActive: false },
      { id: 's1-3', name: 'Sprint 3', startDate: '2026-02-12', endDate: '2026-02-26', goal: 'Billing module', isActive: false },
      { id: 's1-4', name: 'Sprint 4', startDate: '2026-04-16', endDate: '2026-04-30', goal: 'Support ticket integration', isActive: true },
    ]
  },
  {
    id: 'p2', name: 'Internal Analytics Platform', priority: 'high',
    description: 'Build an internal BI platform to replace third-party tools and provide real-time operational metrics.',
    status: 'active', progress: 38,
    startDate: '2026-02-01', endDate: '2026-09-30',
    teamMemberIds: ['tm1', 'tm3', 'tm4', 'tm6', 'tm8'],
    techStack: ['React', 'Python', 'ClickHouse', 'Kafka'],
    repository: 'https://github.com/itpm/analytics-platform',
    sprints: [
      { id: 's2-1', name: 'Sprint 1', startDate: '2026-02-01', endDate: '2026-02-15', goal: 'Data pipeline foundation', isActive: false },
      { id: 's2-2', name: 'Sprint 2', startDate: '2026-04-01', endDate: '2026-04-15', goal: 'Chart components & drill-down', isActive: true },
    ]
  },
  {
    id: 'p3', name: 'Microservices Migration', priority: 'critical',
    description: 'Decompose the monolithic backend into domain-driven microservices with independent deployment pipelines.',
    status: 'active', progress: 25,
    startDate: '2026-03-01', endDate: '2026-12-31',
    teamMemberIds: ['tm1', 'tm3', 'tm5', 'tm6', 'tm7'],
    techStack: ['Go', 'Docker', 'Kubernetes', 'gRPC', 'AWS EKS'],
    repository: 'https://github.com/itpm/microservices-migration',
    sprints: [
      { id: 's3-1', name: 'Sprint 1', startDate: '2026-03-01', endDate: '2026-03-15', goal: 'Service mesh & auth service', isActive: false },
      { id: 's3-2', name: 'Sprint 2', startDate: '2026-04-15', endDate: '2026-04-30', goal: 'Order service extraction', isActive: true },
    ]
  },
  {
    id: 'p4', name: 'CI/CD Pipeline Overhaul', priority: 'medium',
    description: 'Modernize build, test, and deployment pipelines to achieve sub-5-minute deploy cycles across all environments.',
    status: 'completed', progress: 100,
    startDate: '2025-10-01', endDate: '2026-02-28',
    teamMemberIds: ['tm2', 'tm5', 'tm6', 'tm10'],
    techStack: ['GitHub Actions', 'ArgoCD', 'Terraform', 'AWS'],
    repository: 'https://github.com/itpm/cicd-overhaul',
    sprints: [
      { id: 's4-1', name: 'Sprint 1', startDate: '2025-10-01', endDate: '2025-10-15', goal: 'Pipeline audit & design', isActive: false },
      { id: 's4-2', name: 'Sprint 2', startDate: '2025-10-15', endDate: '2025-10-29', goal: 'GitHub Actions migration', isActive: false },
      { id: 's4-3', name: 'Sprint 3', startDate: '2025-11-01', endDate: '2026-02-28', goal: 'ArgoCD & rollout strategy', isActive: false },
    ]
  },
  {
    id: 'p5', name: 'Security Hardening Initiative', priority: 'critical',
    description: 'Address penetration test findings, implement zero-trust networking, and achieve SOC 2 Type II compliance.',
    status: 'on-hold', progress: 45,
    startDate: '2026-01-01', endDate: '2026-07-31',
    teamMemberIds: ['tm4', 'tm5', 'tm6', 'tm7', 'tm10'],
    techStack: ['Vault', 'AWS IAM', 'Snyk', 'Falco'],
    repository: 'https://github.com/itpm/security-hardening',
    sprints: [
      { id: 's5-1', name: 'Sprint 1', startDate: '2026-01-01', endDate: '2026-01-15', goal: 'Pentest finding triage', isActive: false },
      { id: 's5-2', name: 'Sprint 2', startDate: '2026-01-15', endDate: '2026-01-29', goal: 'Secrets manager rollout', isActive: false },
    ]
  },
  {
    id: 'p6', name: 'Mobile App MVP', priority: 'medium',
    description: 'Cross-platform mobile app for field technicians — offline-capable work orders, asset scanning, and reporting.',
    status: 'planning', progress: 8,
    startDate: '2026-05-01', endDate: '2026-11-30',
    teamMemberIds: ['tm6', 'tm8', 'tm9', 'tm10'],
    techStack: ['React Native', 'Expo', 'Node.js', 'SQLite'],
    repository: 'https://github.com/itpm/mobile-app',
    sprints: [
      { id: 's6-1', name: 'Sprint 1', startDate: '2026-05-01', endDate: '2026-05-15', goal: 'Tech spike & architecture', isActive: true },
    ]
  },
];

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly _projects = signal<Project[]>(MOCK_PROJECTS);
  readonly projects = this._projects.asReadonly();

  getById(id: string): Project | undefined {
    return this._projects().find(p => p.id === id);
  }

  getByStatus(status: ProjectStatus): Project[] {
    return this._projects().filter(p => p.status === status);
  }
}
