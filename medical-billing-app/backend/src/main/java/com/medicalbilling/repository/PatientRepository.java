package com.medicalbilling.repository;

import com.medicalbilling.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByEmail(String email);

    @Query("SELECT p FROM Patient p WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Patient> searchPatients(@Param("search") String search);
}
