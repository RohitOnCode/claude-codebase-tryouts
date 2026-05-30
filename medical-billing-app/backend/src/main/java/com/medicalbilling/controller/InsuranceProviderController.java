package com.medicalbilling.controller;

import com.medicalbilling.model.InsuranceProvider;
import com.medicalbilling.service.InsuranceProviderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insurance-providers")
@RequiredArgsConstructor
public class InsuranceProviderController {

    private final InsuranceProviderService insuranceProviderService;

    @GetMapping
    public ResponseEntity<List<InsuranceProvider>> getAllInsuranceProviders() {
        return ResponseEntity.ok(insuranceProviderService.getAllInsuranceProviders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InsuranceProvider> getInsuranceProviderById(@PathVariable Long id) {
        return ResponseEntity.ok(insuranceProviderService.getInsuranceProviderById(id));
    }

    @PostMapping
    public ResponseEntity<InsuranceProvider> createInsuranceProvider(@Valid @RequestBody InsuranceProvider provider) {
        return ResponseEntity.status(HttpStatus.CREATED).body(insuranceProviderService.createInsuranceProvider(provider));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InsuranceProvider> updateInsuranceProvider(@PathVariable Long id, @Valid @RequestBody InsuranceProvider provider) {
        return ResponseEntity.ok(insuranceProviderService.updateInsuranceProvider(id, provider));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInsuranceProvider(@PathVariable Long id) {
        insuranceProviderService.deleteInsuranceProvider(id);
        return ResponseEntity.noContent().build();
    }
}
