package com.medicalbilling.service;

import com.medicalbilling.exception.ResourceNotFoundException;
import com.medicalbilling.model.Claim;
import com.medicalbilling.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClaimService {

    private final ClaimRepository claimRepository;

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Claim getClaimById(Long id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + id));
    }

    public Claim createClaim(Claim claim) {
        return claimRepository.save(claim);
    }

    public Claim updateClaim(Long id, Claim claimDetails) {
        Claim claim = getClaimById(id);
        claim.setPatient(claimDetails.getPatient());
        claim.setProvider(claimDetails.getProvider());
        claim.setInsuranceProvider(claimDetails.getInsuranceProvider());
        claim.setDateOfService(claimDetails.getDateOfService());
        claim.setDiagnosisCode(claimDetails.getDiagnosisCode());
        claim.setDiagnosisDescription(claimDetails.getDiagnosisDescription());
        claim.setStatus(claimDetails.getStatus());
        claim.setTotalAmount(claimDetails.getTotalAmount());
        claim.setNotes(claimDetails.getNotes());
        return claimRepository.save(claim);
    }

    public Claim updateClaimStatus(Long id, Claim.ClaimStatus status) {
        Claim claim = getClaimById(id);
        claim.setStatus(status);
        return claimRepository.save(claim);
    }

    public void deleteClaim(Long id) {
        Claim claim = getClaimById(id);
        claimRepository.delete(claim);
    }

    public List<Claim> getClaimsByPatient(Long patientId) {
        return claimRepository.findByPatientId(patientId);
    }

    public List<Claim> getClaimsByStatus(Claim.ClaimStatus status) {
        return claimRepository.findByStatus(status);
    }

    public long countClaims() {
        return claimRepository.count();
    }

    public long countByStatus(Claim.ClaimStatus status) {
        Long count = claimRepository.countByStatus(status);
        return count != null ? count : 0;
    }

    public BigDecimal getTotalApprovedAmount() {
        BigDecimal amount = claimRepository.getTotalApprovedAmount();
        return amount != null ? amount : BigDecimal.ZERO;
    }

    public BigDecimal getTotalPendingAmount() {
        BigDecimal amount = claimRepository.getTotalPendingAmount();
        return amount != null ? amount : BigDecimal.ZERO;
    }
}
