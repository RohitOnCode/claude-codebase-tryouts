import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NotificationBell } from './notification-bell';
import { BugService } from '../../core/services/bug.service';
import { TaskService } from '../../core/services/task.service';
import { Bug, Task } from '../../core/models';

// Dates relative to today (2026-05-10) — past is overdue, future is not
const PAST_DATE = '2026-01-01';
const FUTURE_DATE = '2027-12-31';

const makeBug = (overrides: Partial<Bug> = {}): Bug => ({
  id: 'b1',
  projectId: 'p1',
  title: 'Test Bug',
  description: 'Bug description',
  severity: 'blocker',
  status: 'open',
  priority: 'critical',
  reportedById: 'tm1',
  assigneeId: null,
  stepsToReproduce: [],
  environment: 'staging',
  createdAt: '2026-04-01',
  updatedAt: '2026-04-01',
  resolvedAt: null,
  ...overrides,
});

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 't1',
  projectId: 'p1',
  sprintId: 's1',
  title: 'Test Task',
  description: 'Task description',
  status: 'in-progress',
  priority: 'high',
  assigneeId: null,
  labels: [],
  storyPoints: 3,
  createdAt: '2026-04-01',
  updatedAt: '2026-04-01',
  dueDate: PAST_DATE,
  ...overrides,
});

function createComponent(bugs: Bug[] = [], tasks: Task[] = []) {
  const bugsSignal = signal(bugs);
  const tasksSignal = signal(tasks);

  TestBed.configureTestingModule({
    imports: [NotificationBell],
    providers: [
      { provide: BugService, useValue: { bugs: bugsSignal.asReadonly() } },
      { provide: TaskService, useValue: { tasks: tasksSignal.asReadonly() } },
    ],
  });

  const fixture = TestBed.createComponent(NotificationBell);
  const component = fixture.componentInstance;
  return { fixture, component };
}

describe('NotificationBell', () => {
  describe('initialization', () => {
    it('should create the component', () => {
      const { component } = createComponent();
      expect(component).toBeTruthy();
    });

    it('should start with dropdown closed', () => {
      const { component } = createComponent();
      expect(component.isOpen()).toBe(false);
    });

    it('should start with zero unread notifications when no data', () => {
      const { component } = createComponent();
      expect(component.unreadCount()).toBe(0);
    });

    it('should start with empty notifications when no data', () => {
      const { component } = createComponent();
      expect(component.notifications().length).toBe(0);
    });
  });

  describe('toggleOpen', () => {
    it('should open the dropdown when closed', () => {
      const { component } = createComponent();
      component.toggleOpen();
      expect(component.isOpen()).toBe(true);
    });

    it('should close the dropdown when open', () => {
      const { component } = createComponent();
      component.toggleOpen();
      component.toggleOpen();
      expect(component.isOpen()).toBe(false);
    });

    it('should toggle multiple times correctly', () => {
      const { component } = createComponent();
      component.toggleOpen(); // open
      component.toggleOpen(); // close
      component.toggleOpen(); // open
      expect(component.isOpen()).toBe(true);
    });
  });

  describe('notifications — bug filtering', () => {
    it('should include open blocker bugs', () => {
      const bug = makeBug({ id: 'b1', severity: 'blocker', status: 'open' });
      const { component } = createComponent([bug]);
      expect(component.notifications().length).toBe(1);
      expect(component.notifications()[0].id).toBe('bug-b1');
    });

    it('should include in-progress blocker bugs', () => {
      const bug = makeBug({ id: 'b1', severity: 'blocker', status: 'in-progress' });
      const { component } = createComponent([bug]);
      expect(component.notifications().length).toBe(1);
    });

    it('should include open major bugs', () => {
      const bug = makeBug({ id: 'b1', severity: 'major', status: 'open' });
      const { component } = createComponent([bug]);
      expect(component.notifications().length).toBe(1);
    });

    it('should exclude resolved bugs', () => {
      const bug = makeBug({ severity: 'blocker', status: 'resolved' });
      const { component } = createComponent([bug]);
      expect(component.notifications().length).toBe(0);
    });

    it('should exclude closed bugs', () => {
      const bug = makeBug({ severity: 'blocker', status: 'closed' });
      const { component } = createComponent([bug]);
      expect(component.notifications().length).toBe(0);
    });

    it('should exclude minor severity bugs', () => {
      const bug = makeBug({ severity: 'minor', status: 'open' });
      const { component } = createComponent([bug]);
      expect(component.notifications().length).toBe(0);
    });

    it('should exclude trivial severity bugs', () => {
      const bug = makeBug({ severity: 'trivial', status: 'open' });
      const { component } = createComponent([bug]);
      expect(component.notifications().length).toBe(0);
    });

    it('should map blocker bug severity to "critical"', () => {
      const bug = makeBug({ severity: 'blocker', status: 'open' });
      const { component } = createComponent([bug]);
      expect(component.notifications()[0].severity).toBe('critical');
    });

    it('should map major bug severity to "warning"', () => {
      const bug = makeBug({ severity: 'major', status: 'open' });
      const { component } = createComponent([bug]);
      expect(component.notifications()[0].severity).toBe('warning');
    });

    it('should set notification type to "bug"', () => {
      const bug = makeBug({ severity: 'blocker', status: 'open' });
      const { component } = createComponent([bug]);
      expect(component.notifications()[0].type).toBe('bug');
    });

    it('should use bug title and description', () => {
      const bug = makeBug({ title: 'Critical failure', description: 'System down', severity: 'blocker', status: 'open' });
      const { component } = createComponent([bug]);
      const n = component.notifications()[0];
      expect(n.title).toBe('Critical failure');
      expect(n.detail).toBe('System down');
    });

    it('should include multiple qualifying bugs', () => {
      const bugs = [
        makeBug({ id: 'b1', severity: 'blocker', status: 'open' }),
        makeBug({ id: 'b2', severity: 'major', status: 'in-progress' }),
        makeBug({ id: 'b3', severity: 'trivial', status: 'open' }),
      ];
      const { component } = createComponent(bugs);
      expect(component.notifications().length).toBe(2);
    });
  });

  describe('notifications — task filtering', () => {
    it('should include overdue in-progress tasks', () => {
      const task = makeTask({ id: 't1', dueDate: PAST_DATE, status: 'in-progress' });
      const { component } = createComponent([], [task]);
      const taskNotif = component.notifications().find(n => n.id === 'task-t1');
      expect(taskNotif).toBeTruthy();
    });

    it('should include overdue todo tasks', () => {
      const task = makeTask({ id: 't1', dueDate: PAST_DATE, status: 'todo' });
      const { component } = createComponent([], [task]);
      expect(component.notifications().length).toBe(1);
    });

    it('should include overdue review tasks', () => {
      const task = makeTask({ id: 't1', dueDate: PAST_DATE, status: 'review' });
      const { component } = createComponent([], [task]);
      expect(component.notifications().length).toBe(1);
    });

    it('should exclude completed (done) tasks even if overdue', () => {
      const task = makeTask({ dueDate: PAST_DATE, status: 'done' });
      const { component } = createComponent([], [task]);
      expect(component.notifications().length).toBe(0);
    });

    it('should exclude tasks with future due date', () => {
      const task = makeTask({ dueDate: FUTURE_DATE, status: 'in-progress' });
      const { component } = createComponent([], [task]);
      expect(component.notifications().length).toBe(0);
    });

    it('should exclude tasks with null due date', () => {
      const task = makeTask({ dueDate: null, status: 'in-progress' });
      const { component } = createComponent([], [task]);
      expect(component.notifications().length).toBe(0);
    });

    it('should prefix task title with "Overdue:"', () => {
      const task = makeTask({ title: 'Fix login', dueDate: PAST_DATE, status: 'in-progress' });
      const { component } = createComponent([], [task]);
      expect(component.notifications()[0].title).toBe('Overdue: Fix login');
    });

    it('should set task notification type to "task"', () => {
      const task = makeTask({ dueDate: PAST_DATE });
      const { component } = createComponent([], [task]);
      expect(component.notifications()[0].type).toBe('task');
    });

    it('should set task notification severity to "info"', () => {
      const task = makeTask({ dueDate: PAST_DATE });
      const { component } = createComponent([], [task]);
      expect(component.notifications()[0].severity).toBe('info');
    });

    it('should format task detail with dueDate and status', () => {
      const task = makeTask({ dueDate: PAST_DATE, status: 'in-progress' });
      const { component } = createComponent([], [task]);
      expect(component.notifications()[0].detail).toBe(`Due ${PAST_DATE} — in-progress`);
    });
  });

  describe('notifications — combined bugs and tasks', () => {
    it('should list bugs before tasks', () => {
      const bug = makeBug({ id: 'b1', severity: 'blocker', status: 'open' });
      const task = makeTask({ id: 't1', dueDate: PAST_DATE });
      const { component } = createComponent([bug], [task]);
      expect(component.notifications()[0].type).toBe('bug');
      expect(component.notifications()[1].type).toBe('task');
    });

    it('should include both bugs and tasks in total count', () => {
      const bugs = [makeBug({ id: 'b1', severity: 'blocker', status: 'open' })];
      const tasks = [makeTask({ id: 't1', dueDate: PAST_DATE }), makeTask({ id: 't2', dueDate: PAST_DATE })];
      const { component } = createComponent(bugs, tasks);
      expect(component.notifications().length).toBe(3);
    });

    it('should handle empty bugs and tasks', () => {
      const { component } = createComponent([], []);
      expect(component.notifications().length).toBe(0);
    });
  });

  describe('unreadCount', () => {
    it('should count all notifications as unread initially', () => {
      const bugs = [
        makeBug({ id: 'b1', severity: 'blocker', status: 'open' }),
        makeBug({ id: 'b2', severity: 'major', status: 'open' }),
      ];
      const { component } = createComponent(bugs);
      expect(component.unreadCount()).toBe(2);
    });

    it('should return 0 when there are no notifications', () => {
      const { component } = createComponent();
      expect(component.unreadCount()).toBe(0);
    });

    it('should decrease after markRead', () => {
      const bug = makeBug({ id: 'b1', severity: 'blocker', status: 'open' });
      const { component } = createComponent([bug]);
      component.markRead('bug-b1');
      expect(component.unreadCount()).toBe(0);
    });

    it('should return 0 after markAllRead', () => {
      const bugs = [
        makeBug({ id: 'b1', severity: 'blocker', status: 'open' }),
        makeBug({ id: 'b2', severity: 'major', status: 'open' }),
      ];
      const { component } = createComponent(bugs);
      component.markAllRead();
      expect(component.unreadCount()).toBe(0);
    });
  });

  describe('markRead', () => {
    it('should mark a single notification as read', () => {
      const bug = makeBug({ id: 'b1', severity: 'blocker', status: 'open' });
      const { component } = createComponent([bug]);
      component.markRead('bug-b1');
      expect(component.notifications().find(n => n.id === 'bug-b1')?.read).toBe(true);
    });

    it('should not affect other notifications when marking one read', () => {
      const bugs = [
        makeBug({ id: 'b1', severity: 'blocker', status: 'open' }),
        makeBug({ id: 'b2', severity: 'major', status: 'open' }),
      ];
      const { component } = createComponent(bugs);
      component.markRead('bug-b1');
      expect(component.notifications().find(n => n.id === 'bug-b2')?.read).toBe(false);
    });

    it('should be idempotent — marking already-read notification has no side effects', () => {
      const bug = makeBug({ id: 'b1', severity: 'blocker', status: 'open' });
      const { component } = createComponent([bug]);
      component.markRead('bug-b1');
      component.markRead('bug-b1');
      expect(component.unreadCount()).toBe(0);
    });

    it('should mark a task notification as read', () => {
      const task = makeTask({ id: 't1', dueDate: PAST_DATE });
      const { component } = createComponent([], [task]);
      component.markRead('task-t1');
      expect(component.notifications().find(n => n.id === 'task-t1')?.read).toBe(true);
    });
  });

  describe('markAllRead', () => {
    it('should mark all notifications as read', () => {
      const bugs = [
        makeBug({ id: 'b1', severity: 'blocker', status: 'open' }),
        makeBug({ id: 'b2', severity: 'major', status: 'open' }),
      ];
      const tasks = [makeTask({ id: 't1', dueDate: PAST_DATE })];
      const { component } = createComponent(bugs, tasks);
      component.markAllRead();
      expect(component.notifications().every(n => n.read)).toBe(true);
    });

    it('should be safe to call with no notifications', () => {
      const { component } = createComponent();
      expect(() => component.markAllRead()).not.toThrow();
      expect(component.unreadCount()).toBe(0);
    });

    it('should be safe to call when all already read', () => {
      const bug = makeBug({ id: 'b1', severity: 'blocker', status: 'open' });
      const { component } = createComponent([bug]);
      component.markAllRead();
      component.markAllRead();
      expect(component.unreadCount()).toBe(0);
    });
  });

  describe('severityIcon', () => {
    it('should return 🔴 for critical', () => {
      const { component } = createComponent();
      expect(component.severityIcon('critical')).toBe('🔴');
    });

    it('should return 🟡 for warning', () => {
      const { component } = createComponent();
      expect(component.severityIcon('warning')).toBe('🟡');
    });

    it('should return 🔵 for info', () => {
      const { component } = createComponent();
      expect(component.severityIcon('info')).toBe('🔵');
    });
  });

  describe('badgeClass', () => {
    it('should return red classes for critical bug', () => {
      const { component } = createComponent();
      const result = component.badgeClass({ id: 'bug-b1', type: 'bug', severity: 'critical', title: '', detail: '', read: false });
      expect(result).toBe('bg-red-100 text-red-700');
    });

    it('should return yellow classes for warning bug', () => {
      const { component } = createComponent();
      const result = component.badgeClass({ id: 'bug-b2', type: 'bug', severity: 'warning', title: '', detail: '', read: false });
      expect(result).toBe('bg-yellow-100 text-yellow-700');
    });

    it('should return blue classes for task notification', () => {
      const { component } = createComponent();
      const result = component.badgeClass({ id: 'task-t1', type: 'task', severity: 'info', title: '', detail: '', read: false });
      expect(result).toBe('bg-blue-100 text-blue-700');
    });
  });
});
