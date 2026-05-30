import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageTitle: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/patients': 'Patients',
    '/claims': 'Claims',
    '/invoices': 'Invoices',
    '/payments': 'Payments',
    '/providers': 'Providers',
  };

  constructor(public router: Router) {}

  get currentTitle(): string {
    return this.pageTitle[this.router.url] || 'Medical Billing';
  }
}
