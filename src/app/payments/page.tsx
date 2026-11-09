'use client';

import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Search,
  Filter,
  Download,
  Printer,
  RotateCcw,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Building2,
  X,
  ShieldAlert,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { Payment } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function PaymentsPage() {
  const { payments, reversePayment, settings } = useFeeApp();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedMethod, setSelectedMethod] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Sorting
  const [sortField, setSortField] = useState<keyof Payment>('receiptNumber');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Detail Modal & Reversal Modal
  const [activePaymentDetail, setActivePaymentDetail] = useState<Payment | null>(null);
  const [reversalModalPayment, setReversalModalPayment] = useState<Payment | null>(null);
  const [reversalReason, setReversalReason] = useState('Cheque dishonoured / bank bounce advice received.');

  // Filtered & Sorted Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.receiptNumber.toLowerCase().includes(q) ||
        p.studentName.toLowerCase().includes(q) ||
        p.rollNumber.toLowerCase().includes(q) ||
        (p.referenceNumber && p.referenceNumber.toLowerCase().includes(q));

      const matchesClass = selectedClass === 'All' || p.class === selectedClass;
      const matchesMethod = selectedMethod === 'All' || p.paymentMethod === selectedMethod;
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;

      return matchesSearch && matchesClass && matchesMethod && matchesStatus;
    });
  }, [payments, searchQuery, selectedClass, selectedMethod, selectedStatus]);

  const sortedPayments = useMemo(() => {
    return [...filteredPayments].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredPayments, sortField, sortAsc]);

  // Paginated Payments
  const totalPages = Math.ceil(sortedPayments.length / pageSize) || 1;
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedPayments.slice(start, start + pageSize);
  }, [sortedPayments, currentPage, pageSize]);

  const handleSort = (field: keyof Payment) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCSV = () => {
    const rows = sortedPayments.map((p) => ({
      ReceiptNumber: p.receiptNumber,
      Date: p.paymentDate,
      StudentName: p.studentName,
      RollNumber: p.rollNumber,
      Class: `${p.class}-${p.section}`,
      Amount: p.amount,
      Method: p.paymentMethod,
      Reference: p.referenceNumber || '-',
      Status: p.status,
      RecordedBy: p.recordedBy,
    }));

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        Object.keys(rows[0] || {}).join(','),
        ...rows.map((r) => Object.values(r).join(',')),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JKC_Payments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${rows.length} payment records to CSV`);
  };

  const handleConfirmReversal = () => {
    if (!reversalModalPayment) return;
    if (!reversalReason.trim()) {
      toast.error('A formal justification reason is required for payment reversal');
      return;
    }

    reversePayment(reversalModalPayment.id, reversalReason);
    toast.success(`Transaction ${reversalModalPayment.receiptNumber} reversed. Balance restored to student ledger.`);
    setReversalModalPayment(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
            Payment Receipts & History
          </h1>
          <p className="text-[13px] text-[#334155]">
            Audited transaction ledger, receipt reprints, and reversible settlement records.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#0f172a] shadow-2xs hover:bg-[#f8f9fb] transition-colors"
        >
          <Download className="h-3.5 w-3.5 text-[#334155]" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search receipt #, student name, roll..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-[#e2e8f0] bg-[#f8f9fb] pl-9 pr-3 py-1.5 text-[13px] text-[#0f172a] placeholder-[#64748b] focus:border-[#1e3a5f] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-[#e2e8f0] bg-[#f8f9fb] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:bg-white focus:outline-none"
            >
              <option value="All">All Classes</option>
              <option value="9th">9th</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <select
              value={selectedMethod}
              onChange={(e) => {
                setSelectedMethod(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-[#e2e8f0] bg-[#f8f9fb] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:bg-white focus:outline-none"
            >
              <option value="All">All Methods</option>
              <option value="Cash">Cash Counter</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Online Payment">Online Payment</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-[#e2e8f0] bg-[#f8f9fb] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:bg-white focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Reversed">Reversed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                <th
                  onClick={() => handleSort('receiptNumber')}
                  className="py-3 px-4 cursor-pointer hover:text-[#0f172a]"
                >
                  <div className="flex items-center gap-1">
                    <span>Receipt #</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('paymentDate')}
                  className="py-3 px-4 cursor-pointer hover:text-[#0f172a]"
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Recorded By</th>
                <th
                  onClick={() => handleSort('amount')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#0f172a]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {paginatedPayments.map((p) => (
                <tr key={p.id} className="hover:bg-[#f8f9fb] transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-[#1e3a5f]">
                    {p.receiptNumber}
                  </td>
                  <td className="py-3 px-4 text-[#334155] text-[12px]">
                    {formatDate(p.paymentDate)}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#0f172a]">
                    {p.studentName}
                    <div className="text-[11px] text-[#334155]">Roll: {p.rollNumber}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#f1f5f9] text-[#0f172a]">
                      {p.class}-{p.section}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#0f172a] font-medium">
                    {p.paymentMethod}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#334155]">
                    {p.referenceNumber || (p.chequeDetails ? p.chequeDetails.chequeNumber : '-')}
                  </td>
                  <td className="py-3 px-4 text-[#334155] text-[12px]">
                    {p.recordedBy}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#166534] tabular-nums">
                    {p.status === 'Reversed' ? (
                      <span className="line-through text-[#334155]">{formatCurrency(p.amount)}</span>
                    ) : (
                      formatCurrency(p.amount)
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        p.status === 'Completed'
                          ? 'bg-[#f0fdf4] text-[#166534]'
                          : 'bg-[#fef2f2] text-[#991b1b]'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setActivePaymentDetail(p)}
                        className="p-1 text-[#334155] hover:text-[#1e3a5f] rounded hover:bg-[#f1f5f9]"
                        title="View / Print Receipt"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      {p.status === 'Completed' && (
                        <button
                          onClick={() => setReversalModalPayment(p)}
                          className="p-1 text-[#334155] hover:text-[#991b1b] rounded hover:bg-[#fef2f2]"
                          title="Reverse Transaction"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-t border-[#e2e8f0] gap-3 text-[12px] text-[#334155]">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded border border-[#e2e8f0] bg-white px-2 py-1 text-[12px] text-[#0f172a]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>of {sortedPayments.length} payments</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded border border-[#e2e8f0] bg-white text-[#334155] hover:bg-[#f8f9fb] disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded border border-[#e2e8f0] bg-white text-[#334155] hover:bg-[#f8f9fb] disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: View & Print Receipt Detail */}
      {activePaymentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3 no-print">
              <span className="text-[14px] font-semibold text-[#0f172a]">Payment Receipt</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
                >
                  <Printer className="h-3.5 w-3.5" /> Print
                </button>
                <button onClick={() => setActivePaymentDetail(null)} className="text-[#334155] hover:text-[#0f172a]">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4 text-[12px] bg-white p-2">
              <div className="text-center border-b border-[#e2e8f0] pb-3">
                <h3 className="font-bold text-[16px] text-[#0f172a]">{settings.collegeName}</h3>
                <p className="text-[11px] text-[#334155]">{settings.address}</p>
                <div className="mt-1 font-mono text-[14px] font-bold text-[#1e3a5f]">
                  RECEIPT #: {activePaymentDetail.receiptNumber}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#334155]">Payment Date:</span>
                  <span className="font-medium text-[#0f172a]">{formatDate(activePaymentDetail.paymentDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#334155]">Student Name:</span>
                  <span className="font-semibold text-[#0f172a]">{activePaymentDetail.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#334155]">Roll Number / Class:</span>
                  <span className="font-medium text-[#0f172a]">{activePaymentDetail.rollNumber} ({activePaymentDetail.class}-{activePaymentDetail.section})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#334155]">Method:</span>
                  <span className="font-medium text-[#0f172a]">{activePaymentDetail.paymentMethod}</span>
                </div>
                {activePaymentDetail.referenceNumber && (
                  <div className="flex justify-between">
                    <span className="text-[#334155]">Ref / TID:</span>
                    <span className="font-mono text-[#0f172a]">{activePaymentDetail.referenceNumber}</span>
                  </div>
                )}
                {activePaymentDetail.chequeDetails && (
                  <div className="p-2 bg-[#f8f9fb] rounded border border-[#e2e8f0] text-[11px] space-y-0.5">
                    <div><strong>Cheque:</strong> {activePaymentDetail.chequeDetails.chequeNumber}</div>
                    <div><strong>Bank:</strong> {activePaymentDetail.chequeDetails.bankName}</div>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#e2e8f0] text-base font-bold">
                  <span>Amount Paid:</span>
                  <span className="text-[#166534] tabular-nums">{formatCurrency(activePaymentDetail.amount)}</span>
                </div>

                {activePaymentDetail.status === 'Reversed' && (
                  <div className="p-2 bg-[#fef2f2] rounded border border-[#fecaca] text-[#991b1b] text-[11px]">
                    <strong>TRANSACTION REVERSED:</strong> {activePaymentDetail.reversalReason}
                    <div className="text-[10px] text-[#334155] mt-0.5">Reversed by {activePaymentDetail.reversedBy} on {activePaymentDetail.reversedAt}</div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#e2e8f0] text-[10px] text-[#334155] text-center">
                Cashier: {activePaymentDetail.recordedBy}
                <div className="mt-1">{settings.receiptFooter}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmation for Payment Reversal */}
      {reversalModalPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-[#991b1b]">
              <ShieldAlert className="h-6 w-6" />
              <h3 className="text-base font-bold text-[#0f172a]">Reverse Financial Transaction</h3>
            </div>
            <p className="text-[13px] text-[#334155] leading-relaxed">
              You are about to reverse payment <strong>{reversalModalPayment.receiptNumber}</strong> of{' '}
              <strong>{formatCurrency(reversalModalPayment.amount)}</strong> for{' '}
              <strong>{reversalModalPayment.studentName}</strong>.
              <br />
              <br />
              This will restore the outstanding balance onto the student ledger and mark this receipt as reversed in the audit trail.
            </p>

            <div>
              <label className="block text-[12px] font-semibold text-[#0f172a] mb-1">
                Reason for Reversal <span className="text-[#991b1b]">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                placeholder="e.g. Dishonoured cheque / cash entry error"
                className="w-full rounded border border-[#e2e8f0] p-2 text-[13px] text-[#0f172a]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReversalModalPayment(null)}
                className="rounded px-4 py-1.5 text-[12px] text-[#334155]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReversal}
                className="rounded bg-[#991b1b] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-[#b03d3d]"
              >
                Confirm Reversal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
