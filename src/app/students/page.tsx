'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  Wallet,
  Percent,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { Student, FeeStatus } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function StudentsPage() {
  const router = useRouter();
  const { students, addStudent } = useFeeApp();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Sorting
  const [sortField, setSortField] = useState<keyof Student>('rollNumber');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Multi-selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Add Student Dialog State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    guardianPhone: '+92 300 ',
    studentPhone: '+92 301 ',
    class: '11th',
    section: 'A',
    rollNumber: '',
    admissionNumber: 'JKC-2026-9101',
    admissionDate: '2026-11-09',
    academicSession: '2026–2027',
    monthlyTuition: 3500,
    initialAnnualCharges: 4500,
    includeCustomCharge: false,
    customChargeTitle: 'Annual Laboratory & IT Fund',
    customChargeReason: 'Computer laboratory upgrade and examination registration fund',
    customChargeAmount: 2500,
    customChargeDueDate: '2026-11-20',
  });

  // Filtered & Sorted Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.fullName.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.admissionNumber.toLowerCase().includes(q) ||
        s.fatherName.toLowerCase().includes(q);

      const matchesClass = selectedClass === 'All' || s.class === selectedClass;
      const matchesSection = selectedSection === 'All' || s.section === selectedSection;
      const matchesStatus = selectedStatus === 'All' || s.feeStatus === selectedStatus;

      return matchesSearch && matchesClass && matchesSection && matchesStatus;
    });
  }, [students, searchQuery, selectedClass, selectedSection, selectedStatus]);

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredStudents, sortField, sortAsc]);

  // Paginated Students
  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedStudents.slice(start, start + pageSize);
  }, [sortedStudents, currentPage, pageSize]);

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedStudents.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    const rows = sortedStudents.map((s) => ({
      AdmissionNo: s.admissionNumber,
      RollNo: s.rollNumber,
      Name: s.fullName,
      FatherName: s.fatherName,
      Class: `${s.class}-${s.section}`,
      MonthlyTuition: s.monthlyTuition,
      Outstanding: s.outstandingBalance,
      Overdue: s.overdueBalance,
      FeeStatus: s.feeStatus,
      GuardianContact: s.guardianPhone,
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
    link.setAttribute('download', `JKC_Students_Fee_List_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${rows.length} students to CSV`);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.fatherName.trim() || !formData.rollNumber.trim()) {
      toast.error('Please fill in Student Name, Father Name, and Roll Number');
      return;
    }

    const created = addStudent({
      fullName: formData.fullName,
      fatherName: formData.fatherName,
      guardianPhone: formData.guardianPhone,
      studentPhone: formData.studentPhone,
      class: formData.class,
      section: formData.section,
      rollNumber: formData.rollNumber,
      admissionNumber: formData.admissionNumber,
      admissionDate: formData.admissionDate,
      academicSession: formData.academicSession,
      monthlyTuition: Number(formData.monthlyTuition),
      initialAnnualCharges: Number(formData.initialAnnualCharges),
      status: 'Active',
      customAnnualCharge: formData.includeCustomCharge
        ? {
            title: formData.customChargeTitle,
            reason: formData.customChargeReason,
            amount: Number(formData.customChargeAmount),
            dueDate: formData.customChargeDueDate,
          }
        : undefined,
    });

    toast.success(`Student ${created.fullName} enrolled successfully! Initial invoice created.`);
    setIsAddOpen(false);
    // Reset form
    setFormData({
      fullName: '',
      fatherName: '',
      guardianPhone: '+92 300 ',
      studentPhone: '+92 301 ',
      class: '11th',
      section: 'A',
      rollNumber: '',
      admissionNumber: 'JKC-2026-9101',
      admissionDate: '2026-11-09',
      academicSession: '2026–2027',
      monthlyTuition: 3500,
      initialAnnualCharges: 4500,
      includeCustomCharge: false,
      customChargeTitle: 'Annual Laboratory & IT Fund',
      customChargeReason: 'Computer laboratory upgrade and examination registration fund',
      customChargeAmount: 2500,
      customChargeDueDate: '2026-11-20',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
            Student Fee Accounts
          </h1>
          <p className="text-[13px] text-[#334155]">
            Manage fee profiles, billing plans, ledger records, and outstanding balances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#0f172a] shadow-2xs hover:bg-[#f8f9fb] transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-[#334155]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3.5 py-1.5 text-[12px] font-medium text-white shadow-xs hover:bg-[#142842] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search box */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search by student name, roll number, or admission no..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-[#e2e8f0] bg-[#f8f9fb] pl-9 pr-3 py-1.5 text-[13px] text-[#0f172a] placeholder-[#64748b] focus:border-[#1e3a5f] focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[#64748b] hover:text-[#0f172a]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-[#e2e8f0] bg-[#f8f9fb] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:bg-white focus:outline-none"
            >
              <option value="All">All Classes (9th–12th)</option>
              <option value="9th">Class 9th</option>
              <option value="10th">Class 10th</option>
              <option value="11th">Class 11th</option>
              <option value="12th">Class 12th</option>
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-[#e2e8f0] bg-[#f8f9fb] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:bg-white focus:outline-none"
            >
              <option value="All">All Sections (A & B)</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          {/* Fee Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-[#e2e8f0] bg-[#f8f9fb] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:bg-white focus:outline-none"
            >
              <option value="All">All Fee Statuses</option>
              <option value="Paid">Paid (Settled)</option>
              <option value="Pending">Pending (Within Grace)</option>
              <option value="Overdue">Overdue (Defaulters)</option>
            </select>
          </div>
        </div>

        {/* Selected count info banner */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-[#f1f5f9] px-3 py-2 text-[12px] text-[#1e3a5f]">
            <span>
              <strong>{selectedIds.length}</strong> students selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  router.push(`/notifications?recipients=${selectedIds.join(',')}`);
                }}
                className="font-medium underline hover:text-[#142842]"
              >
                Send WhatsApp Reminder
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-[#334155] hover:text-[#0f172a]"
              >
                Clear selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Students Data Table */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === paginatedStudents.length}
                    onChange={toggleSelectAll}
                    className="rounded border-[#cbd5e1] text-[#1e3a5f] focus:ring-0"
                  />
                </th>
                <th
                  onClick={() => handleSort('rollNumber')}
                  className="py-3 px-4 cursor-pointer hover:text-[#0f172a]"
                >
                  <div className="flex items-center gap-1">
                    <span>Roll No</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('fullName')}
                  className="py-3 px-4 cursor-pointer hover:text-[#0f172a]"
                >
                  <div className="flex items-center gap-1">
                    <span>Student Name</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Father / Guardian</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Admission No</th>
                <th className="py-3 px-4 text-right">Monthly Fee</th>
                <th
                  onClick={() => handleSort('outstandingBalance')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#0f172a]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Outstanding</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Fee Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-[#334155]">
                    No student records match the applied criteria.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const isSelected = selectedIds.includes(student.id);

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-[#f8f9fb] transition-colors ${
                        isSelected ? 'bg-[#f1f5f9]' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(student.id)}
                          className="rounded border-[#cbd5e1] text-[#1e3a5f] focus:ring-0"
                        />
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-[#1e3a5f]">
                        {student.rollNumber}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/students/${student.id}`}
                          className="font-medium text-[#0f172a] hover:text-[#1e3a5f] hover:underline"
                        >
                          {student.fullName}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-[#334155]">
                        {student.fatherName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#f1f5f9] text-[#0f172a]">
                          {student.class}-{student.section}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#334155] font-mono text-[11px]">
                        {student.admissionNumber}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-[#0f172a]">
                        {formatCurrency(student.monthlyTuition)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium tabular-nums">
                        {student.outstandingBalance > 0 ? (
                          <span
                            className={
                              student.feeStatus === 'Overdue'
                                ? 'text-[#991b1b]'
                                : 'text-[#854d0e]'
                            }
                          >
                            {formatCurrency(student.outstandingBalance)}
                          </span>
                        ) : (
                          <span className="text-[#166534]">Rs. 0.00</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={
                            student.feeStatus === 'Paid'
                              ? 'badge-paid'
                              : student.feeStatus === 'Pending'
                              ? 'badge-pending'
                              : 'badge-overdue'
                          }
                        >
                          {student.feeStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/students/${student.id}`}
                            className="p-1 text-[#334155] hover:text-[#1e3a5f] rounded hover:bg-[#f1f5f9]"
                            title="View student profile"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/fee-collection?studentId=${student.id}`}
                            className="p-1 text-[#334155] hover:text-[#166534] rounded hover:bg-[#f0fdf4]"
                            title="Record fee payment"
                          >
                            <Wallet className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-t border-[#e2e8f0] gap-3 text-[12px] text-[#334155]">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded border border-[#e2e8f0] bg-white px-2 py-1 text-[12px] text-[#0f172a]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>of {sortedStudents.length} students</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded border border-[#e2e8f0] bg-white text-[#334155] hover:bg-[#f8f9fb] disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded border border-[#e2e8f0] bg-white text-[#334155] hover:bg-[#f8f9fb] disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Student Modal Dialog */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3 mb-4">
              <div>
                <h2 className="text-[16px] font-bold text-[#0f172a]">Enroll New Student</h2>
                <p className="text-[12px] text-[#334155]">Create a student account and configure initial fee heads</p>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-[#334155] hover:text-[#0f172a] rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Personal details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">
                    Student Full Name <span className="text-[#991b1b]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daniyal Qureshi"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-md border border-[#e2e8f0] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">
                    Father&apos;s / Guardian Name <span className="text-[#991b1b]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zahid Qureshi"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full rounded-md border border-[#e2e8f0] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:outline-none"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">
                    Guardian WhatsApp Number <span className="text-[#991b1b]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+92 300 1234567"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    className="w-full rounded-md border border-[#e2e8f0] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">
                    Student Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+92 301 7654321"
                    value={formData.studentPhone}
                    onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
                    className="w-full rounded-md border border-[#e2e8f0] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:outline-none"
                  />
                </div>
              </div>

              {/* Class, Section, Roll, Admission No */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">
                    Class <span className="text-[#991b1b]">*</span>
                  </label>
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full rounded-md border border-[#e2e8f0] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:outline-none"
                  >
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">
                    Section <span className="text-[#991b1b]">*</span>
                  </label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full rounded-md border border-[#e2e8f0] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:outline-none"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">
                    Roll Number <span className="text-[#991b1b]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 11A-188"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full rounded-md border border-[#e2e8f0] px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#0f172a] mb-1">
                    Admission No
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.admissionNumber}
                    className="w-full rounded-md border border-[#e2e8f0] bg-[#f1f5f9] px-3 py-1.5 text-[13px] text-[#334155]"
                  />
                </div>
              </div>

              {/* Financial setup */}
              <div className="p-3.5 rounded-lg border border-[#e2e8f0] bg-[#f8f9fb] space-y-3">
                <span className="text-[12px] font-semibold text-[#0f172a] block">
                  Fee Configuration
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#334155] mb-1">
                      Monthly Tuition Fee (Rs.)
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyTuition}
                      onChange={(e) => setFormData({ ...formData, monthlyTuition: Number(e.target.value) })}
                      className="w-full rounded-md border border-[#e2e8f0] bg-white px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#334155] mb-1">
                      Initial Admission & Annual Charges (Rs.)
                    </label>
                    <input
                      type="number"
                      value={formData.initialAnnualCharges}
                      onChange={(e) => setFormData({ ...formData, initialAnnualCharges: Number(e.target.value) })}
                      className="w-full rounded-md border border-[#e2e8f0] bg-white px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#1e3a5f] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Custom Annual Charge Toggle */}
                <div className="pt-2 border-t border-[#e2e8f0]">
                  <label className="flex items-center gap-2 cursor-pointer text-[12px] font-medium text-[#0f172a]">
                    <input
                      type="checkbox"
                      checked={formData.includeCustomCharge}
                      onChange={(e) => setFormData({ ...formData, includeCustomCharge: e.target.checked })}
                      className="rounded border-[#cbd5e1] text-[#1e3a5f] focus:ring-0"
                    />
                    <span>Add Custom Annual Charge (Special Fund)</span>
                  </label>

                  {formData.includeCustomCharge && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white rounded border border-[#e2e8f0]">
                      <div>
                        <label className="block text-[11px] font-medium text-[#334155] mb-1">Charge Title</label>
                        <input
                          type="text"
                          value={formData.customChargeTitle}
                          onChange={(e) => setFormData({ ...formData, customChargeTitle: e.target.value })}
                          className="w-full rounded border border-[#e2e8f0] px-2 py-1 text-[12px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#334155] mb-1">Amount (Rs.)</label>
                        <input
                          type="number"
                          value={formData.customChargeAmount}
                          onChange={(e) => setFormData({ ...formData, customChargeAmount: Number(e.target.value) })}
                          className="w-full rounded border border-[#e2e8f0] px-2 py-1 text-[12px]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-[#334155] mb-1">Reason for Special Charge</label>
                        <input
                          type="text"
                          value={formData.customChargeReason}
                          onChange={(e) => setFormData({ ...formData, customChargeReason: e.target.value })}
                          className="w-full rounded border border-[#e2e8f0] px-2 py-1 text-[12px]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dialog buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-md border border-[#e2e8f0] px-4 py-1.5 text-[12px] font-medium text-[#334155] hover:bg-[#f8f9fb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[#1e3a5f] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#142842]"
                >
                  Save & Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
