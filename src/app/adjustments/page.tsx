'use client';

import React, { useState } from 'react';
import {
  Percent,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  Users,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { Adjustment } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdjustmentsPage() {
  const { adjustments, addAdjustment, updateAdjustmentStatus, students } = useFeeApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formStudentId, setFormStudentId] = useState(students[0]?.id || '');
  const [formType, setFormType] = useState<Adjustment['adjustmentType']>('Merit Scholarship');
  const [formAmount, setFormAmount] = useState<number>(1500);
  const [formReason, setFormReason] = useState('Academic excellence board top rank concession');

  const filteredAdjustments = adjustments.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      a.studentName.toLowerCase().includes(q) ||
      a.rollNumber.toLowerCase().includes(q) ||
      a.reason.toLowerCase().includes(q);

    const matchType = selectedType === 'All' || a.adjustmentType === selectedType;
    const matchStatus = selectedStatus === 'All' || a.status === selectedStatus;
    return matchSearch && matchType && matchStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === formStudentId);
    if (!student) {
      toast.error('Student not found');
      return;
    }
    if (formAmount <= 0) {
      toast.error('Please enter a positive amount');
      return;
    }

    addAdjustment({
      studentId: student.id,
      studentName: student.fullName,
      rollNumber: student.rollNumber,
      class: student.class,
      adjustmentType: formType,
      amount: formAmount,
      reason: formReason,
    });

    toast.success(`Adjustment request of ${formatCurrency(formAmount)} submitted for Principal approval.`);
    setIsCreateOpen(false);
  };

  const handleApprove = (id: string) => {
    updateAdjustmentStatus(id, 'Approved', 'Dr. Tariq Mahmood (Principal)');
    toast.success('Adjustment approved! Student balance discounted.');
  };

  const handleReject = (id: string) => {
    updateAdjustmentStatus(id, 'Rejected', 'Dr. Tariq Mahmood (Principal)');
    toast.info('Adjustment request rejected.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
            Adjustments, Scholarships & Fee Waivers
          </h1>
          <p className="text-[13px] text-[#334155]">
            Manage merit scholarships, sibling concessions, staff quotas, and administrative fee waivers.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3.5 py-1.5 text-[12px] font-medium text-white shadow-xs hover:bg-[#142842] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Adjustment Request</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search student, reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-[#e2e8f0] bg-[#f8f9fb] pl-9 pr-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-md border border-[#e2e8f0] bg-[#f8f9fb] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:bg-white focus:outline-none"
            >
              <option value="All">All Concession Types</option>
              <option value="Merit Scholarship">Merit Scholarship</option>
              <option value="Sibling Discount">Sibling Discount</option>
              <option value="Financial Assistance">Financial Assistance</option>
              <option value="Special Concession">Special Concession</option>
              <option value="Fee Waiver">Fee Waiver</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-md border border-[#e2e8f0] bg-[#f8f9fb] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:bg-white focus:outline-none"
            >
              <option value="All">All Approval Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Adjustments Table */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Adjustment Type</th>
                <th className="py-3 px-4">Institutional Reason</th>
                <th className="py-3 px-4 text-right">Discount Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filteredAdjustments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#334155]">
                    No adjustments found matching filters.
                  </td>
                </tr>
              ) : (
                filteredAdjustments.map((adj) => (
                  <tr key={adj.id} className="hover:bg-[#f8f9fb] transition-colors">
                    <td className="py-3 px-4 text-[#334155] text-[12px]">{formatDate(adj.date)}</td>
                    <td className="py-3 px-4 font-medium text-[#0f172a]">
                      {adj.studentName}
                      <div className="text-[11px] text-[#334155]">Roll: {adj.rollNumber}</div>
                    </td>
                    <td className="py-3 px-4 text-[#334155]">Class {adj.class}</td>
                    <td className="py-3 px-4 font-semibold text-[#0f172a]">{adj.adjustmentType}</td>
                    <td className="py-3 px-4 text-[#334155] max-w-xs">{adj.reason}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#166534] tabular-nums">
                      {formatCurrency(adj.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          adj.status === 'Approved'
                            ? 'bg-[#f0fdf4] text-[#166534]'
                            : adj.status === 'Pending Approval'
                            ? 'bg-[#fefce8] text-[#854d0e]'
                            : 'bg-[#fef2f2] text-[#991b1b]'
                        }`}
                      >
                        {adj.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {adj.status === 'Pending Approval' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(adj.id)}
                            className="inline-flex items-center gap-1 rounded bg-[#166534] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#126b49]"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(adj.id)}
                            className="inline-flex items-center gap-1 rounded bg-[#fef2f2] text-[#991b1b] px-2 py-1 text-[11px] font-medium hover:bg-[#fecaca]"
                          >
                            <XCircle className="h-3 w-3" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#334155] italic">
                          {adj.approvedBy ? `Reviewed by Principal` : 'Processed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Adjustment Request */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <div>
                <h3 className="text-[16px] font-bold text-[#0f172a]">New Fee Concession / Waiver</h3>
                <p className="text-[12px] text-[#334155]">Submit discount request for administrative approval</p>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="text-[#334155] hover:text-[#0f172a]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Select Student</label>
                <select
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.rollNumber}) — Class {s.class} (Bal: {formatCurrency(s.outstandingBalance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Concession Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as Adjustment['adjustmentType'])}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                >
                  <option value="Merit Scholarship">Merit Scholarship</option>
                  <option value="Sibling Discount">Sibling Discount</option>
                  <option value="Financial Assistance">Financial Assistance</option>
                  <option value="Special Concession">Special Concession</option>
                  <option value="Fee Waiver">Fee Waiver</option>
                  <option value="Manual Correction">Manual Correction</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Discount Amount (Rs.)</label>
                <input
                  type="number"
                  required
                  value={formAmount}
                  onChange={(e) => setFormAmount(Number(e.target.value))}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Reason / Justification</label>
                <textarea
                  rows={2}
                  required
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
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
                  className="rounded bg-[#1e3a5f] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
