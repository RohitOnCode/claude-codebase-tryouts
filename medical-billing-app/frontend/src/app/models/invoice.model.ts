import { Claim } from './claim.model';

export type InvoiceStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface Invoice {
  id?: number;
  claim: Claim;
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  totalAmount?: number;
  paidAmount?: number;
  status?: InvoiceStatus;
  createdAt?: string;
}
