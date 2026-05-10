import { Component, computed, inject, signal } from '@angular/core';
import { BugService } from '../../core/services/bug.service';
import { TaskService } from '../../core/services/task.service';

interface Notification {
  id: string;
  type: 'bug' | 'task';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
  read: boolean;
}

@Component({
  selector: 'app-notification-bell',
  imports: [],
  template: `
    <div class="relative">
      <button
        (click)="toggleOpen()"
        class="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        @if (unreadCount() > 0) {
          <span class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {{ unreadCount() > 9 ? '9+' : unreadCount() }}
          </span>
        }
      </button>

      @if (isOpen()) {
        <div class="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 class="font-semibold text-gray-900 text-sm">Notifications</h3>
            @if (unreadCount() > 0) {
              <button
                (click)="markAllRead()"
                class="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Mark all read
              </button>
            }
          </div>

          <div class="max-h-80 overflow-y-auto divide-y divide-gray-50">
            @for (n of notifications(); track n.id) {
              <div
                (click)="markRead(n.id)"
                class="flex gap-3 px-4 py-3 cursor-pointer transition-colors"
                [class.bg-indigo-50]="!n.read"
                [class.hover:bg-gray-50]="n.read"
                [class.hover:bg-indigo-100]="!n.read"
              >
                <span class="mt-0.5 text-base shrink-0">{{ severityIcon(n.severity) }}</span>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ n.title }}</p>
                  <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ n.detail }}</p>
                  <span class="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
                    [class]="badgeClass(n)">
                    {{ n.type === 'bug' ? 'Bug' : 'Task' }}
                  </span>
                </div>
                @if (!n.read) {
                  <span class="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 shrink-0"></span>
                }
              </div>
            } @empty {
              <div class="px-4 py-8 text-center text-sm text-gray-400">
                All caught up!
              </div>
            }
          </div>
        </div>

        <!-- backdrop -->
        <div class="fixed inset-0 z-40" (click)="isOpen.set(false)"></div>
      }
    </div>
  `
})
export class NotificationBell {
  private bugSvc = inject(BugService);
  private taskSvc = inject(TaskService);

  isOpen = signal(false);

  private readIds = signal<Set<string>>(new Set());

  notifications = computed<Notification[]>(() => {
    const read = this.readIds();
    const today = new Date().toISOString().split('T')[0];

    const bugNotifications: Notification[] = this.bugSvc.bugs()
      .filter(b => (b.status === 'open' || b.status === 'in-progress') && (b.severity === 'blocker' || b.severity === 'major'))
      .map(b => ({
        id: `bug-${b.id}`,
        type: 'bug' as const,
        severity: b.severity === 'blocker' ? 'critical' as const : 'warning' as const,
        title: b.title,
        detail: b.description,
        read: read.has(`bug-${b.id}`),
      }));

    const taskNotifications: Notification[] = this.taskSvc.tasks()
      .filter(t => t.dueDate && t.dueDate < today && t.status !== 'done')
      .map(t => ({
        id: `task-${t.id}`,
        type: 'task' as const,
        severity: 'info' as const,
        title: `Overdue: ${t.title}`,
        detail: `Due ${t.dueDate} — ${t.status}`,
        read: read.has(`task-${t.id}`),
      }));

    return [...bugNotifications, ...taskNotifications];
  });

  unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  toggleOpen() {
    this.isOpen.update(v => !v);
  }

  markRead(id: string) {
    this.readIds.update(set => new Set([...set, id]));
  }

  markAllRead() {
    const allIds = this.notifications().map(n => n.id);
    this.readIds.update(set => new Set([...set, ...allIds]));
  }

  severityIcon(severity: 'critical' | 'warning' | 'info'): string {
    return severity === 'critical' ? '🔴' : severity === 'warning' ? '🟡' : '🔵';
  }

  badgeClass(n: Notification): string {
    if (n.type === 'bug') {
      return n.severity === 'critical'
        ? 'bg-red-100 text-red-700'
        : 'bg-yellow-100 text-yellow-700';
    }
    return 'bg-blue-100 text-blue-700';
  }
}
