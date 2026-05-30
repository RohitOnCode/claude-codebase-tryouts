export interface Provider {
  id?: number;
  firstName: string;
  lastName: string;
  specialty?: string;
  npi?: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt?: string;
}

export interface InsuranceProvider {
  id?: number;
  name: string;
  payerId?: string;
  phone?: string;
  address?: string;
  email?: string;
  createdAt?: string;
}
