package com.medicalbilling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private Long totalPatients;
    private Long totalClaims;
    private Long pendingClaims;
    private Long approvedClaims;
    private Long deniedClaims;
    private BigDecimal totalApprovedAmount;
    private BigDecimal totalPendingAmount;
    private BigDecimal totalOutstandingBalance;
    private BigDecimal totalCollected;
    private Long totalInvoices;
    private Long overdueInvoices;
}
