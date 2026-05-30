package com.medicalbilling.repository;

import com.medicalbilling.model.InsuranceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InsuranceProviderRepository extends JpaRepository<InsuranceProvider, Long> {
    Optional<InsuranceProvider> findByPayerId(String payerId);
}
