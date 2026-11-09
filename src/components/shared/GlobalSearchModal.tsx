'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Users, FileText, Receipt, ArrowRight } from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { formatCurrency } from '@/lib/utils';

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ open, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const { students, invoices, payments } = useFeeApp();
  const [query, setQuery] = useState('');

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const trimmed = query.trim().toLowerCase();

  const matchedStudents = trimmed
    ? students
        .filter(
          s =>
            s.fullName.toLowerCase().includes(trimmed) ||
            s.rollNumber.toLowerCase().includes(trimmed) ||
            s.admissionNumber.toLowerCase().includes(trimmed) ||
            s.fatherName.toLowerCase().includes(trimmed)
        )
        .slice(0, 5)
    : [];

  const matchedInvoices = trimmed
    ? invoices
        .filter(
          inv =>
            inv.invoiceNumber.toLowerCase().includes(trimmed) ||
            inv.studentName.toLowerCase().includes(trimmed) ||
            inv.rollNumber.toLowerCase().includes(trimmed)
        )
        .slice(0, 4)
    : [];

  const matchedPayments = trimmed
    ? payments
        .filter(
          p =>
            p.receiptNumber.toLowerCase().includes(trimmed) ||
            p.studentName.toLowerCase().includes(trimmed) ||
            (p.referenceNumber && p.referenceNumber.toLowerCase().includes(trimmed))
        )
        .slice(0, 4)
    : [];

  const handleSelectStudent = (id: string) => {
    onClose();
    router.push(`/students/${id}`);
  };

  const handleSelectInvoice = (id: string) => {
    onClose();
    router.push(`/invoices?id=${id}`);
  };

  const handleSelectPayment = () => {
    onClose();
    router.push(`/payments`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs text-left">
      <div
        className="relative w-full max-w-2xl squircle-modal border border-[#cbd5e1] bg-white shadow-2xl overflow-hidden text-left"
        onClick={e => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center border-b border-[#e2e8f0] px-4 py-3">
          <Search className="h-4 w-4 text-[#334155] shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Search students by name, roll no, admission no, or search invoices & receipts..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-[14px] text-[#0f172a] placeholder-[#64748b] outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#334155] hover:text-[#0f172a] rounded"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="ml-2 hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-[#334155] bg-[#f1f5f9] rounded border border-[#e2e8f0]">
            ESC
          </kbd>
        </div>

        {/* Results area */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!trimmed && (
            <div className="py-8 text-center text-[13px] text-[#334155]">
              Type a student name (e.g. &ldquo;Hamza&rdquo;), roll number (e.g. &ldquo;11A-104&rdquo;), or invoice/receipt number...
            </div>
          )}

          {trimmed && matchedStudents.length === 0 && matchedInvoices.length === 0 && matchedPayments.length === 0 && (
            <div className="py-8 text-center text-[13px] text-[#334155]">
              No records found matching &ldquo;{query}&rdquo;
            </div>
          )}

          {/* Matched Students */}
          {matchedStudents.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] mb-2 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Students
              </div>
              <div className="space-y-1">
                {matchedStudents.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectStudent(s.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-[#f8f9fb] transition-colors group"
                  >
                    <div>
                      <div className="text-[13px] font-medium text-[#0f172a] group-hover:text-[#1e3a5f]">
                        {s.fullName}
                      </div>
                      <div className="text-[11px] text-[#334155]">
                        Roll: <span className="font-mono text-[#0f172a]">{s.rollNumber}</span> · Class: {s.class}-{s.section} · S/O {s.fatherName}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium tabular-nums text-[#0f172a]">
                        {formatCurrency(s.outstandingBalance)}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#64748b] group-hover:text-[#1e3a5f]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Invoices */}
          {matchedInvoices.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] mb-2 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Invoices
              </div>
              <div className="space-y-1">
                {matchedInvoices.map(inv => (
                  <button
                    key={inv.id}
                    onClick={() => handleSelectInvoice(inv.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-[#f8f9fb] transition-colors group"
                  >
                    <div>
                      <div className="text-[13px] font-medium text-[#0f172a] group-hover:text-[#1e3a5f]">
                        {inv.invoiceNumber} — {inv.studentName}
                      </div>
                      <div className="text-[11px] text-[#334155]">
                        {inv.billingPeriod} · Class {inv.class} · Status: <span className="font-medium text-[#1e3a5f]">{inv.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium tabular-nums text-[#0f172a]">
                        {formatCurrency(inv.remainingAmount)}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#64748b] group-hover:text-[#1e3a5f]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Payments */}
          {matchedPayments.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] mb-2 flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5" /> Payments & Receipts
              </div>
              <div className="space-y-1">
                {matchedPayments.map(p => (
                  <button
                    key={p.id}
                    onClick={handleSelectPayment}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-[#f8f9fb] transition-colors group"
                  >
                    <div>
                      <div className="text-[13px] font-medium text-[#0f172a] group-hover:text-[#1e3a5f]">
                        {p.receiptNumber} — {p.studentName}
                      </div>
                      <div className="text-[11px] text-[#334155]">
                        Date: {p.paymentDate} · Method: {p.paymentMethod}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium tabular-nums text-[#166534]">
                        +{formatCurrency(p.amount)}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#64748b] group-hover:text-[#1e3a5f]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
