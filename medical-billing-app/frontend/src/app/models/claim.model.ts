import { Patient } from './patient.model';
import { Provider, InsuranceProvider } from './provider.model';

export type ClaimStatus = 'DRAFT' | 'SUBMITTED' | 'PENDING' | 'APPROVED' | 'DENIED' | 'APPEALED' | 'PAID';

export interface ClaimItem {
  id?: number;
  procedureCode?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
}

export interface Claim {
  id?: number;
  patient: Patient;
  provider: Provider;
  insuranceProvider?: InsuranceProvider;
  dateOfService?: string;
  diagnosisCode?: string;
  diagnosisDescription?: string;
  status?: ClaimStatus;
  totalAmount?: number;
  notes?: string;
  claimItems?: ClaimItem[];
  createdAt?: string;
  updatedAt?: string;
}
