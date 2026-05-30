import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../../services/provider.service';
import { Provider, InsuranceProvider } from '../../models/provider.model';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})
export class ProvidersComponent implements OnInit {
  providers: Provider[] = [];
  insuranceProviders: InsuranceProvider[] = [];
  loading = true;
  error = '';
  activeTab: 'providers' | 'insurance' = 'providers';

  showProviderModal = false;
  showInsuranceModal = false;
  editingProvider: Provider | null = null;
  editingInsurance: InsuranceProvider | null = null;

  providerForm: Provider = { firstName: '', lastName: '', specialty: '', npi: '', phone: '', email: '', address: '' };
  insuranceForm: InsuranceProvider = { name: '', payerId: '', phone: '', address: '', email: '' };

  constructor(private providerService: ProviderService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.providerService.getAllProviders().subscribe({
      next: (data) => { this.providers = data; this.loading = false; },
      error: () => { this.error = 'Failed to load providers'; this.loading = false; }
    });
    this.providerService.getAllInsuranceProviders().subscribe({
      next: (data) => this.insuranceProviders = data
    });
  }

  // Provider CRUD
  openProviderModal(provider?: Provider): void {
    this.editingProvider = provider || null;
    this.providerForm = provider ? { ...provider } : { firstName: '', lastName: '', specialty: '', npi: '', phone: '', email: '', address: '' };
    this.showProviderModal = true;
  }

  saveProvider(): void {
    if (this.editingProvider?.id) {
      this.providerService.updateProvider(this.editingProvider.id, this.providerForm).subscribe({
        next: () => { this.showProviderModal = false; this.loadAll(); }
      });
    } else {
      this.providerService.createProvider(this.providerForm).subscribe({
        next: () => { this.showProviderModal = false; this.loadAll(); }
      });
    }
  }

  deleteProvider(id: number): void {
    if (confirm('Delete this provider?')) {
      this.providerService.deleteProvider(id).subscribe({ next: () => this.loadAll() });
    }
  }

  // Insurance CRUD
  openInsuranceModal(insurance?: InsuranceProvider): void {
    this.editingInsurance = insurance || null;
    this.insuranceForm = insurance ? { ...insurance } : { name: '', payerId: '', phone: '', address: '', email: '' };
    this.showInsuranceModal = true;
  }

  saveInsurance(): void {
    if (this.editingInsurance?.id) {
      this.providerService.updateInsuranceProvider(this.editingInsurance.id, this.insuranceForm).subscribe({
        next: () => { this.showInsuranceModal = false; this.loadAll(); }
      });
    } else {
      this.providerService.createInsuranceProvider(this.insuranceForm).subscribe({
        next: () => { this.showInsuranceModal = false; this.loadAll(); }
      });
    }
  }

  deleteInsurance(id: number): void {
    if (confirm('Delete this insurance provider?')) {
      this.providerService.deleteInsuranceProvider(id).subscribe({ next: () => this.loadAll() });
    }
  }
}
