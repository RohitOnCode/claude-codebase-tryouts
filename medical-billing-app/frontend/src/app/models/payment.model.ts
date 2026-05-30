import { Invoice } from './invoice.model';

export type PaymentMethod = 'INSURANCE' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'CHECK' | 'BANK_TRANSFER';

export interface Payment {
  id?: number;
  invoice: Invoice;
  amount: number;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  notes?: string;
  createdAt?: string;
}
