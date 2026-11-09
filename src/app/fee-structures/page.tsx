'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Eye,
  Pencil,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  ShieldAlert,
  ArrowRight,
  Trash2,
  X,
  History,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { FeeStructure, Frequency } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function FeeStructuresPage() {
  const { feeStructures, feeHeads, addFeeStructure, updateFeeStructure } = useFeeApp();

  // Create Dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null);

  // New Structure Form
  const [formName, setFormName] = useState('');
  const [formClass, setFormClass] = useState('11th');
  const [formFrequency, setFormFrequency] = useState<Frequency>('Monthly');
  const [formSession, setFormSession] = useState('2026–2027');
  const [formVersion, setFormVersion] = useState('v1.0');
  const [formHeads, setFormHeads] = useState<
    Array<{
      feeHeadId: string;
      feeHeadName: string;
      amount: number;
      frequency: Frequency;
      isMandatory: boolean;
    }>
  >([
    { feeHeadId: 'fh-1', feeHeadName: 'Tuition Fee', amount: 3500, frequency: 'Monthly', isMandatory: true },
    { feeHeadId: 'fh-2', feeHeadName: 'Sports Fund', amount: 1000, frequency: 'Annual', isMandatory: true },
    { feeHeadId: 'fh-4', feeHeadName: 'Examination Charges', amount: 1500, frequency: 'Annual', isMandatory: true },
  ]);

  // Confirmation before publishing version
  const [confirmPublishOpen, setConfirmPublishOpen] = useState(false);

  const calculateTotal = (heads: typeof formHeads) => {
    return heads.reduce((sum, h) => sum + Number(h.amount || 0), 0);
  };

  const handleAddFeeHeadRow = () => {
    const unselected = feeHeads.find(fh => !formHeads.some(h => h.feeHeadId === fh.id)) || feeHeads[0];
    setFormHeads([
      ...formHeads,
      {
        feeHeadId: unselected.id,
        feeHeadName: unselected.name,
        amount: unselected.defaultAmount,
        frequency: unselected.frequency,
        isMandatory: unselected.isMandatory,
      },
    ]);
  };

  const handleRemoveFeeHeadRow = (index: number) => {
    if (formHeads.length <= 1) {
      toast.error('A fee structure must contain at least one fee head.');
      return;
    }
    setFormHeads(formHeads.filter((_, idx) => idx !== index));
  };

  const handleHeadChange = (index: number, headId: string) => {
    const fh = feeHeads.find(h => h.id === headId);
    if (!fh) return;
    const updated = [...formHeads];
    updated[index] = {
      ...updated[index],
      feeHeadId: fh.id,
      feeHeadName: fh.name,
      amount: fh.defaultAmount,
      frequency: fh.frequency,
      isMandatory: fh.isMandatory,
    };
    setFormHeads(updated);
  };

  const handleAmountChange = (index: number, amount: number) => {
    const updated = [...formHeads];
    updated[index].amount = amount;
    setFormHeads(updated);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Please enter a structure name');
      return;
    }
    setConfirmPublishOpen(true);
  };

  const executePublish = () => {
    const total = calculateTotal(formHeads);
    addFeeStructure({
      name: formName,
      class: formClass,
      billingFrequency: formFrequency,
      totalStandardFee: total,
      effectiveDate: new Date().toISOString().slice(0, 10),
      academicSession: formSession,
      status: 'Active',
      version: formVersion,
      feeHeads: formHeads,
    });

    toast.success(`Fee structure "${formName}" version ${formVersion} published successfully! Existing invoices remain intact.`);
    setConfirmPublishOpen(false);
    setIsCreateOpen(false);
    // Reset form
    setFormName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
            Fee Structures
          </h1>
          <p className="text-[13px] text-[#334155]">
            Configure standardized fee heads, versioning, billing frequencies, and class templates.
          </p>
        </div>

        <button
          onClick={() => {
            setFormName(`Class 11th Pre-Medical 2026`);
            setFormVersion(`v${feeStructures.length + 1}.0`);
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3.5 py-1.5 text-[12px] font-medium text-white shadow-xs hover:bg-[#142842] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Fee Structure</span>
        </button>
      </div>

      {/* Info notice about versioning */}
      <div className="flex items-start gap-3 rounded-lg border border-[#e2e8f0] bg-white p-4 text-[12px] text-[#334155] shadow-2xs">
        <ShieldAlert className="h-5 w-5 text-[#1e3a5f] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#0f172a] font-semibold">Institutional Financial Integrity:</strong>
          <span className="ml-1">
            Publishing new fee structures uses strict version control. Modifying or publishing a new structure does not alter or recalculate historically issued invoices or receipts.
          </span>
        </div>
      </div>

      {/* Structures Table */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                <th className="py-3 px-4">Structure Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Billing Frequency</th>
                <th className="py-3 px-4">Academic Session</th>
                <th className="py-3 px-4">Effective Date</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4 text-right">Standard Total</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {feeStructures.map((fs) => (
                <tr key={fs.id} className="hover:bg-[#f8f9fb] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#0f172a]">
                    {fs.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#f1f5f9] text-[#0f172a]">
                      Class {fs.class}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#334155]">
                    {fs.billingFrequency}
                  </td>
                  <td className="py-3 px-4 text-[#334155] font-mono text-[12px]">
                    {fs.academicSession}
                  </td>
                  <td className="py-3 px-4 text-[#334155] text-[12px]">
                    {formatDate(fs.effectiveDate)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] bg-[#f1f5f9] text-[#1e3a5f] px-2 py-0.5 rounded font-bold">
                      {fs.version}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#0f172a] tabular-nums">
                    {formatCurrency(fs.totalStandardFee)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        fs.status === 'Active'
                          ? 'bg-[#f0fdf4] text-[#166534]'
                          : 'bg-[#f1f5f9] text-[#334155]'
                      }`}
                    >
                      {fs.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedStructure(fs);
                        setIsViewOpen(true);
                      }}
                      className="p-1 text-[#334155] hover:text-[#1e3a5f] rounded hover:bg-[#f1f5f9]"
                      title="Inspect fee breakdown"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View Breakdown */}
      {isViewOpen && selectedStructure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3 mb-4">
              <div>
                <h3 className="text-[16px] font-bold text-[#0f172a]">{selectedStructure.name}</h3>
                <p className="text-[12px] text-[#334155]">
                  Version {selectedStructure.version} · Effective: {formatDate(selectedStructure.effectiveDate)}
                </p>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="text-[#334155] hover:text-[#0f172a]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-[12px] font-semibold text-[#0f172a]">Configured Fee Heads</div>
              <table className="w-full text-left text-[12px] border border-[#e2e8f0]">
                <thead>
                  <tr className="bg-[#f8f9fb] font-semibold text-[#334155] border-b border-[#e2e8f0]">
                    <th className="p-2">Fee Head</th>
                    <th className="p-2">Frequency</th>
                    <th className="p-2">Status</th>
                    <th className="p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {selectedStructure.feeHeads.map((head, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-medium text-[#0f172a]">{head.feeHeadName}</td>
                      <td className="p-2 text-[#334155]">{head.frequency}</td>
                      <td className="p-2">
                        <span className="text-[10px] text-[#1e3a5f] bg-[#f1f5f9] px-1.5 py-0.5 rounded font-medium">
                          {head.isMandatory ? 'Mandatory' : 'Optional'}
                        </span>
                      </td>
                      <td className="p-2 text-right font-semibold tabular-nums text-[#0f172a]">
                        {formatCurrency(head.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0]">
                <span className="text-[13px] font-bold text-[#0f172a]">Total Standard Fee:</span>
                <span className="text-base font-bold text-[#166534] tabular-nums">
                  {formatCurrency(selectedStructure.totalStandardFee)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Fee Structure */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl my-6">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3 mb-4">
              <div>
                <h3 className="text-[16px] font-bold text-[#0f172a]">Create New Fee Structure</h3>
                <p className="text-[12px] text-[#334155]">Define multi-head fee schedules and versioning rules</p>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="text-[#334155] hover:text-[#0f172a]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Structure Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. 11th Pre-Medical F.Sc Standard"
                    className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Target Class</label>
                  <select
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                  >
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Billing Frequency</label>
                  <select
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value as Frequency)}
                    className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                    <option value="One-Time">One-Time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Academic Session</label>
                  <input
                    type="text"
                    value={formSession}
                    onChange={(e) => setFormSession(e.target.value)}
                    className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Version</label>
                  <input
                    type="text"
                    value={formVersion}
                    onChange={(e) => setFormVersion(e.target.value)}
                    className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                  />
                </div>
              </div>

              {/* Dynamic Fee Heads Table */}
              <div className="border border-[#e2e8f0] rounded-lg p-3 bg-[#f8f9fb] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#0f172a]">Fee Heads Breakdown</span>
                  <button
                    type="button"
                    onClick={handleAddFeeHeadRow}
                    className="text-[11px] font-semibold text-[#1e3a5f] hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add Fee Head
                  </button>
                </div>

                <div className="space-y-2">
                  {formHeads.map((head, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded border border-[#e2e8f0]">
                      <select
                        value={head.feeHeadId}
                        onChange={(e) => handleHeadChange(idx, e.target.value)}
                        className="flex-1 rounded border border-[#e2e8f0] px-2 py-1 text-[12px]"
                      >
                        {feeHeads.map((fh) => (
                          <option key={fh.id} value={fh.id}>
                            {fh.name} ({fh.category})
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        value={head.amount}
                        onChange={(e) => handleAmountChange(idx, Number(e.target.value))}
                        className="w-28 rounded border border-[#e2e8f0] px-2 py-1 text-[12px] text-right font-medium"
                        placeholder="Amount"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveFeeHeadRow(idx)}
                        className="p-1 text-[#991b1b] hover:bg-[#fef2f2] rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#e2e8f0] text-[13px] font-bold">
                  <span>Calculated Standard Total:</span>
                  <span className="text-[#1e3a5f] tabular-nums">{formatCurrency(calculateTotal(formHeads))}</span>
                </div>
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
                  Publish Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Before Publishing Version */}
      {confirmPublishOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-[#1e3a5f] mb-3">
              <ShieldAlert className="h-6 w-6" />
              <h3 className="text-[16px] font-bold text-[#0f172a]">Confirm Fee Structure Version</h3>
            </div>
            <p className="text-[13px] text-[#334155] leading-relaxed mb-4">
              You are about to publish <strong>{formName} ({formVersion})</strong> with a total fee of{' '}
              <strong>{formatCurrency(calculateTotal(formHeads))}</strong>.
              <br />
              <br />
              This will become active for upcoming billing cycles. Historical invoices will remain completely protected and unchanged.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmPublishOpen(false)}
                className="rounded px-3 py-1.5 text-[12px] text-[#334155]"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={executePublish}
                className="rounded bg-[#1e3a5f] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
              >
                Confirm & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
