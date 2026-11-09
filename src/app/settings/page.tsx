'use client';

import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Wallet,
  MessageCircle,
  FileText,
  RotateCcw,
  ShieldAlert,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { SystemSettings } from '@/types';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { settings, updateSettings, resetDemoData } = useFeeApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'fee' | 'notifications' | 'documents' | 'demo'>('profile');

  // Form state
  const [collegeName, setCollegeName] = useState(settings.collegeName);
  const [subtitle, setSubtitle] = useState(settings.subtitle);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [website, setWebsite] = useState(settings.website);
  const [receiptFooter, setReceiptFooter] = useState(settings.receiptFooter);

  const [gracePeriod, setGracePeriod] = useState(settings.defaultGracePeriodDays);
  const [dueDateDay, setDueDateDay] = useState(settings.defaultDueDateDayOfMonth);
  const [lateFee, setLateFee] = useState(settings.lateFeePerDay);
  const [allowPartial, setAllowPartial] = useState(settings.allowPartialPayment);
  const [allowAdvance, setAllowAdvance] = useState(settings.allowAdvancePayment);
  const [invoicePrefix, setInvoicePrefix] = useState(settings.invoicePrefix);
  const [receiptPrefix, setReceiptPrefix] = useState(settings.receiptPrefix);
  const [challanLayout, setChallanLayout] = useState(settings.challanLayout);
  const [whatsappSender, setWhatsappSender] = useState(settings.whatsappSenderName);

  // Reset confirmation
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      collegeName,
      subtitle,
      address,
      phone,
      email,
      website,
      receiptFooter,
    });
    toast.success('College profile settings updated!');
  };

  const handleSaveFeeSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      defaultGracePeriodDays: Number(gracePeriod),
      defaultDueDateDayOfMonth: Number(dueDateDay),
      lateFeePerDay: Number(lateFee),
      allowPartialPayment: allowPartial,
      allowAdvancePayment: allowAdvance,
      invoicePrefix,
      receiptPrefix,
      challanLayout,
      whatsappSenderName: whatsappSender,
    });
    toast.success('Financial & document rules updated successfully!');
  };

  const handleExecuteReset = () => {
    resetDemoData();
    toast.success('Demo data restored to initial clean benchmark state!');
    setConfirmResetOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
          System Settings & Configuration
        </h1>
        <p className="text-[13px] text-[#334155]">
          Configure college branding, grace periods, numbering sequences, challan formats, and demo storage.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e2e8f0]">
        <nav className="flex space-x-6">
          {[
            { id: 'profile', label: 'College Profile', icon: Building2 },
            { id: 'fee', label: 'Fee & Billing Rules', icon: Wallet },
            { id: 'notifications', label: 'Notification Preferences', icon: MessageCircle },
            { id: 'documents', label: 'Challan & Receipt Layout', icon: FileText },
            { id: 'demo', label: 'Demo Data Management', icon: RotateCcw },
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
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab 1: College Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-2xs space-y-4 max-w-2xl">
          <h3 className="text-[15px] font-semibold text-[#0f172a] border-b border-[#e2e8f0] pb-2">
            Institutional Identity & Contact Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-[#0f172a] mb-1">College Name</label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#0f172a] mb-1">System Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Official Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Website URL</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Printed Receipt Footer</label>
            <input
              type="text"
              value={receiptFooter}
              onChange={(e) => setReceiptFooter(e.target.value)}
              className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-[#e2e8f0]">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#142842]"
            >
              <Save className="h-4 w-4" /> Save Profile
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Fee & Billing Rules */}
      {activeTab === 'fee' && (
        <form onSubmit={handleSaveFeeSettings} className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-2xs space-y-4 max-w-2xl">
          <h3 className="text-[15px] font-semibold text-[#0f172a] border-b border-[#e2e8f0] pb-2">
            Grace Periods, Late Fees & Sequences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Default Grace Period</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={gracePeriod}
                  onChange={(e) => setGracePeriod(Number(e.target.value))}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                />
                <span className="text-[12px] text-[#334155]">Days</span>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Default Due Day of Month</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={dueDateDay}
                  onChange={(e) => setDueDateDay(Number(e.target.value))}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                />
                <span className="text-[12px] text-[#334155]">th</span>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Late Fee per Day</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={lateFee}
                  onChange={(e) => setLateFee(Number(e.target.value))}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                />
                <span className="text-[12px] text-[#334155]">Rs.</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Invoice Prefix Format</label>
              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px] font-mono"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Receipt Prefix Format</label>
              <input
                type="text"
                value={receiptPrefix}
                onChange={(e) => setReceiptPrefix(e.target.value)}
                className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px] font-mono"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#e2e8f0]">
            <label className="flex items-center gap-2 cursor-pointer text-[13px]">
              <input
                type="checkbox"
                checked={allowPartial}
                onChange={(e) => setAllowPartial(e.target.checked)}
                className="rounded border-[#cbd5e1] text-[#1e3a5f]"
              />
              <span>Allow partial payments at collection counters</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[13px]">
              <input
                type="checkbox"
                checked={allowAdvance}
                onChange={(e) => setAllowAdvance(e.target.checked)}
                className="rounded border-[#cbd5e1] text-[#1e3a5f]"
              />
              <span>Allow advance fee credits to rollover automatically</span>
            </label>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#e2e8f0]">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#142842]"
            >
              <Save className="h-4 w-4" /> Save Financial Rules
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-2xs space-y-4 max-w-2xl">
          <h3 className="text-[15px] font-semibold text-[#0f172a] border-b border-[#e2e8f0] pb-2">
            WhatsApp Gateway & Notification Preferences
          </h3>

          <div>
            <label className="block text-[12px] font-medium text-[#0f172a] mb-1">WhatsApp Verified Sender Name</label>
            <input
              type="text"
              value={whatsappSender}
              onChange={(e) => setWhatsappSender(e.target.value)}
              className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
            />
            <span className="text-[11px] text-[#334155]">Appears as header on simulated notifications</span>
          </div>

          <div className="p-3 rounded-lg border border-[#e2e8f0] bg-[#f8f9fb] space-y-1 text-[12px] text-[#334155]">
            <span className="font-semibold text-[#0f172a] block">Automatic Dispatch Schedule:</span>
            Overdue reminder batches trigger on the 11th of every month immediately following the expiration of the 10-day grace period.
          </div>
        </div>
      )}

      {/* Tab 4: Documents */}
      {activeTab === 'documents' && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-2xs space-y-4 max-w-2xl">
          <h3 className="text-[15px] font-semibold text-[#0f172a] border-b border-[#e2e8f0] pb-2">
            Printable Documents & Challan Formats
          </h3>

          <div>
            <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Standard Challan Format</label>
            <select
              value={challanLayout}
              onChange={(e) => setChallanLayout(e.target.value as typeof challanLayout)}
              className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
            >
              <option value="Compact 3-Part">Compact 3-Part (Bank Copy + College Copy + Student Copy)</option>
              <option value="Standard A4">Standard Full A4 Portrait</option>
              <option value="Single Copy">Single Student Voucher</option>
            </select>
          </div>

          <div className="text-[12px] text-[#334155] space-y-1">
            <p><strong>Paper Standard:</strong> A4 Portrait (210mm × 297mm)</p>
            <p><strong>Print Engine:</strong> Native browser vector print stylesheet (@media print)</p>
          </div>
        </div>
      )}

      {/* Tab 5: Demo Data Management */}
      {activeTab === 'demo' && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-2xs space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-[#854d0e]">
            <ShieldAlert className="h-5 w-5" />
            <h3 className="text-[15px] font-bold text-[#0f172a]">Demo Data Persistence & Reset</h3>
          </div>

          <p className="text-[13px] text-[#334155] leading-relaxed">
            All user-recorded payments, newly added students, fee assignments, and simulated WhatsApp notifications are stored locally in your browser&apos;s <code>localStorage</code>.
            <br />
            <br />
            If you wish to wipe any test modifications and restore the clean benchmark mock dataset (100 students, Rs. 42,85,000 invoiced, 79.8% collection rate), click the button below:
          </p>

          <div className="pt-2">
            <button
              onClick={() => setConfirmResetOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#991b1b] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#b03d3d]"
            >
              <RotateCcw className="h-4 w-4" /> Reset Demo Data to Initial State
            </button>
          </div>
        </div>
      )}

      {/* Modal: Confirm Demo Reset */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#0f172a]">Confirm Reset Demo Data</h3>
            <p className="text-[13px] text-[#334155]">
              Are you sure you want to clear all browser-stored payments and new student accounts? This will restore the official Jammu Kashmir College benchmark demo dataset.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="rounded px-4 py-1.5 text-[12px] text-[#334155]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReset}
                className="rounded bg-[#991b1b] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-[#b03d3d]"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
