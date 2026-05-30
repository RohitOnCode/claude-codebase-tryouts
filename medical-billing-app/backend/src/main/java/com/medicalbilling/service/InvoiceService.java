package com.medicalbilling.service;

import com.medicalbilling.exception.ResourceNotFoundException;
import com.medicalbilling.model.Invoice;
import com.medicalbilling.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
    }

    public Invoice createInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    public Invoice updateInvoice(Long id, Invoice invoiceDetails) {
        Invoice invoice = getInvoiceById(id);
        invoice.setClaim(invoiceDetails.getClaim());
        invoice.setInvoiceDate(invoiceDetails.getInvoiceDate());
        invoice.setDueDate(invoiceDetails.getDueDate());
        invoice.setTotalAmount(invoiceDetails.getTotalAmount());
        invoice.setPaidAmount(invoiceDetails.getPaidAmount());
        invoice.setStatus(invoiceDetails.getStatus());
        return invoiceRepository.save(invoice);
    }

    public void deleteInvoice(Long id) {
        Invoice invoice = getInvoiceById(id);
        invoiceRepository.delete(invoice);
    }

    public List<Invoice> getInvoicesByStatus(Invoice.InvoiceStatus status) {
        return invoiceRepository.findByStatus(status);
    }

    public List<Invoice> getInvoicesByClaimId(Long claimId) {
        return invoiceRepository.findByClaimId(claimId);
    }

    public long countInvoices() {
        return invoiceRepository.count();
    }

    public long countOverdueInvoices() {
        return invoiceRepository.findByStatus(Invoice.InvoiceStatus.OVERDUE).size();
    }

    public BigDecimal getTotalOutstandingBalance() {
        BigDecimal balance = invoiceRepository.getTotalOutstandingBalance();
        return balance != null ? balance : BigDecimal.ZERO;
    }

    public BigDecimal getTotalCollected() {
        BigDecimal collected = invoiceRepository.getTotalCollected();
        return collected != null ? collected : BigDecimal.ZERO;
    }
}
