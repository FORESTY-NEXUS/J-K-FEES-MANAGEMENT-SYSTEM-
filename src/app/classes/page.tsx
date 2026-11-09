'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Users,
  Layers,
  CheckCircle2,
  Settings,
  Pencil,
  X,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function ClassesPage() {
  const { classes, addClass, feeStructures, students } = useFeeApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newSections, setNewSections] = useState('A, B');
  const [selectedFeeStructureId, setSelectedFeeStructureId] = useState(feeStructures[0]?.id || '');

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      toast.error('Please enter class title');
      return;
    }
    const secArray = newSections.split(',').map((s) => s.trim()).filter(Boolean);
    addClass(newClassName, secArray, selectedFeeStructureId);
    toast.success(`Class ${newClassName} created!`);
    setIsAddOpen(false);
    setNewClassName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
            Classes & Sections Configuration
          </h1>
          <p className="text-[13px] text-[#334155]">
            Configure academic classes, section divisions, and default fee structure associations.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3.5 py-1.5 text-[12px] font-medium text-white shadow-xs hover:bg-[#142842] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Class</span>
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((cls) => {
          const classStudents = students.filter((s) => s.class === cls.className);
          const defaultStructure = feeStructures.find((f) => f.id === cls.defaultFeeStructureId);

          return (
            <div key={cls.id} className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#1e3a5f]">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0f172a]">Class {cls.className}</h2>
                    <span className="text-[12px] text-[#334155]">
                      {cls.sections.map((s) => `Section ${s}`).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-[#0f172a] tabular-nums">
                    {classStudents.length > 0 ? classStudents.length : cls.studentCount}
                  </span>
                  <span className="text-[11px] text-[#334155] block">Enrolled Students</span>
                </div>
              </div>

              {/* Default Fee Structure Info */}
              <div className="p-3 rounded-lg bg-[#f8f9fb] border border-[#e2e8f0] space-y-1 text-[12px]">
                <div className="text-[11px] font-semibold text-[#334155]">DEFAULT FEE STRUCTURE</div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#1e3a5f]">
                    {defaultStructure?.name || cls.defaultFeeStructureName}
                  </span>
                  <span className="font-bold text-[#0f172a] tabular-nums">
                    {defaultStructure ? formatCurrency(defaultStructure.totalStandardFee) : '-'}
                  </span>
                </div>
              </div>

              {/* Section Breakdown */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-[#334155] uppercase">Active Sections</span>
                <div className="flex gap-2">
                  {cls.sections.map((sec) => {
                    const secCount = classStudents.filter((s) => s.section === sec).length;
                    return (
                      <div
                        key={sec}
                        className="flex-1 p-2 rounded border border-[#e2e8f0] text-center bg-white"
                      >
                        <div className="font-bold text-[13px] text-[#0f172a]">Section {sec}</div>
                        <div className="text-[11px] text-[#334155]">{secCount || Math.round(cls.studentCount / 2)} students</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Class */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <h3 className="text-[16px] font-bold text-[#0f172a]">Add Academic Class</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-[#334155] hover:text-[#0f172a]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Class Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1st Year (ICS)"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Sections (comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="A, B, C"
                  value={newSections}
                  onChange={(e) => setNewSections(e.target.value)}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#0f172a] mb-1">Default Fee Structure</label>
                <select
                  value={selectedFeeStructureId}
                  onChange={(e) => setSelectedFeeStructureId(e.target.value)}
                  className="w-full rounded border border-[#e2e8f0] px-3 py-1.5 text-[13px]"
                >
                  {feeStructures.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({formatCurrency(f.totalStandardFee)})
                    </option>
                  ))}
                </select>
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
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
