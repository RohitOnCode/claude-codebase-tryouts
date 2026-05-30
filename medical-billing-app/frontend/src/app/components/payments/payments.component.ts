import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { InvoiceService } from '../../services/invoice.service';
import { Payment, PaymentMethod } from '../../models/payment.model';
import { Invoice } from '../../models/invoice.model';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  invoices: Invoice[] = [];
  loading = true;
  error = '';
  showModal = false;

  form: any = {
    invoice: { id: null },
    amount: 0,
    paymentDate: '',
    paymentMethod: 'INSURANCE',
    transactionId: '',
    notes: ''
  };

  paymentMethods: PaymentMethod[] = ['INSURANCE', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'CHECK', 'BANK_TRANSFER'];

  constructor(
    private paymentService: PaymentService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.invoiceService.getAll().subscribe(inv => this.invoices = inv);
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService.getAll().subscribe({
      next: (data) => { this.payments = data; this.loading = false; },
      error: () => { this.error = 'Failed to load payments'; this.loading = false; }
    });
  }

  openModal(): void {
    this.form = { invoice: { id: null }, amount: 0, paymentDate: '', paymentMethod: 'INSURANCE', transactionId: '', notes: '' };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  savePayment(): void {
    const payload = {
      ...this.form,
      invoice: { id: Number(this.form.invoice.id) }
    };
    this.paymentService.create(payload).subscribe({
      next: () => { this.closeModal(); this.loadPayments(); },
      error: () => { this.error = 'Failed to record payment'; }
    });
  }

  deletePayment(id: number): void {
    if (confirm('Delete this payment?')) {
      this.paymentService.delete(id).subscribe({
        next: () => this.loadPayments(),
        error: () => { this.error = 'Failed to delete payment'; }
      });
    }
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  getMethodClass(method: string | undefined): string {
    const map: Record<string, string> = {
      INSURANCE: 'badge-blue', CREDIT_CARD: 'badge-purple', DEBIT_CARD: 'badge-purple',
      CASH: 'badge-green', CHECK: 'badge-yellow', BANK_TRANSFER: 'badge-gray'
    };
    return map[method || ''] || 'badge-gray';
  }
}
