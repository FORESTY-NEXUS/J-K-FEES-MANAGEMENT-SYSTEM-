'use client';

import React, { useState } from 'react';
import {
  FileClock,
  Search,
  Filter,
  Download,
  CalendarDays,
  ShieldCheck,
  User,
  Activity,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function AuditLogsPage() {
  const { auditLogs } = useFeeApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');

  const filteredLogs = auditLogs.filter((log) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      log.action.toLowerCase().includes(q) ||
      log.description.toLowerCase().includes(q) ||
      log.recordReference.toLowerCase().includes(q) ||
      log.user.toLowerCase().includes(q);

    const matchModule = selectedModule === 'All' || log.module === selectedModule;
    return matchSearch && matchModule;
  });

  const handleExportCSV = () => {
    const rows = filteredLogs.map((l) => ({
      Timestamp: l.timestamp,
      User: l.user,
      Action: l.action,
      Module: l.module,
      RecordRef: l.recordReference,
      Description: l.description,
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
    link.setAttribute('download', `JKC_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${rows.length} audit logs to CSV`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
            Institutional Audit Trail
          </h1>
          <p className="text-[13px] text-[#334155]">
            Immutable chronological activity log recording all fee transactions, reversals, waivers, and adjustments.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#0f172a] shadow-2xs hover:bg-[#f8f9fb] transition-colors"
        >
          <Download className="h-3.5 w-3.5 text-[#334155]" />
          <span>Export Audit Trail</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search audit trail by action, description, reference, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-[#e2e8f0] bg-[#f8f9fb] pl-9 pr-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full rounded-md border border-[#e2e8f0] bg-[#f8f9fb] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:bg-white focus:outline-none"
            >
              <option value="All">All Functional Modules</option>
              <option value="Fee Collection">Fee Collection</option>
              <option value="Invoices">Invoices</option>
              <option value="Payments">Payments</option>
              <option value="Adjustments">Adjustments & Discounts</option>
              <option value="Refunds">Refunds</option>
              <option value="WhatsApp Notifications">WhatsApp Notifications</option>
              <option value="Students">Students</option>
              <option value="Fee Structures">Fee Structures</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Record Ref</th>
                <th className="py-3 px-4">Audit Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#f8f9fb] transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-[#334155] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#0f172a]">
                    {log.user}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#f1f5f9] text-[#1e3a5f]">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#0f172a]">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#334155]">
                    {log.recordReference}
                  </td>
                  <td className="py-3 px-4 text-[#334155] max-w-md">
                    {log.description}
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
