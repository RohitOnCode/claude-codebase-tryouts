export interface DashboardStats {
  totalPatients: number;
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  deniedClaims: number;
  totalApprovedAmount: number;
  totalPendingAmount: number;
  totalOutstandingBalance: number;
  totalCollected: number;
  totalInvoices: number;
  overdueInvoices: number;
}
