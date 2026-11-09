'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  MessageCircle,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Users,
  Smartphone,
  Eye,
  Building2,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { Student } from '@/types';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';

function NotificationsContent() {
  const searchParams = useSearchParams();
  const preSelectedRecipients = searchParams.get('recipients')?.split(',') || [];

  const { students, notifications, templates, simulateWhatsAppBatch, settings } = useFeeApp();

  // Tab State
  const [activeTab, setActiveTab] = useState<'reminders' | 'all' | 'failed'>('reminders');

  // Filter Overdue Table
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [minOverdueDays, setMinOverdueDays] = useState<number>(0);

  // Selected students for WhatsApp batch
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(preSelectedRecipients);

  // Message Editor State
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>('Overdue Fee Reminder');
  const [customMessage, setCustomMessage] = useState<string>(
    'URGENT: Respected {{parent_name}}, the fee account for {{student_name}} (Roll No: {{roll_number}}, Class: {{class}}-{{section}}) has an overdue balance of {{balance}}. Please settle the outstanding fee immediately at the Accounts Office to avoid a late fee surcharge. {{college_name}} Accounts Office.'
  );

  // Simulation Status State
  const [isSending, setIsSending] = useState(false);
  const [lastBatchResult, setLastBatchResult] = useState<{ totalSent: number; delivered: number; failed: number } | null>(null);

  // Overdue eligible students
  const eligibleStudents = useMemo(() => {
    return students.filter((s) => {
      const isOverdue = s.outstandingBalance > 0;
      const matchClass = selectedClass === 'All' || s.class === selectedClass;
      return isOverdue && matchClass;
    });
  }, [students, selectedClass]);

  const toggleSelectAllEligible = () => {
    if (selectedStudentIds.length === eligibleStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(eligibleStudents.map((s) => s.id));
    }
  };

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Preview Student for Live Message Preview Box
  const previewStudent =
    students.find((s) => selectedStudentIds.includes(s.id)) || eligibleStudents[0] || students[0];

  const renderedPreviewMessage = useMemo(() => {
    if (!previewStudent) return customMessage;
    return customMessage
      .replace(/\{\{student_name\}\}/g, previewStudent.fullName)
      .replace(/\{\{parent_name\}\}/g, previewStudent.fatherName)
      .replace(/\{\{class\}\}/g, previewStudent.class)
      .replace(/\{\{section\}\}/g, previewStudent.section)
      .replace(/\{\{roll_number\}\}/g, previewStudent.rollNumber)
      .replace(/\{\{amount\}\}/g, formatCurrency(previewStudent.outstandingBalance))
      .replace(/\{\{balance\}\}/g, formatCurrency(previewStudent.outstandingBalance))
      .replace(/\{\{due_date\}\}/g, '10 Nov 2026')
      .replace(/\{\{college_name\}\}/g, settings.collegeName);
  }, [customMessage, previewStudent, settings.collegeName]);

  const handleSendSimulation = () => {
    if (selectedStudentIds.length === 0) {
      toast.error('Please select at least one eligible student');
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      const result = simulateWhatsAppBatch({
        recipientStudentIds: selectedStudentIds,
        templateCategory: selectedTemplateCategory,
        customMessageBody: customMessage,
      });

      setLastBatchResult(result);
      setIsSending(false);
      toast.success(
        `Dispatched simulated WhatsApp batch to ${result.totalSent} recipients (${result.delivered} delivered, ${result.failed} simulated delivery failures).`
      );
    }, 1200);
  };

  // Counts
  const totalEligible = eligibleStudents.length;
  const totalDelivered = notifications.filter((n) => n.status === 'Delivered').length;
  const totalFailed = notifications.filter((n) => n.status === 'Failed').length;
  const totalQueued = notifications.filter((n) => n.status === 'Queued').length;

  return (
    <div className="space-y-6">
      {/* Explicit Client Requirement Demo Mode Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-[#FDE68A] bg-[#fefce8] p-4 text-[13px] text-[#854d0e] shadow-2xs">
        <ShieldAlert className="h-5 w-5 shrink-0 text-[#854d0e]" />
        <div>
          <strong className="font-semibold text-[#8F5E12]">DEMO MODE — WhatsApp Integration Simulated:</strong>
          <span className="ml-1 text-[#9A6A1E]">
            Messages and delivery confirmations are simulated locally in the browser. No actual WhatsApp messages or external cellular carrier SMS are dispatched.
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
            WhatsApp Notification Dispatcher
          </h1>
          <p className="text-[13px] text-[#334155]">
            Automated payment reminders, overdue notices, and instant receipt confirmations.
          </p>
        </div>

        <Link
          href="/message-templates"
          className="inline-flex items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#0f172a] hover:bg-[#f8f9fb] transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#1e3a5f]" />
          <span>Manage Message Templates</span>
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-[#334155]">Eligible Defaulters</div>
          <div className="text-2xl font-bold text-[#0f172a] mt-1 tabular-nums">{totalEligible}</div>
          <div className="text-[11px] text-[#854d0e] mt-1">Pending or overdue accounts</div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-[#334155]">Messages Delivered</div>
          <div className="text-2xl font-bold text-[#166534] mt-1 tabular-nums">{totalDelivered}</div>
          <div className="text-[11px] text-[#166534] mt-1">Simulated delivery confirmed</div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-[#334155]">Delivery Failures</div>
          <div className="text-2xl font-bold text-[#991b1b] mt-1 tabular-nums">{totalFailed}</div>
          <div className="text-[11px] text-[#991b1b] mt-1">Cellular timeout / invalid number</div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-[#334155]">Messages Queued</div>
          <div className="text-2xl font-bold text-[#64748B] mt-1 tabular-nums">{totalQueued}</div>
          <div className="text-[11px] text-[#334155] mt-1">Pending gateway delivery</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e2e8f0]">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('reminders')}
            className={`py-3 border-b-2 text-[13px] font-medium transition-colors ${
              activeTab === 'reminders'
                ? 'border-[#1e3a5f] text-[#1e3a5f] font-semibold'
                : 'border-transparent text-[#334155] hover:text-[#0f172a]'
            }`}
          >
            Bulk Reminder Workspace ({eligibleStudents.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-3 border-b-2 text-[13px] font-medium transition-colors ${
              activeTab === 'all'
                ? 'border-[#1e3a5f] text-[#1e3a5f] font-semibold'
                : 'border-transparent text-[#334155] hover:text-[#0f172a]'
            }`}
          >
            All Sent Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('failed')}
            className={`py-3 border-b-2 text-[13px] font-medium transition-colors ${
              activeTab === 'failed'
                ? 'border-[#1e3a5f] text-[#1e3a5f] font-semibold'
                : 'border-transparent text-[#334155] hover:text-[#0f172a]'
            }`}
          >
            Failed Deliveries ({totalFailed})
          </button>
        </nav>
      </div>

      {/* Tab: Bulk Reminder Workspace */}
      {activeTab === 'reminders' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Eligible Overdue Students Selection */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSelectAllEligible}
                  className="rounded-md border border-[#e2e8f0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#0f172a] hover:bg-[#f8f9fb]"
                >
                  {selectedStudentIds.length === eligibleStudents.length ? 'Deselect All' : 'Select All Eligible Students'}
                </button>
                <span className="text-[12px] text-[#334155]">
                  <strong>{selectedStudentIds.length}</strong> of {eligibleStudents.length} selected
                </span>
              </div>

              {/* Class Filter */}
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="rounded-md border border-[#e2e8f0] bg-white px-3 py-1 text-[12px] text-[#0f172a]"
              >
                <option value="All">All Classes</option>
                <option value="9th">9th</option>
                <option value="10th">10th</option>
                <option value="11th">11th</option>
                <option value="12th">12th</option>
              </select>
            </div>

            {/* Overdue Table */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                      <th className="py-2.5 px-3 w-8">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.length > 0 && selectedStudentIds.length === eligibleStudents.length}
                          onChange={toggleSelectAllEligible}
                          className="rounded border-[#cbd5e1] text-[#1e3a5f]"
                        />
                      </th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Guardian</th>
                      <th className="py-2.5 px-3">WhatsApp #</th>
                      <th className="py-2.5 px-3">Class</th>
                      <th className="py-2.5 px-3 text-right">Outstanding</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {eligibleStudents.slice(0, 15).map((s) => {
                      const isSelected = selectedStudentIds.includes(s.id);
                      return (
                        <tr
                          key={s.id}
                          onClick={() => toggleSelectStudent(s.id)}
                          className={`cursor-pointer hover:bg-[#f8f9fb] transition-colors ${
                            isSelected ? 'bg-[#f1f5f9]' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectStudent(s.id)}
                              className="rounded border-[#cbd5e1] text-[#1e3a5f]"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-medium text-[#0f172a]">
                            {s.fullName}
                            <div className="text-[10px] text-[#334155]">Roll: {s.rollNumber}</div>
                          </td>
                          <td className="py-2.5 px-3 text-[#334155]">{s.fatherName}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-[#0f172a]">{s.guardianPhone}</td>
                          <td className="py-2.5 px-3 text-[#334155]">{s.class}-{s.section}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-[#991b1b] tabular-nums">
                            {formatCurrency(s.outstandingBalance)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-flex px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                                s.feeStatus === 'Overdue' ? 'bg-[#fef2f2] text-[#991b1b]' : 'bg-[#fefce8] text-[#854d0e]'
                              }`}
                            >
                              {s.feeStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Message Template Editor & Live Preview */}
          <div className="space-y-4">
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-2xs space-y-4">
              <h3 className="text-[14px] font-semibold text-[#0f172a] border-b border-[#e2e8f0] pb-2">
                Message Customization & Variables
              </h3>

              {/* Template category selector */}
              <div>
                <label className="block text-[11px] font-semibold text-[#334155] mb-1">
                  Preset Template
                </label>
                <select
                  value={selectedTemplateCategory}
                  onChange={(e) => {
                    setSelectedTemplateCategory(e.target.value);
                    const match = templates.find((t) => t.category === e.target.value);
                    if (match) setCustomMessage(match.body);
                  }}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[12px] text-[#0f172a]"
                >
                  <option value="Overdue Fee Reminder">Overdue Fee Reminder</option>
                  <option value="Fee Due Reminder">Fee Due Reminder</option>
                  <option value="Payment Confirmation">Payment Confirmation</option>
                  <option value="Upcoming Due Date">Upcoming Due Date</option>
                </select>
              </div>

              {/* Dynamic Placeholders */}
              <div>
                <label className="block text-[11px] font-semibold text-[#334155] mb-1.5">
                  Insert Variables
                </label>
                <div className="flex flex-wrap gap-1">
                  {[
                    '{{student_name}}',
                    '{{parent_name}}',
                    '{{class}}',
                    '{{roll_number}}',
                    '{{amount}}',
                    '{{balance}}',
                    '{{due_date}}',
                  ].map((placeholder) => (
                    <button
                      key={placeholder}
                      type="button"
                      onClick={() => setCustomMessage((prev) => `${prev} ${placeholder}`)}
                      className="rounded bg-[#f1f5f9] px-2 py-0.5 font-mono text-[10px] text-[#1e3a5f] hover:bg-[#f1f5f9]"
                    >
                      {placeholder}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message body textarea */}
              <div>
                <label className="block text-[11px] font-semibold text-[#334155] mb-1">
                  Message Content
                </label>
                <textarea
                  rows={4}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full rounded border border-[#e2e8f0] p-2 text-[12px] text-[#0f172a] focus:border-[#1e3a5f] focus:outline-none"
                />
              </div>

              {/* Live Preview Box */}
              <div>
                <span className="text-[11px] font-semibold text-[#334155] block mb-1">
                  Live Recipient Preview ({previewStudent?.fullName}):
                </span>
                <div className="rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] p-3 text-[12px] text-[#0f172a] space-y-1">
                  <div className="text-[10px] font-semibold text-[#166534] flex items-center gap-1">
                    <Smartphone className="h-3 w-3" /> WhatsApp to {previewStudent?.guardianPhone}
                  </div>
                  <p className="whitespace-pre-wrap">{renderedPreviewMessage}</p>
                </div>
              </div>

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSendSimulation}
                disabled={isSending || selectedStudentIds.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#166534] py-2.5 text-[13px] font-bold text-white shadow-xs hover:bg-[#126b49] disabled:opacity-50 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>{isSending ? 'Simulating Broadcast...' : `Dispatch Simulated Batch (${selectedStudentIds.length})`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: All Sent Notifications */}
      {activeTab === 'all' && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Guardian</th>
                  <th className="py-2.5 px-4">WhatsApp #</th>
                  <th className="py-2.5 px-4">Template</th>
                  <th className="py-2.5 px-4">Message Body Preview</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {notifications.map((n) => (
                  <tr key={n.id} className="hover:bg-[#f8f9fb]">
                    <td className="py-2.5 px-4 text-[#334155] text-[12px]">{formatDateTime(n.sentAt)}</td>
                    <td className="py-2.5 px-4 font-medium text-[#0f172a]">{n.studentName}</td>
                    <td className="py-2.5 px-4 text-[#334155]">{n.guardianName}</td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-[#0f172a]">{n.whatsappNumber}</td>
                    <td className="py-2.5 px-4">{n.templateType}</td>
                    <td className="py-2.5 px-4 text-[#334155] max-w-sm truncate">{n.messageBody}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          n.status === 'Delivered'
                            ? 'bg-[#f0fdf4] text-[#166534]'
                            : n.status === 'Queued'
                            ? 'bg-[#fefce8] text-[#854d0e]'
                            : 'bg-[#fef2f2] text-[#991b1b]'
                        }`}
                      >
                        {n.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Failed Deliveries */}
      {activeTab === 'failed' && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Guardian Contact</th>
                  <th className="py-2.5 px-4">Failure Reason</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {notifications
                  .filter((n) => n.status === 'Failed')
                  .map((n) => (
                    <tr key={n.id} className="hover:bg-[#f8f9fb]">
                      <td className="py-2.5 px-4 text-[#334155] text-[12px]">{formatDateTime(n.sentAt)}</td>
                      <td className="py-2.5 px-4 font-semibold text-[#0f172a]">{n.studentName}</td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-[#0f172a]">{n.whatsappNumber}</td>
                      <td className="py-2.5 px-4 text-[#991b1b]">{n.errorReason || 'Network gateway timeout'}</td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => {
                            simulateWhatsAppBatch({
                              recipientStudentIds: [n.studentId],
                              templateCategory: n.templateType,
                              customMessageBody: n.messageBody,
                            });
                            toast.success(`Retried simulated dispatch for ${n.studentName}`);
                          }}
                          className="text-[12px] font-semibold text-[#1e3a5f] hover:underline"
                        >
                          Retry Delivery
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#334155]">Loading notifications...</div>}>
      <NotificationsContent />
    </Suspense>
  );
}
