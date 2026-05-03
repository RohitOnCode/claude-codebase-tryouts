import { Injectable, signal } from '@angular/core';
import { Bug, BugStatus, BugSeverity } from '../models';

const MOCK_BUGS: Bug[] = [
  { id: 'b1', projectId: 'p1', title: 'Payment form submits twice on slow network', description: 'Double-click or slow response causes duplicate payment intent creation.', severity: 'blocker', status: 'in-progress', priority: 'critical', reportedById: 'tm4', assigneeId: 'tm2', stepsToReproduce: ['Open billing page', 'Enter card details', 'Click Pay on a throttled connection', 'Observe two charges in Stripe'], environment: 'production', createdAt: '2026-04-18', updatedAt: '2026-04-21', resolvedAt: null },
  { id: 'b2', projectId: 'p1', title: 'Session timeout not showing warning modal', description: 'Users are silently logged out without the 2-minute warning dialog appearing.', severity: 'major', status: 'open', priority: 'high', reportedById: 'tm9', assigneeId: null, stepsToReproduce: ['Log in', 'Leave page idle for 28 minutes', 'Check for modal'], environment: 'staging', createdAt: '2026-04-17', updatedAt: '2026-04-17', resolvedAt: null },
  { id: 'b3', projectId: 'p1', title: 'PDF invoice missing line items for prepaid plans', description: 'Generated invoices show only the total amount, not itemized breakdown.', severity: 'major', status: 'open', priority: 'high', reportedById: 'tm4', assigneeId: 'tm2', stepsToReproduce: ['Navigate to Billing', 'Download invoice for a prepaid plan', 'Check line items section'], environment: 'production', createdAt: '2026-04-15', updatedAt: '2026-04-15', resolvedAt: null },
  { id: 'b4', projectId: 'p2', title: 'Dashboard crashes when date range exceeds 90 days', description: 'ClickHouse query times out and causes unhandled promise rejection, crashing the UI.', severity: 'blocker', status: 'open', priority: 'critical', reportedById: 'tm6', assigneeId: 'tm3', stepsToReproduce: ['Open analytics dashboard', 'Set date range > 90 days', 'Observe white screen'], environment: 'staging', createdAt: '2026-04-10', updatedAt: '2026-04-10', resolvedAt: null },
  { id: 'b5', projectId: 'p2', title: 'Bar chart tooltip flickers on hover', description: 'Tooltip rapidly shows/hides when cursor is near bar edge.', severity: 'minor', status: 'open', priority: 'low', reportedById: 'tm3', assigneeId: null, stepsToReproduce: ['Open any bar chart widget', 'Hover cursor along bar edges slowly'], environment: 'staging', createdAt: '2026-04-12', updatedAt: '2026-04-12', resolvedAt: null },
  { id: 'b6', projectId: 'p3', title: 'Auth service returns 500 on expired refresh token', description: 'Should return 401, but returns internal server error causing client-side crash loops.', severity: 'blocker', status: 'resolved', priority: 'critical', reportedById: 'tm1', assigneeId: 'tm1', stepsToReproduce: ['Obtain a refresh token', 'Wait for expiry (7 days)', 'Call /auth/refresh'], environment: 'staging', createdAt: '2026-03-20', updatedAt: '2026-04-02', resolvedAt: '2026-04-02' },
  { id: 'b7', projectId: 'p3', title: 'Order service leaks goroutines under load', description: 'Load test reveals goroutine count grows unbounded, leading to OOM after ~2h.', severity: 'major', status: 'in-progress', priority: 'high', reportedById: 'tm5', assigneeId: 'tm7', stepsToReproduce: ['Run k6 load test profile "heavy"', 'Monitor goroutines via pprof endpoint', 'Observe linear growth over time'], environment: 'staging', createdAt: '2026-04-22', updatedAt: '2026-04-23', resolvedAt: null },
  { id: 'b8', projectId: 'p5', title: 'Vault token renewal silently fails in prod', description: 'After 768h, vault tokens expire and services cannot connect to databases — no alert fires.', severity: 'blocker', status: 'resolved', priority: 'critical', reportedById: 'tm5', assigneeId: 'tm5', stepsToReproduce: ['Check vault token TTL in prod', 'Observe no renewal job in k8s cronjobs'], environment: 'production', createdAt: '2026-01-25', updatedAt: '2026-01-28', resolvedAt: '2026-01-28' },
  { id: 'b9', projectId: 'p1', title: 'Profile avatar upload fails for files > 2MB', description: 'No error is shown to the user, request just silently fails with 413.', severity: 'minor', status: 'open', priority: 'medium', reportedById: 'tm4', assigneeId: null, stepsToReproduce: ['Go to Profile settings', 'Upload an image > 2MB', 'Submit and observe no feedback'], environment: 'production', createdAt: '2026-04-19', updatedAt: '2026-04-19', resolvedAt: null },
  { id: 'b10', projectId: 'p2', title: 'Kafka consumer lag not visible in metrics', description: 'Consumer group lag missing from the analytics metrics dashboard — blind spot for ops.', severity: 'major', status: 'open', priority: 'high', reportedById: 'tm6', assigneeId: 'tm7', stepsToReproduce: ['Open Ops metrics page', 'Check Kafka section', 'Observe no consumer lag panel'], environment: 'production', createdAt: '2026-04-08', updatedAt: '2026-04-08', resolvedAt: null },
  { id: 'b11', projectId: 'p3', title: 'gRPC interceptor does not propagate trace context', description: 'Distributed traces break at service boundaries — cannot correlate logs across services.', severity: 'major', status: 'open', priority: 'high', reportedById: 'tm1', assigneeId: 'tm7', stepsToReproduce: ['Trigger a cross-service request', 'Check Jaeger for the trace', 'Observe missing spans after first hop'], environment: 'staging', createdAt: '2026-04-20', updatedAt: '2026-04-20', resolvedAt: null },
  { id: 'b12', projectId: 'p1', title: 'Dark mode contrast fails WCAG AA on sidebar', description: 'Several navigation items have contrast ratio below 4.5:1 in dark mode.', severity: 'trivial', status: 'closed', priority: 'low', reportedById: 'tm9', assigneeId: 'tm9', stepsToReproduce: ['Switch to dark mode', 'Run axe DevTools scan on sidebar'], environment: 'staging', createdAt: '2026-03-10', updatedAt: '2026-03-15', resolvedAt: '2026-03-15' },
];

@Injectable({ providedIn: 'root' })
export class BugService {
  private readonly _bugs = signal<Bug[]>(MOCK_BUGS);
  readonly bugs = this._bugs.asReadonly();

  getByProject(projectId: string): Bug[] {
    return this._bugs().filter(b => b.projectId === projectId);
  }

  getByStatus(status: BugStatus): Bug[] {
    return this._bugs().filter(b => b.status === status);
  }

  getBySeverity(severity: BugSeverity): Bug[] {
    return this._bugs().filter(b => b.severity === severity);
  }

  getOpen(): Bug[] {
    return this._bugs().filter(b => b.status === 'open' || b.status === 'in-progress');
  }
}
