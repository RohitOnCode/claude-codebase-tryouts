import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provider, InsuranceProvider } from '../models/provider.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProviderService {
  private apiUrl = `${environment.apiUrl}/providers`;
  private insuranceUrl = `${environment.apiUrl}/insurance-providers`;

  constructor(private http: HttpClient) {}

  getAllProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>(this.apiUrl);
  }

  getProviderById(id: number): Observable<Provider> {
    return this.http.get<Provider>(`${this.apiUrl}/${id}`);
  }

  createProvider(provider: Provider): Observable<Provider> {
    return this.http.post<Provider>(this.apiUrl, provider);
  }

  updateProvider(id: number, provider: Provider): Observable<Provider> {
    return this.http.put<Provider>(`${this.apiUrl}/${id}`, provider);
  }

  deleteProvider(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllInsuranceProviders(): Observable<InsuranceProvider[]> {
    return this.http.get<InsuranceProvider[]>(this.insuranceUrl);
  }

  createInsuranceProvider(provider: InsuranceProvider): Observable<InsuranceProvider> {
    return this.http.post<InsuranceProvider>(this.insuranceUrl, provider);
  }

  updateInsuranceProvider(id: number, provider: InsuranceProvider): Observable<InsuranceProvider> {
    return this.http.put<InsuranceProvider>(`${this.insuranceUrl}/${id}`, provider);
  }

  deleteInsuranceProvider(id: number): Observable<void> {
    return this.http.delete<void>(`${this.insuranceUrl}/${id}`);
  }
}
