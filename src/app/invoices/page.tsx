'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Download,
  Printer,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Building2,
  QrCode,
  X,
  Layers,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { Invoice, InvoiceStatus } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

function InvoicesContent() {
  const searchParams = useSearchParams();
  const highlightedId = searchParams.get('id');

  const { invoices, bulkGenerateInvoices, settings, simulateWhatsAppBatch } = useFeeApp();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Sorting
  const [sortField, setSortField] = useState<keyof Invoice>('invoiceNumber');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Modal State
  const [activeChallanInvoice, setActiveChallanInvoice] = useState<Invoice | null>(
    highlightedId ? invoices.find((i) => i.id === highlightedId) || null : null
  );

  // Bulk Generation Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardSession, setWizardSession] = useState('2026–2027');
  const [wizardPeriod, setWizardPeriod] = useState('December 2026');
  const [wizardClasses, setWizardClasses] = useState<string[]>(['9th', '10th', '11th', '12th']);
  const [wizardDueDate, setWizardDueDate] = useState('2026-12-10');

  // Filtered & Sorted Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.studentName.toLowerCase().includes(q) ||
        inv.rollNumber.toLowerCase().includes(q);

      const matchesClass = selectedClass === 'All' || inv.class === selectedClass;
      const matchesStatus = selectedStatus === 'All' || inv.status === selectedStatus;
      const matchesPeriod = selectedPeriod === 'All' || inv.billingPeriod === selectedPeriod;

      return matchesSearch && matchesClass && matchesStatus && matchesPeriod;
    });
  }, [invoices, searchQuery, selectedClass, selectedStatus, selectedPeriod]);

  const sortedInvoices = useMemo(() => {
    return [...filteredInvoices].sort((a, b) => {
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
  }, [filteredInvoices, sortField, sortAsc]);

  // Paginated Invoices
  const totalPages = Math.ceil(sortedInvoices.length / pageSize) || 1;
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedInvoices.slice(start, start + pageSize);
  }, [sortedInvoices, currentPage, pageSize]);

  const handleSort = (field: keyof Invoice) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleBulkGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = bulkGenerateInvoices({
      academicSession: wizardSession,
      billingPeriod: wizardPeriod,
      classes: wizardClasses,
      dueDate: wizardDueDate,
    });

    if (result.generatedCount > 0) {
      toast.success(
        `Successfully generated ${result.generatedCount} invoices for ${wizardPeriod}! (${result.duplicateCount} duplicates prevented).`
      );
    } else {
      toast.info(`All eligible students already have invoices for ${wizardPeriod}. No duplicates generated.`);
    }

    setIsWizardOpen(false);
  };

  const handleSendWhatsAppChallan = (inv: Invoice) => {
    simulateWhatsAppBatch({
      recipientStudentIds: [inv.studentId],
      templateCategory: 'Fee Due Reminder',
      customMessageBody: `Assalam-o-Alaikum, fee challan #${inv.invoiceNumber} for ${inv.studentName} (${inv.class}-${inv.section}) amounting to ${formatCurrency(inv.totalAmount)} is due on ${formatDate(inv.dueDate)}. Allied Bank A/C 0124-5541098. Jammu Kashmir College.`,
    });
    toast.success(`Challan #${inv.invoiceNumber} simulated to WhatsApp recipient (${inv.guardianPhone})`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
            Invoices & Fee Challans
          </h1>
          <p className="text-[13px] text-[#334155]">
            Bulk cycle generation, printable A4 3-part bank challans, and real-time settlement tracking.
          </p>
        </div>

        <button
          onClick={() => setIsWizardOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3.5 py-1.5 text-[12px] font-medium text-white shadow-xs hover:bg-[#142842] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Generate Bulk Invoices</span>
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
              placeholder="Search invoice number, student..."
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
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Billing Period Filter */}
          <div>
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-[#e2e8f0] bg-[#f8f9fb] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:bg-white focus:outline-none"
            >
              <option value="All">All Billing Periods</option>
              <option value="November 2026">November 2026</option>
              <option value="October 2026">October 2026</option>
              <option value="December 2026">December 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                <th
                  onClick={() => handleSort('invoiceNumber')}
                  className="py-3 px-4 cursor-pointer hover:text-[#0f172a]"
                >
                  <div className="flex items-center gap-1">
                    <span>Invoice #</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Billing Period</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th
                  onClick={() => handleSort('remainingAmount')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#0f172a]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Remaining</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {paginatedInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#f8f9fb] transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-[#1e3a5f]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#0f172a]">
                    {inv.studentName}
                    <div className="text-[11px] text-[#334155]">Roll: {inv.rollNumber}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#f1f5f9] text-[#0f172a]">
                      {inv.class}-{inv.section}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#334155]">
                    {inv.billingPeriod}
                  </td>
                  <td className="py-3 px-4 text-[#334155] text-[12px]">
                    {formatDate(inv.dueDate)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-[#0f172a]">
                    {formatCurrency(inv.totalAmount)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-[#166534]">
                    {formatCurrency(inv.paidAmount)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums font-bold text-[#0f172a]">
                    {formatCurrency(inv.remainingAmount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        inv.status === 'Paid'
                          ? 'bg-[#f0fdf4] text-[#166534]'
                          : inv.status === 'Partially Paid'
                          ? 'bg-[#fefce8] text-[#854d0e]'
                          : 'bg-[#fef2f2] text-[#991b1b]'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setActiveChallanInvoice(inv)}
                        className="p-1 text-[#334155] hover:text-[#1e3a5f] rounded hover:bg-[#f1f5f9]"
                        title="View printable 3-part Challan"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSendWhatsAppChallan(inv)}
                        className="p-1 text-[#334155] hover:text-[#166534] rounded hover:bg-[#f0fdf4]"
                        title="Simulate WhatsApp Challan dispatch"
                      >
                        <Send className="h-4 w-4" />
                      </button>
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
            <span>of {sortedInvoices.length} invoices</span>
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

      {/* Modal: Bulk Invoice Generation Wizard */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <div>
                <h3 className="text-[16px] font-bold text-[#0f172a]">Bulk Invoice Generator</h3>
                <p className="text-[12px] text-[#334155]">Generate monthly fee challans with duplicate prevention</p>
              </div>
              <button onClick={() => setIsWizardOpen(false)} className="text-[#334155] hover:text-[#0f172a]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBulkGenerateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Academic Session</label>
                  <input
                    type="text"
                    value={wizardSession}
                    onChange={(e) => setWizardSession(e.target.value)}
                    className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Billing Period</label>
                  <input
                    type="text"
                    value={wizardPeriod}
                    onChange={(e) => setWizardPeriod(e.target.value)}
                    placeholder="e.g. December 2026"
                    className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Due Date</label>
                <input
                  type="date"
                  value={wizardDueDate}
                  onChange={(e) => setWizardDueDate(e.target.value)}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Select Target Classes</label>
                <div className="flex gap-2">
                  {['9th', '10th', '11th', '12th'].map((cls) => {
                    const isChecked = wizardClasses.includes(cls);
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => {
                          setWizardClasses((prev) =>
                            isChecked ? prev.filter((c) => c !== cls) : [...prev, cls]
                          );
                        }}
                        className={`flex-1 py-1.5 rounded border text-[12px] font-medium transition-colors ${
                          isChecked
                            ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                            : 'bg-white text-[#334155] border-[#e2e8f0]'
                        }`}
                      >
                        {cls}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-[#e2e8f0] bg-[#f8f9fb] text-[12px] text-[#334155] space-y-1">
                <span className="font-semibold text-[#0f172a] block">Duplicate Protection Rule:</span>
                Students who already have an invoice for <strong>{wizardPeriod}</strong> will be skipped automatically to prevent double-billing.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(false)}
                  className="rounded px-4 py-1.5 text-[12px] text-[#334155]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-[#1e3a5f] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
                >
                  Generate Invoices
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Printable 3-Part Bank Challan */}
      {activeChallanInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl my-6">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3 mb-4 no-print">
              <span className="text-[14px] font-semibold text-[#0f172a]">
                Official Fee Challan — {activeChallanInvoice.invoiceNumber}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSendWhatsAppChallan(activeChallanInvoice)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#e2e8f0] px-3 py-1.5 text-[12px] font-medium text-[#166534] hover:bg-[#f0fdf4]"
                >
                  <Send className="h-3.5 w-3.5" /> Send via WhatsApp
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
                >
                  <Printer className="h-3.5 w-3.5" /> Print 3-Part Challan
                </button>
                <button onClick={() => setActiveChallanInvoice(null)} className="text-[#334155] hover:text-[#0f172a]">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 3-Part Challan Document Body */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-[#e2e8f0] p-4 text-[11px] bg-white">
              {['BANK COPY', 'COLLEGE COPY', 'STUDENT COPY'].map((copyName) => (
                <div key={copyName} className="border-r last:border-r-0 border-dashed border-[#cbd5e1] pr-3 last:pr-0 space-y-2.5">
                  <div className="text-center border-b border-[#e2e8f0] pb-2">
                    <h3 className="font-bold text-[13px] text-[#0f172a]">{settings.collegeName}</h3>
                    <p className="text-[10px] text-[#334155]">Allied Bank Ltd · Mirpur Branch</p>
                    <p className="font-mono text-[10px] text-[#1e3a5f] font-semibold">A/C # 0124-5541098</p>
                    <span className="inline-block mt-1 bg-[#f1f5f9] text-[#1e3a5f] px-2 py-0.5 rounded text-[10px] font-bold">
                      {copyName}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p><strong>Challan No:</strong> <span className="font-mono">{activeChallanInvoice.invoiceNumber}</span></p>
                    <p><strong>Billing:</strong> {activeChallanInvoice.billingPeriod}</p>
                    <p><strong>Due Date:</strong> <span className="text-[#991b1b] font-semibold">{formatDate(activeChallanInvoice.dueDate)}</span></p>
                    <p><strong>Student:</strong> {activeChallanInvoice.studentName}</p>
                    <p><strong>Father:</strong> {activeChallanInvoice.fatherName}</p>
                    <p><strong>Class:</strong> {activeChallanInvoice.class}-{activeChallanInvoice.section} (Roll: {activeChallanInvoice.rollNumber})</p>
                  </div>

                  <table className="w-full text-left border-t border-b border-[#e2e8f0] my-2 text-[10px]">
                    <tbody>
                      {activeChallanInvoice.items.map((it, idx) => (
                        <tr key={idx} className="border-b border-[#e2e8f0] last:border-b-0">
                          <td className="py-1">{it.feeHeadName}</td>
                          <td className="py-1 text-right tabular-nums">{formatCurrency(it.amount)}</td>
                        </tr>
                      ))}
                      {activeChallanInvoice.previousBalance > 0 && (
                        <tr className="border-b border-[#e2e8f0]">
                          <td className="py-1 text-[#854d0e]">Previous Arrears</td>
                          <td className="py-1 text-right text-[#854d0e] tabular-nums">{formatCurrency(activeChallanInvoice.previousBalance)}</td>
                        </tr>
                      )}
                      {activeChallanInvoice.lateFee > 0 && (
                        <tr className="border-b border-[#e2e8f0]">
                          <td className="py-1 text-[#991b1b]">Late Fee Surcharge</td>
                          <td className="py-1 text-right text-[#991b1b] tabular-nums">{formatCurrency(activeChallanInvoice.lateFee)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-center font-bold text-[12px] pt-1">
                    <span>Net Payable:</span>
                    <span className="tabular-nums text-[#1e3a5f]">{formatCurrency(activeChallanInvoice.totalAmount)}</span>
                  </div>

                  {/* QR Code placeholder */}
                  <div className="pt-2 flex items-center justify-between text-[9px] text-[#334155]">
                    <div className="flex items-center gap-1">
                      <QrCode className="h-6 w-6 text-[#0f172a]" />
                      <span>Online Portal Verification</span>
                    </div>
                    <span>Stamp / Sign</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#334155]">Loading invoices...</div>}>
      <InvoicesContent />
    </Suspense>
  );
}
