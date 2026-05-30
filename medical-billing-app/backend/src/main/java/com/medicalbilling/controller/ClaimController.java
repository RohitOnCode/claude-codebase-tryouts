package com.medicalbilling.controller;

import com.medicalbilling.model.Claim;
import com.medicalbilling.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @GetMapping
    public ResponseEntity<List<Claim>> getAllClaims(@RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(claimService.getClaimsByStatus(Claim.ClaimStatus.valueOf(status.toUpperCase())));
        }
        return ResponseEntity.ok(claimService.getAllClaims());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Claim> getClaimById(@PathVariable Long id) {
        return ResponseEntity.ok(claimService.getClaimById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Claim>> getClaimsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(claimService.getClaimsByPatient(patientId));
    }

    @PostMapping
    public ResponseEntity<Claim> createClaim(@Valid @RequestBody Claim claim) {
        return ResponseEntity.status(HttpStatus.CREATED).body(claimService.createClaim(claim));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Claim> updateClaim(@PathVariable Long id, @Valid @RequestBody Claim claim) {
        return ResponseEntity.ok(claimService.updateClaim(id, claim));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Claim> updateClaimStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Claim.ClaimStatus status = Claim.ClaimStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(claimService.updateClaimStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClaim(@PathVariable Long id) {
        claimService.deleteClaim(id);
        return ResponseEntity.noContent().build();
    }
}
