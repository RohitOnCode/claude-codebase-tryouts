package com.medicalbilling.service;

import com.medicalbilling.dto.DashboardStatsDto;
import com.medicalbilling.model.Claim;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final PatientService patientService;
    private final ClaimService claimService;
    private final InvoiceService invoiceService;

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalPatients(patientService.countPatients());
        stats.setTotalClaims(claimService.countClaims());
        stats.setPendingClaims(claimService.countByStatus(Claim.ClaimStatus.PENDING));
        stats.setApprovedClaims(claimService.countByStatus(Claim.ClaimStatus.APPROVED));
        stats.setDeniedClaims(claimService.countByStatus(Claim.ClaimStatus.DENIED));
        stats.setTotalApprovedAmount(claimService.getTotalApprovedAmount());
        stats.setTotalPendingAmount(claimService.getTotalPendingAmount());
        stats.setTotalOutstandingBalance(invoiceService.getTotalOutstandingBalance());
        stats.setTotalCollected(invoiceService.getTotalCollected());
        stats.setTotalInvoices(invoiceService.countInvoices());
        stats.setOverdueInvoices(invoiceService.countOverdueInvoices());
        return stats;
    }
}
