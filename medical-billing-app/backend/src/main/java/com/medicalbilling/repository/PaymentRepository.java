package com.medicalbilling.repository;

import com.medicalbilling.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByInvoiceId(Long invoiceId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.invoice.id = :invoiceId")
    BigDecimal getTotalPaymentsByInvoiceId(Long invoiceId);
}
