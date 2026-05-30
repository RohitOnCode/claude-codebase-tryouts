package com.medicalbilling.repository;

import com.medicalbilling.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByPatientId(Long patientId);

    List<Claim> findByProviderId(Long providerId);

    List<Claim> findByStatus(Claim.ClaimStatus status);

    @Query("SELECT COUNT(c) FROM Claim c WHERE c.status = :status")
    Long countByStatus(Claim.ClaimStatus status);

    @Query("SELECT SUM(c.totalAmount) FROM Claim c WHERE c.status = 'APPROVED'")
    java.math.BigDecimal getTotalApprovedAmount();

    @Query("SELECT SUM(c.totalAmount) FROM Claim c WHERE c.status = 'PENDING'")
    java.math.BigDecimal getTotalPendingAmount();
}
