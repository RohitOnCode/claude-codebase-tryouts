import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice, InvoiceStatus } from '../../models/invoice.model';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  loading = true;
  error = '';
  statusFilter = '';
  statuses: InvoiceStatus[] = ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED'];

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.invoiceService.getAll(this.statusFilter || undefined).subscribe({
      next: (data) => { this.invoices = data; this.loading = false; },
      error: () => { this.error = 'Failed to load invoices'; this.loading = false; }
    });
  }

  getStatusClass(status: string | undefined): string {
    const map: Record<string, string> = {
      PENDING: 'badge-yellow', PARTIAL: 'badge-blue',
      PAID: 'badge-green', OVERDUE: 'badge-red', CANCELLED: 'badge-gray'
    };
    return map[status || ''] || 'badge-gray';
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  getBalance(invoice: Invoice): number {
    return (invoice.totalAmount || 0) - (invoice.paidAmount || 0);
  }

  isOverdue(invoice: Invoice): boolean {
    if (!invoice.dueDate) return false;
    return new Date(invoice.dueDate) < new Date() && invoice.status !== 'PAID';
  }
}
