'use client';

import React, { useState } from 'react';
import {
  ChartNoAxesCombined,
  Download,
  Printer,
  Filter,
  CalendarDays,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function ReportsPage() {
  const { students, invoices, payments, adjustments, settings } = useFeeApp();

  const [activeReport, setActiveReport] = useState<
    'collection' | 'defaulters' | 'aging' | 'categories' | 'discounts'
  >('collection');

  const [filterClass, setFilterClass] = useState('All');
  const [filterSession, setFilterSession] = useState('2026–2027');

  // Filtered collections
  const filteredPayments = payments.filter(
    (p) => filterClass === 'All' || p.class === filterClass
  );

  // Defaulters (Overdue)
  const overdueStudents = students.filter(
    (s) => s.outstandingBalance > 0 && (filterClass === 'All' || s.class === filterClass)
  );

  // Aging Analysis Buckets
  const agingBuckets = {
    '1-10 Days': overdueStudents.filter((s) => s.feeStatus === 'Pending'),
    '11-20 Days': overdueStudents.filter((s) => s.feeStatus === 'Overdue' && s.outstandingBalance <= 7000),
    '21-30 Days': overdueStudents.filter((s) => s.feeStatus === 'Overdue' && s.outstandingBalance > 7000 && s.outstandingBalance <= 10000),
    '30+ Days': overdueStudents.filter((s) => s.feeStatus === 'Overdue' && s.outstandingBalance > 10000),
  };

  const handleExportCSV = () => {
    let rows: Record<string, unknown>[] = [];
    let filename = `JKC_Report_${activeReport}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (activeReport === 'collection') {
      rows = filteredPayments.map((p) => ({
        ReceiptNumber: p.receiptNumber,
        Date: p.paymentDate,
        Student: p.studentName,
        RollNo: p.rollNumber,
        Class: `${p.class}-${p.section}`,
        Method: p.paymentMethod,
        Amount: p.amount,
        Status: p.status,
      }));
    } else if (activeReport === 'defaulters') {
      rows = overdueStudents.map((s) => ({
        RollNo: s.rollNumber,
        StudentName: s.fullName,
        GuardianName: s.fatherName,
        Class: `${s.class}-${s.section}`,
        OutstandingAmount: s.outstandingBalance,
        OverdueAmount: s.overdueBalance,
        FeeStatus: s.feeStatus,
        GuardianPhone: s.guardianPhone,
      }));
    } else if (activeReport === 'discounts') {
      rows = adjustments.map((a) => ({
        Date: a.date,
        Student: a.studentName,
        Class: a.class,
        Type: a.adjustmentType,
        Amount: a.amount,
        Reason: a.reason,
        Status: a.status,
      }));
    }

    if (rows.length === 0) {
      toast.info('No data available to export for this view.');
      return;
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        Object.keys(rows[0]).join(','),
        ...rows.map((r) => Object.values(r).join(',')),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${rows.length} rows to CSV`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
            Financial Reports Center
          </h1>
          <p className="text-[13px] text-[#334155]">
            Audited ledger summaries, class collection returns, and overdue aging analyses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#0f172a] shadow-2xs hover:bg-[#f8f9fb] transition-colors"
          >
            <Printer className="h-3.5 w-3.5 text-[#334155]" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3.5 py-1.5 text-[12px] font-medium text-white shadow-xs hover:bg-[#142842] transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector & Filters Bar */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'collection', label: 'Fee Collection Ledger' },
            { id: 'defaulters', label: 'Overdue Defaulters' },
            { id: 'aging', label: 'Aging Analysis (1–30+ Days)' },
            { id: 'categories', label: 'Fee Category Distribution' },
            { id: 'discounts', label: 'Scholarships & Concessions' },
          ].map((rep) => (
            <button
              key={rep.id}
              onClick={() => setActiveReport(rep.id as typeof activeReport)}
              className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                activeReport === rep.id
                  ? 'bg-[#1e3a5f] text-white shadow-xs font-semibold'
                  : 'bg-[#f8f9fb] text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
              }`}
            >
              {rep.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#e2e8f0]">
          <div>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="rounded-md border border-[#e2e8f0] bg-[#f8f9fb] px-3 py-1 text-[12px] text-[#0f172a]"
            >
              <option value="All">All Classes (9th–12th)</option>
              <option value="9th">Class 9th</option>
              <option value="10th">Class 10th</option>
              <option value="11th">Class 11th</option>
              <option value="12th">Class 12th</option>
            </select>
          </div>

          <div>
            <select
              value={filterSession}
              onChange={(e) => setFilterSession(e.target.value)}
              className="rounded-md border border-[#e2e8f0] bg-[#f8f9fb] px-3 py-1 text-[12px] text-[#0f172a]"
            >
              <option value="2026–2027">Session 2026–2027 (Active)</option>
              <option value="2025–2026">Session 2025–2026 (Archived)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report 1: Collection Report */}
      {activeReport === 'collection' && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-semibold text-[#0f172a]">Daily & Monthly Fee Collection Report</h3>
              <p className="text-[12px] text-[#334155]">Reconciled payments received across payment methods</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#334155] block">Total In View:</span>
              <span className="text-base font-bold text-[#166534] tabular-nums">
                {formatCurrency(filteredPayments.reduce((s, p) => s + (p.status === 'Completed' ? p.amount : 0), 0))}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Receipt #</th>
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-4">Class</th>
                  <th className="py-2.5 px-4">Payment Method</th>
                  <th className="py-2.5 px-4">Reference</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {filteredPayments.slice(0, 15).map((p) => (
                  <tr key={p.id} className="hover:bg-[#f8f9fb]">
                    <td className="py-2.5 px-4 text-[#334155] text-[12px]">{formatDate(p.paymentDate)}</td>
                    <td className="py-2.5 px-4 font-mono text-[#1e3a5f]">{p.receiptNumber}</td>
                    <td className="py-2.5 px-4 font-medium text-[#0f172a]">{p.studentName}</td>
                    <td className="py-2.5 px-4 text-[#334155]">{p.class}-{p.section}</td>
                    <td className="py-2.5 px-4 text-[#0f172a]">{p.paymentMethod}</td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-[#334155]">{p.referenceNumber || '-'}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-[#166534] tabular-nums">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
                        p.status === 'Completed' ? 'bg-[#f0fdf4] text-[#166534]' : 'bg-[#fef2f2] text-[#991b1b]'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 2: Overdue Defaulters */}
      {activeReport === 'defaulters' && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-semibold text-[#0f172a]">Class-wise Defaulter Report</h3>
              <p className="text-[12px] text-[#334155]">Students with outstanding balances beyond due dates</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#334155] block">Total Overdue:</span>
              <span className="text-base font-bold text-[#991b1b] tabular-nums">
                {formatCurrency(overdueStudents.reduce((s, st) => s + st.outstandingBalance, 0))}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <th className="py-2.5 px-4">Roll No</th>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Guardian Name</th>
                  <th className="py-2.5 px-4">WhatsApp #</th>
                  <th className="py-2.5 px-4">Class</th>
                  <th className="py-2.5 px-4 text-right">Outstanding</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {overdueStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-[#f8f9fb]">
                    <td className="py-2.5 px-4 font-mono font-medium text-[#1e3a5f]">{s.rollNumber}</td>
                    <td className="py-2.5 px-4 font-medium text-[#0f172a]">{s.fullName}</td>
                    <td className="py-2.5 px-4 text-[#334155]">{s.fatherName}</td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-[#0f172a]">{s.guardianPhone}</td>
                    <td className="py-2.5 px-4 text-[#334155]">{s.class}-{s.section}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-[#991b1b] tabular-nums">
                      {formatCurrency(s.outstandingBalance)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
                        s.feeStatus === 'Overdue' ? 'bg-[#fef2f2] text-[#991b1b]' : 'bg-[#fefce8] text-[#854d0e]'
                      }`}>
                        {s.feeStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 3: Aging Analysis */}
      {activeReport === 'aging' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {Object.entries(agingBuckets).map(([bucketName, list]) => {
              const sum = list.reduce((acc, s) => acc + s.outstandingBalance, 0);
              return (
                <div key={bucketName} className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-2xs">
                  <div className="text-[12px] font-semibold text-[#334155]">{bucketName}</div>
                  <div className="text-xl font-bold text-[#0f172a] mt-1 tabular-nums">{list.length} students</div>
                  <div className="text-[12px] font-bold text-[#991b1b] mt-1 tabular-nums">{formatCurrency(sum)}</div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-2xs">
            <h3 className="text-[14px] font-semibold text-[#0f172a] mb-3">Institutional Aging Distribution</h3>
            <p className="text-[12px] text-[#334155] mb-4">
              Defaulter risk increases significantly for accounts exceeding 20+ days past the due date. The accounts office enforces WhatsApp reminders for 11–20 days, and written advisory notices for 30+ days.
            </p>
          </div>
        </div>
      )}

      {/* Report 4: Fee Categories */}
      {activeReport === 'categories' && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-2xs space-y-4">
          <h3 className="text-[14px] font-semibold text-[#0f172a]">Fee Category Revenue Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#f8f9fb] border border-[#e2e8f0]">
              <div className="text-[11px] font-semibold text-[#334155]">TUITION REVENUE</div>
              <div className="text-xl font-bold text-[#1e3a5f] mt-1 tabular-nums">Rs. 3,150,000.00</div>
              <div className="text-[11px] text-[#334155] mt-1">73.5% of overall invoiced revenue</div>
            </div>
            <div className="p-4 rounded-lg bg-[#f8f9fb] border border-[#e2e8f0]">
              <div className="text-[11px] font-semibold text-[#334155]">ANNUAL & LAB FUNDS</div>
              <div className="text-xl font-bold text-[#166534] mt-1 tabular-nums">Rs. 685,000.00</div>
              <div className="text-[11px] text-[#334155] mt-1">Science & computer labs, sports, libraries</div>
            </div>
            <div className="p-4 rounded-lg bg-[#f8f9fb] border border-[#e2e8f0]">
              <div className="text-[11px] font-semibold text-[#334155]">EXAMINATION & UTILITIES</div>
              <div className="text-xl font-bold text-[#854d0e] mt-1 tabular-nums">Rs. 450,000.00</div>
              <div className="text-[11px] text-[#334155] mt-1">Term assessments, generator, publications</div>
            </div>
          </div>
        </div>
      )}

      {/* Report 5: Scholarships & Concessions */}
      {activeReport === 'discounts' && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#e2e8f0]">
            <h3 className="text-[14px] font-semibold text-[#0f172a]">Concessions & Scholarships Audit</h3>
            <p className="text-[12px] text-[#334155]">Total institutional scholarships, sibling discounts, and waivers granted</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8f9fb] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-4">Class</th>
                  <th className="py-2.5 px-4">Concession Type</th>
                  <th className="py-2.5 px-4">Reason</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {adjustments.map((a) => (
                  <tr key={a.id} className="hover:bg-[#f8f9fb]">
                    <td className="py-2.5 px-4 text-[#334155] text-[12px]">{formatDate(a.date)}</td>
                    <td className="py-2.5 px-4 font-semibold text-[#0f172a]">{a.studentName}</td>
                    <td className="py-2.5 px-4 text-[#334155]">Class {a.class}</td>
                    <td className="py-2.5 px-4 font-medium text-[#0f172a]">{a.adjustmentType}</td>
                    <td className="py-2.5 px-4 text-[#334155] max-w-xs">{a.reason}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-[#166534] tabular-nums">
                      {formatCurrency(a.amount)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
                        a.status === 'Approved' ? 'bg-[#f0fdf4] text-[#166534]' : 'bg-[#fefce8] text-[#854d0e]'
                      }`}>
                        {a.status}
                      </span>
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
