'use client';

import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Archive,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function AcademicSessionsPage() {
  const { sessions, addSession, setActiveSession } = useFeeApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [sessionName, setSessionName] = useState('2027–2028');
  const [startDate, setStartDate] = useState('2027-04-01');
  const [endDate, setEndDate] = useState('2028-03-31');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addSession({
      name: sessionName,
      startDate,
      endDate,
      isActive: false,
      isArchived: false,
    });
    toast.success(`Academic session ${sessionName} created!`);
    setIsAddOpen(false);
  };

  const handleSwitchActive = (id: string, name: string) => {
    setActiveSession(id);
    toast.success(`Active academic session switched to ${name}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
            Academic Sessions
          </h1>
          <p className="text-[13px] text-[#334155]">
            Configure institutional billing years, archive past sessions, and set the active academic timeline.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3.5 py-1.5 text-[12px] font-medium text-white shadow-xs hover:bg-[#142842] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Academic Session</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sessions.map((ses) => (
          <div
            key={ses.id}
            className={`rounded-xl border p-5 bg-white shadow-2xs space-y-4 transition-all ${
              ses.isActive ? 'border-[#1e3a5f] ring-1 ring-[#1e3a5f]' : 'border-[#e2e8f0]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-[#0f172a]">{ses.name}</span>
              {ses.isActive ? (
                <span className="inline-flex items-center gap-1 bg-[#f0fdf4] text-[#166534] text-[11px] font-bold px-2 py-0.5 rounded">
                  <CheckCircle2 className="h-3 w-3" /> Active Session
                </span>
              ) : ses.isArchived ? (
                <span className="inline-flex items-center gap-1 bg-[#f1f5f9] text-[#334155] text-[11px] font-medium px-2 py-0.5 rounded">
                  <Archive className="h-3 w-3" /> Archived
                </span>
              ) : (
                <span className="text-[11px] font-medium text-[#854d0e] bg-[#fefce8] px-2 py-0.5 rounded">
                  Upcoming
                </span>
              )}
            </div>

            <div className="space-y-1.5 text-[12px] text-[#334155]">
              <div className="flex justify-between">
                <span>Start Date:</span>
                <span className="font-medium text-[#0f172a]">{formatDate(ses.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>End Date:</span>
                <span className="font-medium text-[#0f172a]">{formatDate(ses.endDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Enrolled Students:</span>
                <span className="font-semibold text-[#0f172a] tabular-nums">
                  {ses.totalStudents.toLocaleString()} students
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#e2e8f0]">
              {!ses.isActive ? (
                <button
                  onClick={() => handleSwitchActive(ses.id, ses.name)}
                  className="w-full rounded-md border border-[#e2e8f0] py-1.5 text-[12px] font-semibold text-[#1e3a5f] hover:bg-[#f1f5f9]"
                >
                  Set as Active Session
                </button>
              ) : (
                <div className="text-center text-[11px] font-semibold text-[#166534]">
                  Currently in use across all modules
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Academic Session */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <h3 className="text-[16px] font-bold text-[#0f172a]">Create Academic Session</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-[#334155] hover:text-[#0f172a]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Session Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2027–2028"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded px-4 py-1.5 text-[12px] text-[#334155]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-[#1e3a5f] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
