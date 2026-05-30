package com.medicalbilling.service;

import com.medicalbilling.exception.ResourceNotFoundException;
import com.medicalbilling.model.InsuranceProvider;
import com.medicalbilling.repository.InsuranceProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InsuranceProviderService {

    private final InsuranceProviderRepository insuranceProviderRepository;

    public List<InsuranceProvider> getAllInsuranceProviders() {
        return insuranceProviderRepository.findAll();
    }

    public InsuranceProvider getInsuranceProviderById(Long id) {
        return insuranceProviderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Insurance provider not found with id: " + id));
    }

    public InsuranceProvider createInsuranceProvider(InsuranceProvider provider) {
        return insuranceProviderRepository.save(provider);
    }

    public InsuranceProvider updateInsuranceProvider(Long id, InsuranceProvider providerDetails) {
        InsuranceProvider provider = getInsuranceProviderById(id);
        provider.setName(providerDetails.getName());
        provider.setPayerId(providerDetails.getPayerId());
        provider.setPhone(providerDetails.getPhone());
        provider.setAddress(providerDetails.getAddress());
        provider.setEmail(providerDetails.getEmail());
        return insuranceProviderRepository.save(provider);
    }

    public void deleteInsuranceProvider(Long id) {
        InsuranceProvider provider = getInsuranceProviderById(id);
        insuranceProviderRepository.delete(provider);
    }
}
