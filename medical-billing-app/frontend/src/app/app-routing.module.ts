import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientsComponent } from './components/patients/patients.component';
import { ClaimsComponent } from './components/claims/claims.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { ProvidersComponent } from './components/providers/providers.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'claims', component: ClaimsComponent },
  { path: 'invoices', component: InvoicesComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'providers', component: ProvidersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
