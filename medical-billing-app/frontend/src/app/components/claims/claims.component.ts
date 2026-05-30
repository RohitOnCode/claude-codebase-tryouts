import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../../services/claim.service';
import { PatientService } from '../../services/patient.service';
import { ProviderService } from '../../services/provider.service';
import { Claim, ClaimStatus } from '../../models/claim.model';
import { Patient } from '../../models/patient.model';
import { Provider, InsuranceProvider } from '../../models/provider.model';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements OnInit {
  claims: Claim[] = [];
  patients: Patient[] = [];
  providers: Provider[] = [];
  insuranceProviders: InsuranceProvider[] = [];
  loading = true;
  error = '';
  statusFilter = '';
  showModal = false;
  editingClaim: Claim | null = null;
  deleteConfirmId: number | null = null;

  form: any = {
    patient: { id: null },
    provider: { id: null },
    insuranceProvider: { id: null },
    dateOfService: '',
    diagnosisCode: '',
    diagnosisDescription: '',
    status: 'DRAFT',
    totalAmount: 0,
    notes: ''
  };

  statuses: ClaimStatus[] = ['DRAFT', 'SUBMITTED', 'PENDING', 'APPROVED', 'DENIED', 'APPEALED', 'PAID'];

  constructor(
    private claimService: ClaimService,
    private patientService: PatientService,
    private providerService: ProviderService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.patientService.getAll().subscribe(p => this.patients = p);
    this.providerService.getAllProviders().subscribe(p => this.providers = p);
    this.providerService.getAllInsuranceProviders().subscribe(p => this.insuranceProviders = p);
    this.loadClaims();
  }

  loadClaims(): void {
    this.loading = true;
    this.claimService.getAll(this.statusFilter || undefined).subscribe({
      next: (data) => { this.claims = data; this.loading = false; },
      error: () => { this.error = 'Failed to load claims'; this.loading = false; }
    });
  }

  openAddModal(): void {
    this.editingClaim = null;
    this.form = { patient: { id: null }, provider: { id: null }, insuranceProvider: { id: null },
                  dateOfService: '', diagnosisCode: '', diagnosisDescription: '',
                  status: 'DRAFT', totalAmount: 0, notes: '' };
    this.showModal = true;
  }

  openEditModal(claim: Claim): void {
    this.editingClaim = claim;
    this.form = {
      patient: { id: claim.patient?.id },
      provider: { id: claim.provider?.id },
      insuranceProvider: claim.insuranceProvider ? { id: claim.insuranceProvider.id } : { id: null },
      dateOfService: claim.dateOfService || '',
      diagnosisCode: claim.diagnosisCode || '',
      diagnosisDescription: claim.diagnosisDescription || '',
      status: claim.status || 'DRAFT',
      totalAmount: claim.totalAmount || 0,
      notes: claim.notes || ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingClaim = null;
  }

  saveClaim(): void {
    const payload = {
      ...this.form,
      patient: { id: Number(this.form.patient.id) },
      provider: { id: Number(this.form.provider.id) },
      insuranceProvider: this.form.insuranceProvider.id ? { id: Number(this.form.insuranceProvider.id) } : null
    };

    if (this.editingClaim?.id) {
      this.claimService.update(this.editingClaim.id, payload).subscribe({
        next: () => { this.closeModal(); this.loadClaims(); },
        error: () => { this.error = 'Failed to update claim'; }
      });
    } else {
      this.claimService.create(payload).subscribe({
        next: () => { this.closeModal(); this.loadClaims(); },
        error: () => { this.error = 'Failed to create claim'; }
      });
    }
  }

  updateStatus(claim: Claim, status: ClaimStatus): void {
    this.claimService.updateStatus(claim.id!, status).subscribe({
      next: () => this.loadClaims(),
      error: () => { this.error = 'Failed to update status'; }
    });
  }

  confirmDelete(id: number): void {
    this.deleteConfirmId = id;
  }

  deleteClaim(): void {
    if (this.deleteConfirmId) {
      this.claimService.delete(this.deleteConfirmId).subscribe({
        next: () => { this.deleteConfirmId = null; this.loadClaims(); },
        error: () => { this.error = 'Failed to delete claim'; }
      });
    }
  }

  getStatusClass(status: string | undefined): string {
    const map: Record<string, string> = {
      DRAFT: 'badge-gray', SUBMITTED: 'badge-blue', PENDING: 'badge-yellow',
      APPROVED: 'badge-green', DENIED: 'badge-red', APPEALED: 'badge-purple', PAID: 'badge-green'
    };
    return map[status || ''] || 'badge-gray';
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
}
