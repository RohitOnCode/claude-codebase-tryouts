import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Claim, ClaimStatus } from '../models/claim.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClaimService {
  private apiUrl = `${environment.apiUrl}/claims`;

  constructor(private http: HttpClient) {}

  getAll(status?: string): Observable<Claim[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Claim[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Claim> {
    return this.http.get<Claim>(`${this.apiUrl}/${id}`);
  }

  getByPatient(patientId: number): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  create(claim: Claim): Observable<Claim> {
    return this.http.post<Claim>(this.apiUrl, claim);
  }

  update(id: number, claim: Claim): Observable<Claim> {
    return this.http.put<Claim>(`${this.apiUrl}/${id}`, claim);
  }

  updateStatus(id: number, status: ClaimStatus): Observable<Claim> {
    return this.http.patch<Claim>(`${this.apiUrl}/${id}/status`, { status });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
