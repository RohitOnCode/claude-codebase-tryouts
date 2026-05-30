package com.medicalbilling.service;

import com.medicalbilling.exception.ResourceNotFoundException;
import com.medicalbilling.model.Invoice;
import com.medicalbilling.model.Payment;
import com.medicalbilling.repository.InvoiceRepository;
import com.medicalbilling.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
    }

    public Payment createPayment(Payment payment) {
        Payment savedPayment = paymentRepository.save(payment);

        // Update invoice paid amount and status
        Invoice invoice = savedPayment.getInvoice();
        BigDecimal totalPaid = paymentRepository.getTotalPaymentsByInvoiceId(invoice.getId());
        if (totalPaid == null) totalPaid = BigDecimal.ZERO;

        invoice.setPaidAmount(totalPaid);

        if (totalPaid.compareTo(invoice.getTotalAmount()) >= 0) {
            invoice.setStatus(Invoice.InvoiceStatus.PAID);
        } else if (totalPaid.compareTo(BigDecimal.ZERO) > 0) {
            invoice.setStatus(Invoice.InvoiceStatus.PARTIAL);
        }

        invoiceRepository.save(invoice);
        return savedPayment;
    }

    public void deletePayment(Long id) {
        Payment payment = getPaymentById(id);
        paymentRepository.delete(payment);
    }

    public List<Payment> getPaymentsByInvoiceId(Long invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId);
    }
}
