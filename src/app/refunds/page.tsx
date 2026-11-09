'use client';

import React, { useState } from 'react';
import {
  Undo2,
  Plus,
  CheckCircle2,
  Search,
  Receipt,
  Printer,
  ShieldAlert,
  X,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { Refund, PaymentMethod } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function RefundsPage() {
  const { refunds, processRefund, payments, students } = useFeeApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedPaymentReceipt, setSelectedPaymentReceipt] = useState(payments[0]?.receiptNumber || '');
  const [refundAmount, setRefundAmount] = useState(1500);
  const [refundReason, setRefundReason] = useState('Excess deposit returned via direct bank transfer');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');

  const filteredRefunds = refunds.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      r.studentName.toLowerCase().includes(q) ||
      r.receiptNumber.toLowerCase().includes(q) ||
      r.refundReason.toLowerCase().includes(q)
    );
  });

  const handleCreateRefund = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) {
      toast.error('Student not found');
      return;
    }
    if (refundAmount <= 0) {
      toast.error('Refund amount must be greater than zero');
      return;
    }

    processRefund({
      studentId: student.id,
      studentName: student.fullName,
      class: student.class,
      originalPaymentId: `pay-${selectedPaymentReceipt}`,
      receiptNumber: selectedPaymentReceipt,
      refundAmount,
      refundReason,
      paymentMethod,
    });

    toast.success(`Refund of ${formatCurrency(refundAmount)} processed for ${student.fullName}.`);
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
            Fee Refunds & Security Returns
          </h1>
          <p className="text-[13px] text-[#334155]">
            Process audited refunds linked to original payment receipts, excess collections, and security deposits.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3.5 py-1.5 text-[12px] font-medium text-white shadow-xs hover:bg-[#142842] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Process Refund</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search student, receipt number, reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-[#e2e8f0] bg-[#f8f9fb] pl-9 pr-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Refunds Table */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Original Receipt</th>
                <th className="py-3 px-4">Refund Reason</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Refund Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Processed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filteredRefunds.map((ref) => (
                <tr key={ref.id} className="hover:bg-[#f8f9fb] transition-colors">
                  <td className="py-3 px-4 text-[#334155] text-[12px]">{formatDate(ref.date)}</td>
                  <td className="py-3 px-4 font-semibold text-[#0f172a]">{ref.studentName}</td>
                  <td className="py-3 px-4 text-[#334155]">Class {ref.class}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#1e3a5f]">{ref.receiptNumber}</td>
                  <td className="py-3 px-4 text-[#334155] max-w-xs">{ref.refundReason}</td>
                  <td className="py-3 px-4 text-[#0f172a] font-medium">{ref.paymentMethod}</td>
                  <td className="py-3 px-4 text-right font-bold text-[#991b1b] tabular-nums">
                    {formatCurrency(ref.refundAmount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        ref.status === 'Processed'
                          ? 'bg-[#f0fdf4] text-[#166534]'
                          : 'bg-[#fefce8] text-[#854d0e]'
                      }`}
                    >
                      {ref.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#334155] text-[12px]">{ref.processedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Process Refund */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <div>
                <h3 className="text-[16px] font-bold text-[#0f172a]">Issue Fee Refund</h3>
                <p className="text-[12px] text-[#334155]">Return excess payments or security deposits</p>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="text-[#334155] hover:text-[#0f172a]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRefund} className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.rollNumber}) — Class {s.class}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Original Receipt #</label>
                <select
                  value={selectedPaymentReceipt}
                  onChange={(e) => setSelectedPaymentReceipt(e.target.value)}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                >
                  {payments.filter((p) => p.status === 'Completed').slice(0, 15).map((p) => (
                    <option key={p.id} value={p.receiptNumber}>
                      {p.receiptNumber} — {p.studentName} ({formatCurrency(p.amount)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Refund Amount (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Refund Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Online Payment">Online Payment</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Formal Reason for Refund</label>
                <textarea
                  rows={2}
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded px-4 py-1.5 text-[12px] text-[#334155]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-[#991b1b] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#b03d3d]"
                >
                  Confirm & Issue Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
