'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  Users,
  Wallet,
  FileText,
  Receipt,
  Percent,
  MessageCircle,
  Printer,
  Pencil,
  ArrowLeft,
  CalendarDays,
  Phone,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Send,
  Eye,
  Building2,
  X,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';

function StudentProfileContent() {
  const router = useRouter();
  const rawParams = useParams();
  const studentId = (rawParams?.id as string) || '';

  const {
    getStudentById,
    updateStudent,
    invoices,
    payments,
    adjustments,
    notifications,
    settings,
    simulateWhatsAppBatch,
  } = useFeeApp();

  const student = getStudentById(studentId);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'overview' | 'ledger' | 'invoices' | 'payments' | 'adjustments' | 'notifications'>('overview');

  // Modals state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStatementOpen, setIsStatementOpen] = useState(false);
  const [selectedInvoiceChallan, setSelectedInvoiceChallan] = useState<string | null>(null);
  const [selectedPaymentReceipt, setSelectedPaymentReceipt] = useState<string | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    fullName: student?.fullName || '',
    fatherName: student?.fatherName || '',
    guardianPhone: student?.guardianPhone || '',
    studentPhone: student?.studentPhone || '',
    monthlyTuition: student?.monthlyTuition || 3500,
  });

  if (!student) {
    return (
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-12 text-center">
        <Users className="h-10 w-10 text-[#64748b] mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[#0f172a]">Student Not Found</h2>
        <p className="text-[13px] text-[#334155] mt-1 mb-4">
          The requested student ID &ldquo;{studentId}&rdquo; does not exist or has been removed.
        </p>
        <Link
          href="/students"
          className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-4 py-2 text-[12px] font-medium text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Students List
        </Link>
      </div>
    );
  }

  // Related data
  const studentInvoices = invoices.filter((i) => i.studentId === student.id);
  const studentPayments = payments.filter((p) => p.studentId === student.id);
  const studentAdjustments = adjustments.filter((a) => a.studentId === student.id);
  const studentNotifications = notifications.filter((n) => n.studentId === student.id);

  // Calculate totals
  const totalInvoiced = studentInvoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPaid = studentPayments.filter((p) => p.status === 'Completed').reduce((acc, p) => acc + p.amount, 0);

  // Build Chronological Fee Ledger
  interface LedgerEntry {
    date: string;
    description: string;
    type: 'Debit' | 'Credit';
    amount: number;
    reference: string;
  }

  const ledgerEntries: LedgerEntry[] = [
    ...studentInvoices.map((inv) => ({
      date: inv.issueDate,
      description: `Invoice Generated (${inv.billingPeriod})`,
      type: 'Debit' as const,
      amount: inv.totalAmount,
      reference: inv.invoiceNumber,
    })),
    ...studentPayments.filter((p) => p.status === 'Completed').map((pay) => ({
      date: pay.paymentDate,
      description: `Fee Payment Received (${pay.paymentMethod})`,
      type: 'Credit' as const,
      amount: pay.amount,
      reference: pay.receiptNumber,
    })),
    ...studentAdjustments.filter((a) => a.status === 'Approved').map((adj) => ({
      date: adj.date,
      description: `Discount Applied: ${adj.adjustmentType}`,
      type: 'Credit' as const,
      amount: adj.amount,
      reference: 'ADJUSTMENT',
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Running balance calculation
  let running = 0;
  const ledgerWithBalance = ledgerEntries.map((entry) => {
    if (entry.type === 'Debit') {
      running += entry.amount;
    } else {
      running -= entry.amount;
    }
    return { ...entry, runningBalance: running };
  });

  const handleSendReminder = () => {
    if (student.outstandingBalance === 0) {
      toast.info('Student account is fully cleared. No reminder required.');
      return;
    }
    const res = simulateWhatsAppBatch({
      recipientStudentIds: [student.id],
      templateCategory: 'Overdue Fee Reminder',
    });
    toast.success(`WhatsApp reminder simulated to guardian ${student.fatherName} (${student.guardianPhone})`);
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent(student.id, {
      fullName: editForm.fullName,
      fatherName: editForm.fatherName,
      guardianPhone: editForm.guardianPhone,
      studentPhone: editForm.studentPhone,
      monthlyTuition: Number(editForm.monthlyTuition),
    });
    toast.success('Student profile updated successfully!');
    setIsEditOpen(false);
  };

  const currentChallanInvoice = invoices.find((inv) => inv.id === selectedInvoiceChallan);
  const currentReceiptPayment = payments.find((p) => p.id === selectedPaymentReceipt);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/students"
          className="inline-flex items-center gap-1 text-[12px] font-medium text-[#334155] hover:text-[#1e3a5f]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Students
        </Link>
      </div>

      {/* Student Profile Header Card */}
      <div className="squircle-card p-6 text-left">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Identity info */}
          <div className="flex items-start gap-4 text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center squircle-card bg-[#f1f5f9] text-[#1e3a5f] font-bold text-xl">
              {student.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-[#0f172a]">{student.fullName}</h1>
                <span
                  className={
                    student.feeStatus === 'Paid'
                      ? 'badge-paid'
                      : student.feeStatus === 'Pending'
                      ? 'badge-pending'
                      : 'badge-overdue'
                  }
                >
                  {student.feeStatus === 'Paid' ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : student.feeStatus === 'Pending' ? (
                    <Clock className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 mr-1" />
                  )}
                  {student.feeStatus}
                </span>
                <span className="text-[11px] text-[#334155] bg-[#f1f5f9] px-2 py-0.5 squircle-badge font-mono border border-[#e2e8f0]">
                  {student.admissionNumber}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[12px] text-[#334155]">
                <span>
                  S/O <strong className="text-[#0f172a] font-medium">{student.fatherName}</strong>
                </span>
                <span>•</span>
                <span>
                  Class <strong className="text-[#0f172a] font-medium">{student.class}-{student.section}</strong>
                </span>
                <span>•</span>
                <span>
                  Roll No: <strong className="font-mono text-[#1e3a5f] font-medium">{student.rollNumber}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-[#166534]" />
                  <span className="font-mono">{student.guardianPhone}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => router.push(`/fee-collection?studentId=${student.id}`)}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3.5 py-1.5 text-[12px] font-medium text-white shadow-xs hover:bg-[#142842] transition-colors"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>Record Payment</span>
            </button>

            <button
              onClick={handleSendReminder}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#0f172a] hover:bg-[#f8f9fb] transition-colors"
            >
              <Send className="h-3.5 w-3.5 text-[#166534]" />
              <span>Send Reminder</span>
            </button>

            <button
              onClick={() => setIsStatementOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#0f172a] hover:bg-[#f8f9fb] transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-[#334155]" />
              <span>Print Statement</span>
            </button>

            <button
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#0f172a] hover:bg-[#f8f9fb] transition-colors"
            >
              <Pencil className="h-3.5 w-3.5 text-[#334155]" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* Financial KPI Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-[#e2e8f0]">
          <div>
            <span className="text-[11px] font-medium text-[#334155] block">Total Invoiced</span>
            <span className="text-lg font-bold text-[#0f172a] tabular-nums">
              {formatCurrency(totalInvoiced)}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-[#334155] block">Total Paid</span>
            <span className="text-lg font-bold text-[#166534] tabular-nums">
              {formatCurrency(totalPaid)}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-[#334155] block">Outstanding Balance</span>
            <span
              className={`text-lg font-bold tabular-nums ${
                student.outstandingBalance > 0 ? 'text-[#854d0e]' : 'text-[#166534]'
              }`}
            >
              {formatCurrency(student.outstandingBalance)}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-[#334155] block">Overdue Amount</span>
            <span
              className={`text-lg font-bold tabular-nums ${
                student.overdueBalance > 0 ? 'text-[#991b1b]' : 'text-[#334155]'
              }`}
            >
              {formatCurrency(student.overdueBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-[#e2e8f0]">
        <nav className="flex space-x-6">
          {[
            { id: 'overview', label: 'Overview', icon: Users },
            { id: 'ledger', label: 'Fee Ledger', icon: FileText, count: ledgerWithBalance.length },
            { id: 'invoices', label: 'Invoices & Challans', icon: Receipt, count: studentInvoices.length },
            { id: 'payments', label: 'Payment Receipts', icon: Wallet, count: studentPayments.length },
            { id: 'adjustments', label: 'Discounts & Waivers', icon: Percent, count: studentAdjustments.length },
            { id: 'notifications', label: 'WhatsApp Logs', icon: MessageCircle, count: studentNotifications.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-3 border-b-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'border-[#1e3a5f] text-[#1e3a5f] font-semibold'
                    : 'border-transparent text-[#334155] hover:text-[#0f172a]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isActive ? 'bg-[#f1f5f9] text-[#1e3a5f]' : 'bg-[#f1f5f9] text-[#334155]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fee Plan Breakdown */}
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-[14px] font-semibold text-[#0f172a]">Assigned Fee Plan</h3>
            <div className="space-y-2.5 text-[13px]">
              <div className="flex justify-between py-2 border-b border-[#e2e8f0]">
                <span className="text-[#334155]">Monthly Tuition Fee</span>
                <span className="font-semibold text-[#0f172a] tabular-nums">
                  {formatCurrency(student.monthlyTuition)} / month
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e2e8f0]">
                <span className="text-[#334155]">Standard Annual Charges</span>
                <span className="font-semibold text-[#0f172a] tabular-nums">
                  {formatCurrency(student.initialAnnualCharges)} / session
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e2e8f0]">
                <span className="text-[#334155]">Available Advance Credit</span>
                <span className="font-semibold text-[#166534] tabular-nums">
                  {formatCurrency(student.advanceCredit)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#334155]">Academic Session</span>
                <span className="font-semibold text-[#0f172a]">{student.academicSession}</span>
              </div>
            </div>
          </div>

          {/* Quick Account Summary */}
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-[14px] font-semibold text-[#0f172a]">Account Compliance & Audit</h3>
            <div className="space-y-3 text-[13px]">
              <div className="p-3 rounded-lg bg-[#f8f9fb] border border-[#e2e8f0] space-y-1">
                <div className="text-[11px] font-semibold text-[#334155]">ADMISSION RECORD</div>
                <div className="text-[#0f172a]">
                  Enrolled on <strong className="font-medium">{formatDate(student.admissionDate)}</strong>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#f8f9fb] border border-[#e2e8f0] space-y-1">
                <div className="text-[11px] font-semibold text-[#334155]">GUARDIAN NOTIFICATION STATUS</div>
                <div className="text-[#0f172a]">
                  {studentNotifications.length > 0 ? (
                    <span>Last reminder sent on {formatDateTime(studentNotifications[0].sentAt)}</span>
                  ) : (
                    <span>No reminders sent yet for this account.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Fee Ledger */}
      {activeTab === 'ledger' && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-semibold text-[#0f172a]">Chronological Fee Ledger</h3>
              <p className="text-[12px] text-[#334155]">Complete debits, credits, and running balance</p>
            </div>
            <button
              onClick={() => setIsStatementOpen(true)}
              className="text-[12px] font-medium text-[#1e3a5f] hover:underline flex items-center gap-1"
            >
              <Printer className="h-3.5 w-3.5" /> Print Statement
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Reference</th>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4 text-right">Debit (+)</th>
                  <th className="py-2.5 px-4 text-right">Credit (-)</th>
                  <th className="py-2.5 px-4 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {ledgerWithBalance.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#334155]">
                      No ledger history available.
                    </td>
                  </tr>
                ) : (
                  ledgerWithBalance.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#f8f9fb]">
                      <td className="py-2.5 px-4 text-[#334155] text-[12px]">{formatDate(item.date)}</td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-[#1e3a5f]">{item.reference}</td>
                      <td className="py-2.5 px-4 font-medium text-[#0f172a]">{item.description}</td>
                      <td className="py-2.5 px-4 text-right tabular-nums text-[#991b1b]">
                        {item.type === 'Debit' ? formatCurrency(item.amount) : '-'}
                      </td>
                      <td className="py-2.5 px-4 text-right tabular-nums text-[#166534]">
                        {item.type === 'Credit' ? formatCurrency(item.amount) : '-'}
                      </td>
                      <td className="py-2.5 px-4 text-right font-semibold tabular-nums text-[#0f172a]">
                        {formatCurrency(item.runningBalance)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Invoices */}
      {activeTab === 'invoices' && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <th className="py-2.5 px-4">Invoice #</th>
                  <th className="py-2.5 px-4">Billing Period</th>
                  <th className="py-2.5 px-4">Issue Date</th>
                  <th className="py-2.5 px-4">Due Date</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                  <th className="py-2.5 px-4 text-right">Paid</th>
                  <th className="py-2.5 px-4 text-right">Remaining</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-right">Challan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {studentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#f8f9fb]">
                    <td className="py-2.5 px-4 font-mono font-medium text-[#1e3a5f]">{inv.invoiceNumber}</td>
                    <td className="py-2.5 px-4 font-medium text-[#0f172a]">{inv.billingPeriod}</td>
                    <td className="py-2.5 px-4 text-[#334155] text-[12px]">{formatDate(inv.issueDate)}</td>
                    <td className="py-2.5 px-4 text-[#334155] text-[12px]">{formatDate(inv.dueDate)}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-[#0f172a]">{formatCurrency(inv.totalAmount)}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-[#166534]">{formatCurrency(inv.paidAmount)}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-[#0f172a]">{formatCurrency(inv.remainingAmount)}</td>
                    <td className="py-2.5 px-4 text-center">
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
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedInvoiceChallan(inv.id)}
                        className="inline-flex items-center gap-1 text-[12px] text-[#1e3a5f] hover:underline"
                      >
                        <Printer className="h-3.5 w-3.5" /> View Challan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 4: Payments */}
      {activeTab === 'payments' && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <th className="py-2.5 px-4">Receipt #</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Payment Method</th>
                  <th className="py-2.5 px-4">Reference</th>
                  <th className="py-2.5 px-4">Recorded By</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {studentPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#334155]">
                      No payments recorded yet for this student.
                    </td>
                  </tr>
                ) : (
                  studentPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#f8f9fb]">
                      <td className="py-2.5 px-4 font-mono font-medium text-[#1e3a5f]">{p.receiptNumber}</td>
                      <td className="py-2.5 px-4 text-[#334155] text-[12px]">{formatDate(p.paymentDate)}</td>
                      <td className="py-2.5 px-4 font-medium text-[#0f172a]">{p.paymentMethod}</td>
                      <td className="py-2.5 px-4 text-[#334155] font-mono text-[11px]">{p.referenceNumber || '-'}</td>
                      <td className="py-2.5 px-4 text-[#334155]">{p.recordedBy}</td>
                      <td className="py-2.5 px-4 text-right font-semibold text-[#166534] tabular-nums">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                            p.status === 'Completed'
                              ? 'bg-[#f0fdf4] text-[#166534]'
                              : 'bg-[#fef2f2] text-[#991b1b]'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedPaymentReceipt(p.id)}
                          className="inline-flex items-center gap-1 text-[12px] text-[#1e3a5f] hover:underline"
                        >
                          <Printer className="h-3.5 w-3.5" /> Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 5: Adjustments */}
      {activeTab === 'adjustments' && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Adjustment Type</th>
                  <th className="py-2.5 px-4">Reason / Notes</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {studentAdjustments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#334155]">
                      No discounts or concessions recorded.
                    </td>
                  </tr>
                ) : (
                  studentAdjustments.map((a) => (
                    <tr key={a.id} className="hover:bg-[#f8f9fb]">
                      <td className="py-2.5 px-4 text-[#334155] text-[12px]">{formatDate(a.date)}</td>
                      <td className="py-2.5 px-4 font-semibold text-[#0f172a]">{a.adjustmentType}</td>
                      <td className="py-2.5 px-4 text-[#334155]">{a.reason}</td>
                      <td className="py-2.5 px-4 text-right font-semibold text-[#166534] tabular-nums">
                        {formatCurrency(a.amount)}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                            a.status === 'Approved'
                              ? 'bg-[#f0fdf4] text-[#166534]'
                              : a.status === 'Pending Approval'
                              ? 'bg-[#fefce8] text-[#854d0e]'
                              : 'bg-[#fef2f2] text-[#991b1b]'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 6: WhatsApp Notifications */}
      {activeTab === 'notifications' && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <th className="py-2.5 px-4">Sent Timestamp</th>
                  <th className="py-2.5 px-4">Template / Category</th>
                  <th className="py-2.5 px-4">Recipient Phone</th>
                  <th className="py-2.5 px-4">Message Body Preview</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {studentNotifications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#334155]">
                      No WhatsApp reminders recorded for this student.
                    </td>
                  </tr>
                ) : (
                  studentNotifications.map((n) => (
                    <tr key={n.id} className="hover:bg-[#f8f9fb]">
                      <td className="py-2.5 px-4 text-[#334155] text-[12px]">{formatDateTime(n.sentAt)}</td>
                      <td className="py-2.5 px-4 font-medium text-[#0f172a]">{n.templateType}</td>
                      <td className="py-2.5 px-4 font-mono text-[12px] text-[#334155]">{n.whatsappNumber}</td>
                      <td className="py-2.5 px-4 text-[#334155] max-w-xs truncate">{n.messageBody}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                            n.status === 'Delivered'
                              ? 'bg-[#f0fdf4] text-[#166534]'
                              : 'bg-[#fef2f2] text-[#991b1b]'
                          }`}
                        >
                          {n.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Edit Student Profile */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3 mb-4">
              <h3 className="text-[16px] font-bold text-[#0f172a]">Edit Student Account</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-[#334155] hover:text-[#0f172a]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSave} className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                  required
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Father / Guardian Name</label>
                <input
                  type="text"
                  value={editForm.fatherName}
                  onChange={(e) => setEditForm({ ...editForm, fatherName: e.target.value })}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                  required
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Guardian WhatsApp</label>
                <input
                  type="text"
                  value={editForm.guardianPhone}
                  onChange={(e) => setEditForm({ ...editForm, guardianPhone: e.target.value })}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                  required
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Monthly Tuition Fee (Rs.)</label>
                <input
                  type="number"
                  value={editForm.monthlyTuition}
                  onChange={(e) => setEditForm({ ...editForm, monthlyTuition: Number(e.target.value) })}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="rounded px-4 py-1.5 text-[12px] text-[#334155]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-[#1e3a5f] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Printable Fee Statement */}
      {isStatementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl my-6">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3 mb-4 no-print">
              <span className="text-[14px] font-semibold text-[#0f172a]">Print Fee Account Statement</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Statement
                </button>
                <button onClick={() => setIsStatementOpen(false)} className="text-[#334155] hover:text-[#0f172a]">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="space-y-6 text-[#0f172a] p-4 bg-white">
              <div className="flex items-start justify-between border-b-2 border-[#0f172a] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1e3a5f] text-white">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-[#0f172a]">{settings.collegeName}</h2>
                    <p className="text-[12px] text-[#334155]">{settings.address} · {settings.phone}</p>
                    <p className="text-[11px] font-semibold text-[#1e3a5f] uppercase tracking-wider">OFFICE OF THE ACCOUNTS & FINANCE</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#334155] block">STUDENT STATEMENT</span>
                  <span className="text-sm font-mono font-bold text-[#0f172a]">DATE: {formatDate(new Date())}</span>
                </div>
              </div>

              {/* Student Demographics Header */}
              <div className="grid grid-cols-2 gap-4 bg-[#f8f9fb] p-3 rounded text-[12px]">
                <div>
                  <p><strong>Student Name:</strong> {student.fullName}</p>
                  <p><strong>Father&apos;s Name:</strong> {student.fatherName}</p>
                  <p><strong>Guardian Contact:</strong> {student.guardianPhone}</p>
                </div>
                <div>
                  <p><strong>Roll Number:</strong> {student.rollNumber}</p>
                  <p><strong>Admission No:</strong> {student.admissionNumber}</p>
                  <p><strong>Class & Section:</strong> {student.class}-{student.section}</p>
                </div>
              </div>

              {/* Statement Ledger Table */}
              <table className="w-full text-left text-[12px] border border-[#e2e8f0]">
                <thead>
                  <tr className="bg-[#f1f5f9] font-semibold text-[#0f172a] border-b border-[#e2e8f0]">
                    <th className="p-2">Date</th>
                    <th className="p-2">Reference</th>
                    <th className="p-2">Description</th>
                    <th className="p-2 text-right">Debit (+)</th>
                    <th className="p-2 text-right">Credit (-)</th>
                    <th className="p-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {ledgerWithBalance.map((item, i) => (
                    <tr key={i}>
                      <td className="p-2">{formatDate(item.date)}</td>
                      <td className="p-2 font-mono text-[11px]">{item.reference}</td>
                      <td className="p-2">{item.description}</td>
                      <td className="p-2 text-right tabular-nums">{item.type === 'Debit' ? formatCurrency(item.amount) : '-'}</td>
                      <td className="p-2 text-right tabular-nums">{item.type === 'Credit' ? formatCurrency(item.amount) : '-'}</td>
                      <td className="p-2 text-right font-semibold tabular-nums">{formatCurrency(item.runningBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Net Payable Summary */}
              <div className="flex justify-between items-center border-t-2 border-[#0f172a] pt-4">
                <div className="text-[11px] text-[#334155]">
                  {settings.receiptFooter}
                </div>
                <div className="text-right">
                  <span className="text-[12px] text-[#334155] block">Net Outstanding Balance:</span>
                  <span className="text-xl font-bold text-[#0f172a] tabular-nums">
                    {formatCurrency(student.outstandingBalance)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Single Challan */}
      {currentChallanInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl my-6">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3 mb-4 no-print">
              <span className="text-[14px] font-semibold text-[#0f172a]">
                Bank Fee Challan — {currentChallanInvoice.invoiceNumber}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
                >
                  <Printer className="h-3.5 w-3.5" /> Print 3-Part Challan
                </button>
                <button onClick={() => setSelectedInvoiceChallan(null)} className="text-[#334155] hover:text-[#0f172a]">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 3-Part Challan Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-[#e2e8f0] p-4 text-[11px] bg-white">
              {['BANK COPY', 'COLLEGE COPY', 'STUDENT COPY'].map((copyName) => (
                <div key={copyName} className="border-r last:border-r-0 border-dashed border-[#cbd5e1] pr-3 last:pr-0 space-y-3">
                  <div className="text-center border-b border-[#e2e8f0] pb-2">
                    <h3 className="font-bold text-[13px] text-[#0f172a]">{settings.collegeName}</h3>
                    <p className="text-[10px] text-[#334155]">Allied Bank Ltd · Mirpur Branch</p>
                    <p className="font-mono text-[10px] text-[#1e3a5f]">A/C # 0124-5541098</p>
                    <span className="inline-block mt-1 bg-[#f1f5f9] text-[#1e3a5f] px-2 py-0.5 rounded text-[10px] font-bold">
                      {copyName}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p><strong>Challan No:</strong> <span className="font-mono">{currentChallanInvoice.invoiceNumber}</span></p>
                    <p><strong>Due Date:</strong> <span className="text-[#991b1b] font-semibold">{formatDate(currentChallanInvoice.dueDate)}</span></p>
                    <p><strong>Student:</strong> {currentChallanInvoice.studentName}</p>
                    <p><strong>Father:</strong> {currentChallanInvoice.fatherName}</p>
                    <p><strong>Class:</strong> {currentChallanInvoice.class}-{currentChallanInvoice.section} (Roll: {currentChallanInvoice.rollNumber})</p>
                  </div>

                  <table className="w-full text-left border-t border-b border-[#e2e8f0] my-2 text-[10px]">
                    <tbody>
                      {currentChallanInvoice.items.map((it, idx) => (
                        <tr key={idx} className="border-b border-[#e2e8f0] last:border-b-0">
                          <td className="py-1">{it.feeHeadName}</td>
                          <td className="py-1 text-right tabular-nums">{formatCurrency(it.amount)}</td>
                        </tr>
                      ))}
                      {currentChallanInvoice.lateFee > 0 && (
                        <tr className="border-b border-[#e2e8f0]">
                          <td className="py-1 text-[#991b1b]">Late Fee Surcharge</td>
                          <td className="py-1 text-right text-[#991b1b] tabular-nums">{formatCurrency(currentChallanInvoice.lateFee)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-center font-bold text-[12px] pt-1">
                    <span>Payable:</span>
                    <span className="tabular-nums text-[#1e3a5f]">{formatCurrency(currentChallanInvoice.totalAmount)}</span>
                  </div>

                  <div className="pt-6 flex justify-between text-[9px] text-[#334155]">
                    <span>Cashier Stamp</span>
                    <span>Officer Sign</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Single Payment Receipt */}
      {currentReceiptPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3 mb-4 no-print">
              <span className="text-[14px] font-semibold text-[#0f172a]">Official Fee Receipt</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
                >
                  <Printer className="h-3.5 w-3.5" /> Print
                </button>
                <button onClick={() => setSelectedPaymentReceipt(null)} className="text-[#334155] hover:text-[#0f172a]">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4 text-[12px] p-2 bg-white">
              <div className="text-center border-b border-[#e2e8f0] pb-3">
                <h3 className="font-bold text-[15px] text-[#0f172a]">{settings.collegeName}</h3>
                <p className="text-[11px] text-[#334155]">{settings.address}</p>
                <div className="mt-1 font-mono text-[13px] font-semibold text-[#1e3a5f]">
                  RECEIPT: {currentReceiptPayment.receiptNumber}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#334155]">Payment Date:</span>
                  <span className="font-medium text-[#0f172a]">{formatDate(currentReceiptPayment.paymentDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#334155]">Student Name:</span>
                  <span className="font-medium text-[#0f172a]">{currentReceiptPayment.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#334155]">Roll Number / Class:</span>
                  <span className="font-medium text-[#0f172a]">{currentReceiptPayment.rollNumber} ({currentReceiptPayment.class}-{currentReceiptPayment.section})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#334155]">Payment Method:</span>
                  <span className="font-medium text-[#0f172a]">{currentReceiptPayment.paymentMethod}</span>
                </div>
                {currentReceiptPayment.referenceNumber && (
                  <div className="flex justify-between">
                    <span className="text-[#334155]">Transaction Ref:</span>
                    <span className="font-mono text-[#0f172a]">{currentReceiptPayment.referenceNumber}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#e2e8f0] text-sm font-bold">
                  <span>Amount Paid:</span>
                  <span className="text-[#166534] tabular-nums">{formatCurrency(currentReceiptPayment.amount)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#e2e8f0] text-[10px] text-[#334155] text-center">
                Recorded by: {currentReceiptPayment.recordedBy}
                <div className="mt-1">{settings.receiptFooter}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#334155]">Loading student profile...</div>}>
      <StudentProfileContent />
    </Suspense>
  );
}
