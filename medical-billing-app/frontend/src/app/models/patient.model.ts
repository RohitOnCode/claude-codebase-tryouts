export interface Patient {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  email?: string;
  phone?: string;
  address?: string;
  insuranceMemberId?: string;
  createdAt?: string;
  updatedAt?: string;
}
