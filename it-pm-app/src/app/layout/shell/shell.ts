import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { NotificationBell } from '../notification-bell/notification-bell';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar, NotificationBell],
  template: `
    <div class="flex min-h-screen bg-gray-50">
      <app-sidebar />
      <div class="ml-64 flex-1 flex flex-col">
        <header class="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-end">
          <app-notification-bell />
        </header>
        <main class="flex-1 overflow-y-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class Shell {}
