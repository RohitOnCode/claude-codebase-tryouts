import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  navItems = [
    { label: 'Dashboard', icon: 'chart-bar', route: '/dashboard' },
    { label: 'Patients', icon: 'users', route: '/patients' },
    { label: 'Claims', icon: 'document-text', route: '/claims' },
    { label: 'Invoices', icon: 'receipt-tax', route: '/invoices' },
    { label: 'Payments', icon: 'credit-card', route: '/payments' },
    { label: 'Providers', icon: 'briefcase', route: '/providers' },
  ];

  constructor(public router: Router) {}
}
