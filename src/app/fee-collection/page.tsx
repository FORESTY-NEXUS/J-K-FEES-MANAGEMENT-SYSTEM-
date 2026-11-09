'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Wallet,
  Search,
  CheckCircle2,
  Receipt,
  Printer,
  CreditCard,
  Building2,
  AlertTriangle,
  Clock,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { Student, Invoice, Payment, PaymentMethod } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

function FeeCollectionContent() {
  const searchParams = useSearchParams();
  const initialStudentId = searchParams.get('studentId') || '';

  const { students, invoices, recordPayment, settings } = useFeeApp();

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // If initialStudentId passed from another page, select immediately
  useEffect(() => {
    if (initialStudentId) {
      const match = students.find((s) => s.id === initialStudentId);
      if (match) setSelectedStudent(match);
    }
  }, [initialStudentId, students]);

  // Selected invoices to pay
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [useAdvanceCredit, setUseAdvanceCredit] = useState(false);

  // Cheque fields
  const [chequeNumber, setChequeNumber] = useState('');
  const [bankName, setBankName] = useState('Habib Bank Limited');
  const [clearingDate, setClearingDate] = useState('2026-11-15');

  // Confirmation & Receipt Modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [completedPayment, setCompletedPayment] = useState<Payment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find matching students for search
  const searchResults = searchTerm.trim()
    ? students
        .filter(
          (s) =>
            s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleSelectStudent = (st: Student) => {
    setSelectedStudent(st);
    setSearchTerm('');
    // Auto-select all unpaid invoices for this student
    const studentUnpaid = invoices.filter(
      (i) => i.studentId === st.id && i.remainingAmount > 0
    );
    setSelectedInvoiceIds(studentUnpaid.map((i) => i.id));
    const totalRemaining = studentUnpaid.reduce((sum, i) => sum + i.remainingAmount, 0);
    setPaymentAmount(totalRemaining || st.outstandingBalance);
  };

  const studentInvoices = selectedStudent
    ? invoices.filter((i) => i.studentId === selectedStudent.id && i.remainingAmount > 0)
    : [];

  const totalSelectedInvoicesAmount = studentInvoices
    .filter((inv) => selectedInvoiceIds.includes(inv.id))
    .reduce((sum, inv) => sum + inv.remainingAmount, 0);

  const toggleInvoiceSelect = (id: string) => {
    setSelectedInvoiceIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      const sum = studentInvoices
        .filter((inv) => next.includes(inv.id))
        .reduce((acc, inv) => acc + inv.remainingAmount, 0);
      setPaymentAmount(sum);
      return next;
    });
  };

  const handleQuickAmount = (type: 'full' | 'half' | 'custom') => {
    if (type === 'full') setPaymentAmount(totalSelectedInvoicesAmount);
    if (type === 'half') setPaymentAmount(Math.round(totalSelectedInvoicesAmount / 2));
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }
    if (paymentAmount <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }
    if (paymentMethod === 'Cheque' && !chequeNumber.trim()) {
      toast.error('Please provide cheque number');
      return;
    }
    setConfirmModalOpen(true);
  };

  const handleProcessPayment = () => {
    if (!selectedStudent || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const newPay = recordPayment({
        studentId: selectedStudent.id,
        amount: paymentAmount,
        paymentMethod,
        referenceNumber: referenceNumber || undefined,
        chequeDetails:
          paymentMethod === 'Cheque'
            ? {
                chequeNumber,
                bankName,
                expectedClearingDate: clearingDate,
              }
            : undefined,
        allocatedInvoiceIds: selectedInvoiceIds,
        notes: notes || undefined,
        recordedBy: 'Muhammad Rashid Minhas (Accountant)',
      });

      setCompletedPayment(newPay);
      setConfirmModalOpen(false);
      toast.success(
        `Payment of ${formatCurrency(paymentAmount)} recorded successfully! Receipt #${newPay.receiptNumber} generated.`
      );

      // Refresh selected student data from updated list
      const updated = students.find((s) => s.id === selectedStudent.id);
      if (updated) setSelectedStudent(updated);
    } catch (err) {
      toast.error('Failed to process payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
            Fee Collection Counter
          </h1>
          <p className="text-[13px] text-[#334155]">
            Fast-entry cashier workspace for recording cash, bank, online and cheque fee settlements.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-[#f1f5f9] px-3 py-1 text-[12px] font-semibold text-[#1e3a5f]">
          <ShieldCheck className="h-4 w-4" />
          <span>Cashier Terminal: Counter 01</span>
        </div>
      </div>

      {/* Prominent Student Search Header */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-2xs">
        <label className="block text-[13px] font-semibold text-[#0f172a] mb-2">
          Find Student Fee Account
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-5 w-5 text-[#64748b]" />
          <input
            type="text"
            placeholder="Type student name (e.g. 'Hamza'), roll number (e.g. '11A-104'), or admission number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-[#e2e8f0] bg-[#f8f9fb] pl-11 pr-4 py-2.5 text-[14px] text-[#0f172a] placeholder-[#64748b] focus:border-[#1e3a5f] focus:bg-white focus:outline-none"
          />

          {/* Quick Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-12 z-20 rounded-lg border border-[#e2e8f0] bg-white shadow-xl overflow-hidden">
              <div className="p-2 border-b border-[#e2e8f0] text-[11px] font-semibold text-[#64748b] uppercase">
                Matching Student Accounts ({searchResults.length})
              </div>
              <div className="divide-y divide-[#e2e8f0] max-h-64 overflow-y-auto">
                {searchResults.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectStudent(s)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-[#f8f9fb] transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-[#0f172a] text-[13px]">{s.fullName}</div>
                      <div className="text-[11px] text-[#334155]">
                        Roll: <span className="font-mono text-[#1e3a5f]">{s.rollNumber}</span> · Class {s.class}-{s.section} · S/O {s.fatherName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold tabular-nums text-[13px] text-[#0f172a]">
                        {formatCurrency(s.outstandingBalance)}
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                          s.feeStatus === 'Paid'
                            ? 'bg-[#f0fdf4] text-[#166534]'
                            : s.feeStatus === 'Pending'
                            ? 'bg-[#fefce8] text-[#854d0e]'
                            : 'bg-[#fef2f2] text-[#991b1b]'
                        }`}
                      >
                        {s.feeStatus}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Student Active Counter */}
      {selectedStudent ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Student Info & Unpaid Invoices */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Identity Card */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#1e3a5f] text-white font-bold">
                    {selectedStudent.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#0f172a]">{selectedStudent.fullName}</h2>
                    <p className="text-[12px] text-[#334155]">
                      Class {selectedStudent.class}-{selectedStudent.section} · Roll: <span className="font-mono text-[#1e3a5f]">{selectedStudent.rollNumber}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      selectedStudent.feeStatus === 'Paid'
                        ? 'bg-[#f0fdf4] text-[#166534]'
                        : selectedStudent.feeStatus === 'Pending'
                        ? 'bg-[#fefce8] text-[#854d0e]'
                        : 'bg-[#fef2f2] text-[#991b1b]'
                    }`}
                  >
                    {selectedStudent.feeStatus}
                  </span>
                  <div className="text-[10px] text-[#334155] mt-0.5 font-mono">
                    {selectedStudent.admissionNumber}
                  </div>
                </div>
              </div>

              {/* Balances bar */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-[#f8f9fb] border border-[#e2e8f0]">
                  <span className="text-[11px] text-[#334155] block">Total Outstanding</span>
                  <span className="text-lg font-bold text-[#0f172a] tabular-nums">
                    {formatCurrency(selectedStudent.outstandingBalance)}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#f8f9fb] border border-[#e2e8f0]">
                  <span className="text-[11px] text-[#334155] block">Overdue Amount</span>
                  <span className="text-lg font-bold text-[#991b1b] tabular-nums">
                    {formatCurrency(selectedStudent.overdueBalance)}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#f8f9fb] border border-[#e2e8f0]">
                  <span className="text-[11px] text-[#334155] block">Available Credit</span>
                  <span className="text-lg font-bold text-[#166534] tabular-nums">
                    {formatCurrency(selectedStudent.advanceCredit)}
                  </span>
                </div>
              </div>
            </div>

            {/* Invoices to Settle */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold text-[#0f172a]">Unpaid & Pending Invoices</h3>
                  <p className="text-[12px] text-[#334155]">Select which challan(s) to apply payment toward</p>
                </div>
                <span className="text-[12px] font-bold text-[#1e3a5f]">
                  Selected Total: {formatCurrency(totalSelectedInvoicesAmount)}
                </span>
              </div>

              {studentInvoices.length === 0 ? (
                <div className="p-8 text-center text-[#166534]">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-semibold text-sm">All Invoices Settled!</div>
                  <p className="text-[12px] text-[#334155]">This student has zero outstanding challans for the current cycle.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#e2e8f0]">
                  {studentInvoices.map((inv) => {
                    const isSelected = selectedInvoiceIds.includes(inv.id);
                    return (
                      <div
                        key={inv.id}
                        onClick={() => toggleInvoiceSelect(inv.id)}
                        className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#f1f5f9]' : 'hover:bg-[#f8f9fb]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleInvoiceSelect(inv.id)}
                            className="rounded border-[#cbd5e1] text-[#1e3a5f] focus:ring-0"
                          />
                          <div>
                            <div className="font-semibold text-[13px] text-[#0f172a]">
                              {inv.invoiceNumber} — {inv.billingPeriod}
                            </div>
                            <div className="text-[11px] text-[#334155]">
                              Due: <span className="text-[#991b1b] font-medium">{formatDate(inv.dueDate)}</span> · Late Fee: {formatCurrency(inv.lateFee)}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-bold tabular-nums text-[#0f172a]">
                            {formatCurrency(inv.remainingAmount)}
                          </div>
                          <span className="text-[10px] text-[#334155]">Remaining of {formatCurrency(inv.totalAmount)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right 1 Col: Payment Collection Form */}
          <div className="space-y-6">
            <form onSubmit={handleOpenConfirm} className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-2xs space-y-4">
              <h3 className="text-[15px] font-semibold text-[#0f172a] border-b border-[#e2e8f0] pb-2">
                Payment Form
              </h3>

              {/* Amount input & quick buttons */}
              <div>
                <label className="block text-[12px] font-semibold text-[#0f172a] mb-1">
                  Amount Being Collected (Rs.) <span className="text-[#991b1b]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[13px] font-bold text-[#334155]">Rs.</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={paymentAmount || ''}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full rounded-md border border-[#e2e8f0] pl-10 pr-3 py-2 text-lg font-bold text-[#0f172a] focus:border-[#1e3a5f] focus:outline-none tabular-nums"
                  />
                </div>

                {/* Quick amount shortcuts */}
                <div className="flex gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => handleQuickAmount('full')}
                    className="flex-1 rounded border border-[#e2e8f0] bg-[#f8f9fb] py-1 text-[11px] font-medium text-[#0f172a] hover:bg-[#f1f5f9] hover:text-[#1e3a5f]"
                  >
                    Full Balance
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAmount('half')}
                    className="flex-1 rounded border border-[#e2e8f0] bg-[#f8f9fb] py-1 text-[11px] font-medium text-[#0f172a] hover:bg-[#f1f5f9] hover:text-[#1e3a5f]"
                  >
                    50% Partial
                  </button>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-[12px] font-semibold text-[#0f172a] mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Cash', 'Bank Transfer', 'Online Payment', 'Cheque'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2.5 rounded-lg border text-left text-[12px] font-semibold transition-all ${
                        paymentMethod === method
                          ? 'border-[#1e3a5f] bg-[#f1f5f9] text-[#1e3a5f]'
                          : 'border-[#e2e8f0] bg-white text-[#334155] hover:bg-[#f8f9fb]'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference / Bank info */}
              {paymentMethod !== 'Cash' && paymentMethod !== 'Cheque' && (
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">
                    Bank / Transaction Reference #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ABL-TRX-994821 or Easypaisa TID"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                  />
                </div>
              )}

              {/* Cheque Details */}
              {paymentMethod === 'Cheque' && (
                <div className="p-3 rounded-lg border border-[#e2e8f0] bg-[#f8f9fb] space-y-2">
                  <div>
                    <label className="block text-[11px] font-medium text-[#334155]">Cheque Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CHQ-884102"
                      value={chequeNumber}
                      onChange={(e) => setChequeNumber(e.target.value)}
                      className="w-full rounded border border-[#e2e8f0] bg-white px-2 py-1 text-[12px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#334155]">Drawee Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full rounded border border-[#e2e8f0] bg-white px-2 py-1 text-[12px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#334155]">Expected Clearing Date</label>
                    <input
                      type="date"
                      value={clearingDate}
                      onChange={(e) => setClearingDate(e.target.value)}
                      className="w-full rounded border border-[#e2e8f0] bg-white px-2 py-1 text-[12px]"
                    />
                  </div>
                </div>
              )}

              {/* Internal Notes */}
              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Internal Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Paid in cash at counter 01"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                />
              </div>

              {/* Real-time Summary Card */}
              <div className="p-3.5 rounded-lg border border-[#e2e8f0] bg-[#f8f9fb] space-y-1.5 text-[12px]">
                <div className="flex justify-between text-[#334155]">
                  <span>Total Selected Invoices:</span>
                  <span className="font-semibold text-[#0f172a] tabular-nums">{formatCurrency(totalSelectedInvoicesAmount)}</span>
                </div>
                <div className="flex justify-between text-[#334155]">
                  <span>Amount Paying Now:</span>
                  <span className="font-bold text-[#166534] tabular-nums">{formatCurrency(paymentAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-[#e2e8f0] pt-1.5 font-bold">
                  <span>Projected Remaining Balance:</span>
                  <span className="text-[#1e3a5f] tabular-nums">
                    {formatCurrency(Math.max(0, selectedStudent.outstandingBalance - paymentAmount))}
                  </span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={paymentAmount <= 0}
                className="w-full rounded-md bg-[#1e3a5f] py-2.5 text-[13px] font-bold text-white shadow-xs hover:bg-[#142842] disabled:opacity-50 transition-colors"
              >
                Record Payment & Print Receipt
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-white p-12 text-center text-[#334155]">
          <User className="h-10 w-10 text-[#64748b] mx-auto mb-2" />
          <h3 className="text-base font-semibold text-[#0f172a]">Search and Select a Student Account</h3>
          <p className="text-[13px] max-w-md mx-auto mt-1">
            Use the search box above to lookup any student by name, roll number, or admission number to load their fee record and record payment.
          </p>
        </div>
      )}

      {/* Confirmation Modal Dialog */}
      {confirmModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#0f172a]">Confirm Fee Payment</h3>
            <p className="text-[13px] text-[#334155]">
              Please verify the fee collection details before committing this transaction:
            </p>

            <div className="rounded-lg border border-[#e2e8f0] p-3.5 bg-[#f8f9fb] space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#334155]">Student:</span>
                <span className="font-semibold text-[#0f172a]">{selectedStudent.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#334155]">Roll Number / Class:</span>
                <span className="font-semibold text-[#0f172a]">{selectedStudent.rollNumber} ({selectedStudent.class}-{selectedStudent.section})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#334155]">Method:</span>
                <span className="font-semibold text-[#0f172a]">{paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-[#e2e8f0] pt-2 text-base font-bold">
                <span>Amount Collected:</span>
                <span className="text-[#166534] tabular-nums">{formatCurrency(paymentAmount)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="rounded px-4 py-1.5 text-[12px] text-[#334155]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isSubmitting}
                className="rounded bg-[#166534] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-[#126b49]"
              >
                {isSubmitting ? 'Recording...' : 'Confirm & Generate Receipt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Receipt Modal Preview */}
      {completedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3 no-print">
              <span className="text-[14px] font-semibold text-[#0f172a]">Receipt Generated Successfully</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
                >
                  <Printer className="h-3.5 w-3.5" /> Print
                </button>
                <button onClick={() => setCompletedPayment(null)} className="text-[#334155] hover:text-[#0f172a]">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Official Printable Receipt Document */}
            <div className="space-y-4 text-[12px] bg-white p-3">
              <div className="text-center border-b border-[#e2e8f0] pb-3">
                <h3 className="font-bold text-[16px] text-[#0f172a]">{settings.collegeName}</h3>
                <p className="text-[11px] text-[#334155]">{settings.address}</p>
                <div className="mt-1 font-mono text-[14px] font-bold text-[#1e3a5f]">
                  RECEIPT #: {completedPayment.receiptNumber}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#334155]">Payment Date:</span>
                  <span className="font-medium text-[#0f172a]">{formatDate(completedPayment.paymentDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#334155]">Student:</span>
                  <span className="font-semibold text-[#0f172a]">{completedPayment.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#334155]">Roll Number / Class:</span>
                  <span className="font-medium text-[#0f172a]">{completedPayment.rollNumber} ({completedPayment.class}-{completedPayment.section})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#334155]">Payment Method:</span>
                  <span className="font-medium text-[#0f172a]">{completedPayment.paymentMethod}</span>
                </div>
                {completedPayment.referenceNumber && (
                  <div className="flex justify-between">
                    <span className="text-[#334155]">Reference:</span>
                    <span className="font-mono text-[#0f172a]">{completedPayment.referenceNumber}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#e2e8f0] text-base font-bold">
                  <span>Total Amount Paid:</span>
                  <span className="text-[#166534] tabular-nums">{formatCurrency(completedPayment.amount)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e2e8f0] text-[10px] text-[#334155] text-center">
                Cashier: {completedPayment.recordedBy}
                <div className="mt-1">{settings.receiptFooter}</div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#e2e8f0] no-print">
              <button
                onClick={() => setCompletedPayment(null)}
                className="rounded bg-[#1e3a5f] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
              >
                Close & Next Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FeeCollectionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#334155]">Loading fee collection counter...</div>}>
      <FeeCollectionContent />
    </Suspense>
  );
}
