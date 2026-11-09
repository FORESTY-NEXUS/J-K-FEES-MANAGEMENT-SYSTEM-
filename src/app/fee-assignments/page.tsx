'use client';

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Layers,
  Users,
  CheckCircle2,
  CalendarDays,
  ArrowRight,
  ShieldAlert,
  Plus,
  HelpCircle,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function FeeAssignmentsPage() {
  const { students, feeStructures, feeAssignments, assignFees, sessions } = useFeeApp();

  // Wizard state (Steps 1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedSession, setSelectedSession] = useState('2026–2027');
  const [assignmentType, setAssignmentType] = useState<'Class' | 'Section' | 'Individual'>('Class');
  const [targetClass, setTargetClass] = useState('11th');
  const [targetSection, setTargetSection] = useState('A');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [chargeType, setChargeType] = useState<'Structure' | 'Custom'>('Custom');
  const [selectedStructureId, setSelectedStructureId] = useState(feeStructures[0]?.id || '');
  const [customTitle, setCustomTitle] = useState('Annual Examination & Practical Assessment Fund');
  const [customReason, setCustomReason] = useState('Approved Board examination registration, consumable lab materials, and center charges.');
  const [customAmount, setCustomAmount] = useState(2500);
  const [customDueDate, setCustomDueDate] = useState('2026-11-25');

  // Calculate affected students preview
  const affectedStudents = React.useMemo(() => {
    if (assignmentType === 'Class') {
      return students.filter((s) => s.class === targetClass);
    }
    if (assignmentType === 'Section') {
      return students.filter((s) => s.class === targetClass && s.section === targetSection);
    }
    return students.filter((s) => selectedStudentIds.includes(s.id));
  }, [students, assignmentType, targetClass, targetSection, selectedStudentIds]);

  const previewChargePerStudent =
    chargeType === 'Custom'
      ? customAmount
      : feeStructures.find((f) => f.id === selectedStructureId)?.totalStandardFee || 0;

  const totalAssignedSum = previewChargePerStudent * affectedStudents.length;

  const handleExecuteAssignment = () => {
    if (affectedStudents.length === 0) {
      toast.error('No students qualify for this assignment selection');
      return;
    }

    if (chargeType === 'Custom' && (!customTitle.trim() || !customReason.trim())) {
      toast.error('Please enter a charge title and formal reason');
      return;
    }

    const title =
      chargeType === 'Custom'
        ? customTitle
        : `${targetClass} - ${feeStructures.find((f) => f.id === selectedStructureId)?.name}`;

    assignFees({
      title,
      type: assignmentType,
      targetClass,
      targetSection: assignmentType === 'Section' ? targetSection : undefined,
      studentIds: assignmentType === 'Individual' ? selectedStudentIds : undefined,
      feeStructureId: chargeType === 'Structure' ? selectedStructureId : undefined,
      customCharge:
        chargeType === 'Custom'
          ? {
              title: customTitle,
              reason: customReason,
              amount: customAmount,
              dueDate: customDueDate,
              academicSession: selectedSession,
            }
          : undefined,
      academicSession: selectedSession,
    });

    toast.success(
      `Assigned fees to ${affectedStudents.length} students! Total: ${formatCurrency(totalAssignedSum)}. Student balances updated.`
    );
    // Reset wizard
    setCurrentStep(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
            Fee Assignments
          </h1>
          <p className="text-[13px] text-[#334155]">
            Assign class-wide fee structures, custom annual charges, or individual special funds.
          </p>
        </div>
      </div>

      {/* 5-Step Assignment Wizard */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-2xs space-y-6">
        {/* Wizard Steps Bar */}
        <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
          {[
            { step: 1, title: 'Academic Session' },
            { step: 2, title: 'Target Selection' },
            { step: 3, title: 'Fee Structure / Custom Charge' },
            { step: 4, title: 'Student Impact Preview' },
            { step: 5, title: 'Confirmation' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${
                  currentStep === item.step
                    ? 'bg-[#1e3a5f] text-white'
                    : currentStep > item.step
                    ? 'bg-[#f0fdf4] text-[#166534]'
                    : 'bg-[#f1f5f9] text-[#334155]'
                }`}
              >
                {currentStep > item.step ? '✓' : item.step}
              </div>
              <span
                className={`hidden md:inline text-[12px] font-medium ${
                  currentStep === item.step ? 'text-[#0f172a] font-semibold' : 'text-[#334155]'
                }`}
              >
                {item.title}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Session */}
        {currentStep === 1 && (
          <div className="space-y-4 max-w-lg">
            <h3 className="text-[15px] font-semibold text-[#0f172a]">
              Step 1: Select Academic Session
            </h3>
            <p className="text-[12px] text-[#334155]">
              Choose the academic billing session for which this fee assignment is applicable.
            </p>
            <div>
              <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Session</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full rounded-md border border-[#e2e8f0] px-3 py-2 text-[13px] text-[#0f172a]"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} {s.isActive ? '(Active Session)' : '(Archived)'}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-4 py-2 text-[12px] font-medium text-white hover:bg-[#142842]"
            >
              Continue to Step 2 <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Step 2: Target Selection */}
        {currentStep === 2 && (
          <div className="space-y-4 max-w-lg">
            <h3 className="text-[15px] font-semibold text-[#0f172a]">
              Step 2: Select Target Students
            </h3>
            <p className="text-[12px] text-[#334155]">
              Choose whether to apply this charge class-wide, to a specific section, or select individual students.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {(['Class', 'Section', 'Individual'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAssignmentType(t)}
                  className={`p-3 rounded-lg border text-left text-[12px] font-semibold transition-all ${
                    assignmentType === t
                      ? 'border-[#1e3a5f] bg-[#f1f5f9] text-[#1e3a5f]'
                      : 'border-[#e2e8f0] bg-white text-[#334155] hover:bg-[#f8f9fb]'
                  }`}
                >
                  {t}-wide
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Class</label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full rounded-md border border-[#e2e8f0] px-3 py-2 text-[13px]"
                >
                  <option value="9th">Class 9th</option>
                  <option value="10th">Class 10th</option>
                  <option value="11th">Class 11th</option>
                  <option value="12th">Class 12th</option>
                </select>
              </div>

              {assignmentType === 'Section' && (
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Section</label>
                  <select
                    value={targetSection}
                    onChange={(e) => setTargetSection(e.target.value)}
                    className="w-full rounded-md border border-[#e2e8f0] px-3 py-2 text-[13px]"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="rounded border border-[#e2e8f0] px-3 py-1.5 text-[12px] text-[#334155]"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
              >
                Continue to Step 3 <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Fee Structure / Custom Charge */}
        {currentStep === 3 && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-[15px] font-semibold text-[#0f172a]">
              Step 3: Select Fee Structure or Custom Charge
            </h3>
            <p className="text-[12px] text-[#334155]">
              Choose between applying an existing standard fee template or creating a custom charge with mandatory reason.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setChargeType('Custom')}
                className={`flex-1 p-3 rounded-lg border text-left text-[12px] transition-all ${
                  chargeType === 'Custom'
                    ? 'border-[#1e3a5f] bg-[#f1f5f9] text-[#1e3a5f]'
                    : 'border-[#e2e8f0] bg-white text-[#334155]'
                }`}
              >
                <div className="font-semibold text-[#0f172a]">Custom Annual / One-Time Charge</div>
                <div className="text-[11px] text-[#334155]">Special exam fee, lab fund, or sports event</div>
              </button>

              <button
                type="button"
                onClick={() => setChargeType('Structure')}
                className={`flex-1 p-3 rounded-lg border text-left text-[12px] transition-all ${
                  chargeType === 'Structure'
                    ? 'border-[#1e3a5f] bg-[#f1f5f9] text-[#1e3a5f]'
                    : 'border-[#e2e8f0] bg-white text-[#334155]'
                }`}
              >
                <div className="font-semibold text-[#0f172a]">Standard Fee Structure</div>
                <div className="text-[11px] text-[#334155]">Apply existing multi-head package</div>
              </button>
            </div>

            {chargeType === 'Custom' ? (
              <div className="p-4 rounded-lg border border-[#e2e8f0] bg-[#f8f9fb] space-y-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">
                    Charge Title <span className="text-[#991b1b]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full rounded border border-[#e2e8f0] bg-white px-3 py-1.5 text-[13px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-[#0f172a] mb-1">
                      Amount per Student (Rs.) <span className="text-[#991b1b]">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={customAmount}
                      onChange={(e) => setCustomAmount(Number(e.target.value))}
                      className="w-full rounded border border-[#e2e8f0] bg-white px-3 py-1.5 text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#0f172a] mb-1">
                      Due Date <span className="text-[#991b1b]">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={customDueDate}
                      onChange={(e) => setCustomDueDate(e.target.value)}
                      className="w-full rounded border border-[#e2e8f0] bg-white px-3 py-1.5 text-[13px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">
                    Institutional Reason / Justification <span className="text-[#991b1b]">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter formal justification for fee assignment..."
                    className="w-full rounded border border-[#e2e8f0] bg-white px-3 py-1.5 text-[13px]"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Select Structure</label>
                <select
                  value={selectedStructureId}
                  onChange={(e) => setSelectedStructureId(e.target.value)}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-2 text-[13px]"
                >
                  {feeStructures.map((fs) => (
                    <option key={fs.id} value={fs.id}>
                      {fs.name} ({fs.class}) — {formatCurrency(fs.totalStandardFee)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="rounded border border-[#e2e8f0] px-3 py-1.5 text-[12px] text-[#334155]"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
              >
                Preview Impact <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Preview Affected Students */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-[15px] font-semibold text-[#0f172a]">
              Step 4: Preview Affected Students and Financial Impact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[#f8f9fb] border border-[#e2e8f0]">
                <div className="text-[11px] text-[#334155]">Affected Students</div>
                <div className="text-xl font-bold text-[#0f172a]">{affectedStudents.length} students</div>
              </div>
              <div className="p-3 rounded-lg bg-[#f8f9fb] border border-[#e2e8f0]">
                <div className="text-[11px] text-[#334155]">Charge per Student</div>
                <div className="text-xl font-bold text-[#1e3a5f] tabular-nums">
                  {formatCurrency(previewChargePerStudent)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#f8f9fb] border border-[#e2e8f0]">
                <div className="text-[11px] text-[#334155]">Total Batch Assignment</div>
                <div className="text-xl font-bold text-[#166534] tabular-nums">
                  {formatCurrency(totalAssignedSum)}
                </div>
              </div>
            </div>

            {/* List preview (first 5 students) */}
            <div className="rounded-lg border border-[#e2e8f0] overflow-hidden">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#f8f9fb] text-[#64748b] font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Roll No</th>
                    <th className="p-2.5">Student Name</th>
                    <th className="p-2.5">Class</th>
                    <th className="p-2.5 text-right">Current Balance</th>
                    <th className="p-2.5 text-right">New Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {affectedStudents.slice(0, 5).map((s) => (
                    <tr key={s.id}>
                      <td className="p-2.5 font-mono text-[#1e3a5f]">{s.rollNumber}</td>
                      <td className="p-2.5 font-medium text-[#0f172a]">{s.fullName}</td>
                      <td className="p-2.5 text-[#334155]">{s.class}-{s.section}</td>
                      <td className="p-2.5 text-right tabular-nums">{formatCurrency(s.outstandingBalance)}</td>
                      <td className="p-2.5 text-right font-bold tabular-nums text-[#991b1b]">
                        {formatCurrency(s.outstandingBalance + previewChargePerStudent)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCurrentStep(3)}
                className="rounded border border-[#e2e8f0] px-3 py-1.5 text-[12px] text-[#334155]"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
              >
                Proceed to Confirmation <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Final Confirmation */}
        {currentStep === 5 && (
          <div className="space-y-4 max-w-lg">
            <div className="flex items-center gap-2 text-[#166534]">
              <CheckCircle2 className="h-6 w-6" />
              <h3 className="text-[16px] font-bold text-[#0f172a]">Ready to Assign Fees</h3>
            </div>
            <p className="text-[13px] text-[#334155]">
              Please review the batch summary before posting charges to student ledger accounts:
            </p>

            <div className="rounded-lg border border-[#e2e8f0] p-4 bg-[#f8f9fb] space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#334155]">Charge Title:</span>
                <span className="font-semibold text-[#0f172a]">
                  {chargeType === 'Custom' ? customTitle : 'Standard Structure'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#334155]">Target Group:</span>
                <span className="font-semibold text-[#0f172a]">
                  Class {targetClass} ({affectedStudents.length} students)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#334155]">Charge Amount:</span>
                <span className="font-semibold text-[#1e3a5f] tabular-nums">
                  {formatCurrency(previewChargePerStudent)} each
                </span>
              </div>
              <div className="flex justify-between border-t border-[#e2e8f0] pt-2">
                <span className="text-[#334155]">Total Assigned:</span>
                <span className="font-bold text-[#166534] tabular-nums">
                  {formatCurrency(totalAssignedSum)}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCurrentStep(4)}
                className="rounded border border-[#e2e8f0] px-3 py-1.5 text-[12px] text-[#334155]"
              >
                Back
              </button>
              <button
                onClick={handleExecuteAssignment}
                className="rounded-md bg-[#166534] px-5 py-2 text-[12px] font-semibold text-white hover:bg-[#126b49]"
              >
                Confirm & Apply Assignment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Assignment History Table */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#e2e8f0]">
          <h3 className="text-[14px] font-semibold text-[#0f172a]">Fee Assignment History</h3>
          <p className="text-[12px] text-[#334155]">Record of institutional charges posted across classes</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Title</th>
                <th className="py-2.5 px-4">Target Group</th>
                <th className="py-2.5 px-4">Academic Session</th>
                <th className="py-2.5 px-4 text-center">Affected Students</th>
                <th className="py-2.5 px-4 text-right">Total Amount</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {feeAssignments.map((fa) => (
                <tr key={fa.id} className="hover:bg-[#f8f9fb]">
                  <td className="py-2.5 px-4 text-[#334155] text-[12px]">{formatDate(fa.assignedDate)}</td>
                  <td className="py-2.5 px-4 font-semibold text-[#0f172a]">{fa.title}</td>
                  <td className="py-2.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-[#f1f5f9] text-[#0f172a]">
                      {fa.type} ({fa.targetClass || 'Multi'})
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[12px] text-[#334155]">{fa.academicSession}</td>
                  <td className="py-2.5 px-4 text-center font-medium">{fa.affectedStudentsCount}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-[#166534] tabular-nums">
                    {formatCurrency(fa.totalAssignedAmount)}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#f0fdf4] text-[#166534]">
                      Applied
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
