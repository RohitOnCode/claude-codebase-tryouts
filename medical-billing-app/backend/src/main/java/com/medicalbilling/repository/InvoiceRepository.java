package com.medicalbilling.repository;

import com.medicalbilling.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    List<Invoice> findByStatus(Invoice.InvoiceStatus status);

    List<Invoice> findByClaimId(Long claimId);

    @Query("SELECT SUM(i.totalAmount - i.paidAmount) FROM Invoice i WHERE i.status != 'PAID' AND i.status != 'CANCELLED'")
    java.math.BigDecimal getTotalOutstandingBalance();

    @Query("SELECT SUM(i.paidAmount) FROM Invoice i")
    java.math.BigDecimal getTotalCollected();
}
