import { Injectable, signal } from '@angular/core';
import { Task, TaskStatus } from '../models';

const MOCK_TASKS: Task[] = [
  // Project p1 - Customer Portal
  { id: 't1', projectId: 'p1', sprintId: 's1-4', title: 'Implement support ticket list view', description: 'Build paginated list with filtering by status and priority.', status: 'in-progress', priority: 'high', assigneeId: 'tm9', labels: ['feature', 'ui'], storyPoints: 5, createdAt: '2026-04-16', updatedAt: '2026-04-20', dueDate: '2026-04-28' },
  { id: 't2', projectId: 'p1', sprintId: 's1-4', title: 'Connect ticket API endpoints', description: 'Wire up REST endpoints for ticket CRUD operations.', status: 'todo', priority: 'high', assigneeId: 'tm2', labels: ['api', 'backend'], storyPoints: 3, createdAt: '2026-04-16', updatedAt: '2026-04-16', dueDate: '2026-04-25' },
  { id: 't3', projectId: 'p1', sprintId: 's1-4', title: 'Ticket detail modal with attachments', description: 'Full-screen modal with file attachment support (max 10MB).', status: 'todo', priority: 'medium', assigneeId: 'tm9', labels: ['ui', 'feature'], storyPoints: 8, createdAt: '2026-04-16', updatedAt: '2026-04-16', dueDate: '2026-04-30' },
  { id: 't4', projectId: 'p1', sprintId: 's1-4', title: 'Write e2e tests for ticket flows', description: 'Cypress tests covering create, update, and close ticket journeys.', status: 'todo', priority: 'medium', assigneeId: 'tm4', labels: ['testing', 'qa'], storyPoints: 5, createdAt: '2026-04-17', updatedAt: '2026-04-17', dueDate: '2026-04-30' },
  { id: 't5', projectId: 'p1', sprintId: 's1-3', title: 'Invoice PDF generation', description: 'Generate downloadable PDF invoices from billing records.', status: 'done', priority: 'high', assigneeId: 'tm2', labels: ['feature', 'billing'], storyPoints: 5, createdAt: '2026-02-12', updatedAt: '2026-02-24', dueDate: '2026-02-26' },
  { id: 't6', projectId: 'p1', sprintId: 's1-3', title: 'Payment method management UI', description: 'Add/remove credit cards and bank accounts.', status: 'done', priority: 'high', assigneeId: 'tm9', labels: ['ui', 'billing'], storyPoints: 8, createdAt: '2026-02-12', updatedAt: '2026-02-25', dueDate: '2026-02-26' },
  { id: 't7', projectId: 'p1', sprintId: 's1-4', title: 'Accessibility audit & fixes (WCAG 2.1)', description: 'Fix all AA-level violations found in audit.', status: 'review', priority: 'critical', assigneeId: 'tm1', labels: ['a11y', 'compliance'], storyPoints: 13, createdAt: '2026-04-18', updatedAt: '2026-04-22', dueDate: '2026-04-29' },

  // Project p2 - Analytics Platform
  { id: 't8', projectId: 'p2', sprintId: 's2-2', title: 'Bar & line chart components', description: 'Reusable Chart.js wrapper components with theme support.', status: 'in-progress', priority: 'high', assigneeId: 'tm3', labels: ['ui', 'charts'], storyPoints: 8, createdAt: '2026-04-01', updatedAt: '2026-04-10', dueDate: '2026-04-14' },
  { id: 't9', projectId: 'p2', sprintId: 's2-2', title: 'Dashboard layout grid system', description: 'Drag-and-drop widget grid for custom dashboard layouts.', status: 'todo', priority: 'high', assigneeId: 'tm3', labels: ['ui', 'feature'], storyPoints: 13, createdAt: '2026-04-01', updatedAt: '2026-04-01', dueDate: '2026-04-15' },
  { id: 't10', projectId: 'p2', sprintId: 's2-2', title: 'ClickHouse query builder service', description: 'Backend service to translate UI filters into ClickHouse SQL.', status: 'review', priority: 'critical', assigneeId: 'tm2', labels: ['backend', 'data'], storyPoints: 8, createdAt: '2026-04-01', updatedAt: '2026-04-11', dueDate: '2026-04-15' },
  { id: 't11', projectId: 'p2', sprintId: 's2-2', title: 'Real-time data refresh via WebSocket', description: 'Push updates to live dashboards without polling.', status: 'todo', priority: 'medium', assigneeId: 'tm7', labels: ['backend', 'realtime'], storyPoints: 5, createdAt: '2026-04-05', updatedAt: '2026-04-05', dueDate: '2026-04-15' },
  { id: 't12', projectId: 'p2', sprintId: 's2-1', title: 'Kafka consumer for event ingestion', description: 'Ingest product events from Kafka into ClickHouse.', status: 'done', priority: 'high', assigneeId: 'tm7', labels: ['backend', 'data'], storyPoints: 8, createdAt: '2026-02-01', updatedAt: '2026-02-14', dueDate: '2026-02-15' },

  // Project p3 - Microservices
  { id: 't13', projectId: 'p3', sprintId: 's3-2', title: 'Extract order domain entities', description: 'Identify bounded context and define order aggregate root.', status: 'in-progress', priority: 'critical', assigneeId: 'tm1', labels: ['architecture', 'backend'], storyPoints: 8, createdAt: '2026-04-15', updatedAt: '2026-04-18', dueDate: '2026-04-28' },
  { id: 't14', projectId: 'p3', sprintId: 's3-2', title: 'Order service gRPC contracts', description: 'Define .proto files for order service APIs.', status: 'todo', priority: 'high', assigneeId: 'tm7', labels: ['backend', 'grpc'], storyPoints: 5, createdAt: '2026-04-15', updatedAt: '2026-04-15', dueDate: '2026-04-29' },
  { id: 't15', projectId: 'p3', sprintId: 's3-2', title: 'Service mesh mTLS config', description: 'Configure Istio mTLS between services in staging.', status: 'todo', priority: 'high', assigneeId: 'tm5', labels: ['infra', 'security'], storyPoints: 5, createdAt: '2026-04-15', updatedAt: '2026-04-15', dueDate: '2026-04-30' },
  { id: 't16', projectId: 'p3', sprintId: 's3-1', title: 'Auth service implementation', description: 'JWT-based auth service with OAuth2 social login.', status: 'done', priority: 'critical', assigneeId: 'tm1', labels: ['backend', 'security'], storyPoints: 13, createdAt: '2026-03-01', updatedAt: '2026-03-14', dueDate: '2026-03-15' },
  { id: 't17', projectId: 'p3', sprintId: 's3-2', title: 'Deploy order service to staging', description: 'Helm chart and ArgoCD app for order service.', status: 'review', priority: 'high', assigneeId: 'tm5', labels: ['devops', 'k8s'], storyPoints: 3, createdAt: '2026-04-20', updatedAt: '2026-04-22', dueDate: '2026-04-28' },

  // Project p5 - Security
  { id: 't18', projectId: 'p5', sprintId: 's5-2', title: 'Rotate all database credentials', description: 'Migrate hardcoded DB credentials to Vault dynamic secrets.', status: 'done', priority: 'critical', assigneeId: 'tm5', labels: ['security', 'infra'], storyPoints: 8, createdAt: '2026-01-15', updatedAt: '2026-01-28', dueDate: '2026-01-29' },
  { id: 't19', projectId: 'p5', sprintId: 's5-1', title: 'Pentest findings classification', description: 'Classify and prioritize 47 pentest findings into CVSS severity.', status: 'done', priority: 'critical', assigneeId: 'tm4', labels: ['security', 'qa'], storyPoints: 5, createdAt: '2026-01-01', updatedAt: '2026-01-14', dueDate: '2026-01-15' },

  // Project p6 - Mobile
  { id: 't20', projectId: 'p6', sprintId: 's6-1', title: 'React Native tech spike', description: 'Evaluate Expo vs bare RN workflow for offline support.', status: 'in-progress', priority: 'high', assigneeId: 'tm9', labels: ['spike', 'mobile'], storyPoints: 3, createdAt: '2026-05-01', updatedAt: '2026-05-02', dueDate: '2026-05-10' },
  { id: 't21', projectId: 'p6', sprintId: 's6-1', title: 'UX wireframes — work order flow', description: 'Figma wireframes for the core work order creation and scanning flow.', status: 'in-progress', priority: 'high', assigneeId: 'tm8', labels: ['design', 'ux'], storyPoints: 5, createdAt: '2026-05-01', updatedAt: '2026-05-02', dueDate: '2026-05-12' },
  { id: 't22', projectId: 'p6', sprintId: 's6-1', title: 'Architecture decision records', description: 'Document ADRs for offline sync, auth, and state management.', status: 'todo', priority: 'medium', assigneeId: 'tm1', labels: ['architecture', 'docs'], storyPoints: 2, createdAt: '2026-05-01', updatedAt: '2026-05-01', dueDate: '2026-05-15' },
];

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly _tasks = signal<Task[]>(MOCK_TASKS);
  readonly tasks = this._tasks.asReadonly();

  getByProject(projectId: string): Task[] {
    return this._tasks().filter(t => t.projectId === projectId);
  }

  getByStatus(status: TaskStatus): Task[] {
    return this._tasks().filter(t => t.status === status);
  }

  getByProjectAndStatus(projectId: string, status: TaskStatus): Task[] {
    return this._tasks().filter(t => t.projectId === projectId && t.status === status);
  }
}
