import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar],
  template: `
    <div class="flex min-h-screen bg-gray-50">
      <app-sidebar />
      <main class="ml-64 flex-1 overflow-y-auto">
        <router-outlet />
      </main>
    </div>
  `
})
export class Shell {}
