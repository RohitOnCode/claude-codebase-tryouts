import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-50">
      <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-sm">IT</div>
        <div>
          <div class="font-semibold text-sm leading-tight">IT Project Hub</div>
          <div class="text-gray-400 text-xs">Management Suite</div>
        </div>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p class="text-gray-500 text-xs font-semibold uppercase tracking-wider px-3 mb-2">Main</p>
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-indigo-600 text-white"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm font-medium group"
          >
            <span class="text-lg w-5 text-center">{{ item.icon }}</span>
            {{ item.label }}
          </a>
        }
      </nav>

      <div class="border-t border-gray-700 px-4 py-4">
        <div class="flex items-center gap-3">
          <img src="https://i.pravatar.cc/150?u=tm6" class="w-8 h-8 rounded-full" alt="User avatar" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">Natasha Brown</p>
            <p class="text-xs text-gray-400 truncate">Product Manager</p>
          </div>
        </div>
      </div>
    </aside>
  `
})
export class Sidebar {
  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Projects', route: '/projects', icon: '📁' },
    { label: 'Task Board', route: '/board', icon: '🗂️' },
    { label: 'Team', route: '/team', icon: '👥' },
    { label: 'Bug Tracker', route: '/bugs', icon: '🐛' },
  ];
}
