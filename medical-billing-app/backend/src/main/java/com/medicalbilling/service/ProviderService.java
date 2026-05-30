package com.medicalbilling.service;

import com.medicalbilling.exception.ResourceNotFoundException;
import com.medicalbilling.model.Provider;
import com.medicalbilling.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProviderService {

    private final ProviderRepository providerRepository;

    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }

    public Provider getProviderById(Long id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + id));
    }

    public Provider createProvider(Provider provider) {
        return providerRepository.save(provider);
    }

    public Provider updateProvider(Long id, Provider providerDetails) {
        Provider provider = getProviderById(id);
        provider.setFirstName(providerDetails.getFirstName());
        provider.setLastName(providerDetails.getLastName());
        provider.setSpecialty(providerDetails.getSpecialty());
        provider.setNpi(providerDetails.getNpi());
        provider.setPhone(providerDetails.getPhone());
        provider.setEmail(providerDetails.getEmail());
        provider.setAddress(providerDetails.getAddress());
        return providerRepository.save(provider);
    }

    public void deleteProvider(Long id) {
        Provider provider = getProviderById(id);
        providerRepository.delete(provider);
    }
}
