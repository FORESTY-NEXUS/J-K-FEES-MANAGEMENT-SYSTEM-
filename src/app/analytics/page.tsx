'use client';

import React from 'react';
import {
  TrendingUp,
  ChartNoAxesCombined,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Receipt,
  Wallet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { formatCurrency } from '@/lib/utils';

export default function AnalyticsPage() {
  const { students, payments, invoices } = useFeeApp();

  // Summary Metrics
  const totalInvoiced = 4285000;
  const totalCollected = 3420000;
  const outstanding = 865000;
  const collectionRate = ((totalCollected / totalInvoiced) * 100).toFixed(1);
  const outstandingPct = ((outstanding / totalInvoiced) * 100).toFixed(1);
  const totalConcessions = 8900;
  const totalRefunds = 5300;
  const avgPayment = 3480;

  // Recharts Chart Data
  const monthlyComparisonData = [
    { month: 'Jun 2026', invoiced: 680000, collected: 620000 },
    { month: 'Jul 2026', invoiced: 710000, collected: 660000 },
    { month: 'Aug 2026', invoiced: 725000, collected: 675000 },
    { month: 'Sep 2026', invoiced: 740000, collected: 690000 },
    { month: 'Oct 2026', invoiced: 710000, collected: 650000 },
    { month: 'Nov 2026', invoiced: 720000, collected: 525000 },
  ];

  const outstandingTrendData = [
    { month: 'Jun', balance: 410000 },
    { month: 'Jul', balance: 460000 },
    { month: 'Aug', balance: 510000 },
    { month: 'Sep', balance: 560000 },
    { month: 'Oct', balance: 620000 },
    { month: 'Nov', balance: 865000 },
  ];

  const classRateData = [
    { class: '9th Matric', rate: 82.6 },
    { class: '10th Matric', rate: 82.2 },
    { class: '11th F.Sc', rate: 79.4 },
    { class: '12th F.Sc', rate: 75.5 },
  ];

  const methodData = [
    { name: 'Cash Counter', value: 1650000, color: '#1e3a5f' },
    { name: 'Allied Bank Transfer', value: 1220000, color: '#166534' },
    { name: 'Online / Easypaisa', value: 410000, color: '#854d0e' },
    { name: 'Cheque Clearance', value: 140000, color: '#64748B' },
  ];

  const categoryData = [
    { category: 'Tuition Fee', amount: 3150000 },
    { category: 'Annual Fund', amount: 320000 },
    { category: 'Laboratory Fund', amount: 245000 },
    { category: 'Examination', amount: 210000 },
    { category: 'Sports & Library', amount: 195000 },
    { category: 'Utilities & Late', amount: 165000 },
  ];

  const agingData = [
    { bucket: '1–10 Days', students: 240, amount: 840000, color: '#854d0e' },
    { bucket: '11–20 Days', students: 85, amount: 210000, color: '#991b1b' },
    { bucket: '21–30 Days', students: 45, amount: 110000, color: '#9E2A2B' },
    { bucket: '30+ Days', students: 20, amount: 55000, color: '#540B0E' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
          Collection Analytics & Insights
        </h1>
        <p className="text-[13px] text-[#334155]">
          Institutional financial performance metrics, collection velocities, and revenue reconciliation.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-[#334155]">Collection Rate</span>
          <div className="text-xl font-bold text-[#166534] mt-1 tabular-nums">{collectionRate}%</div>
          <span className="text-[10px] text-[#166534]">Optimal target achieved</span>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-[#334155]">Outstanding Ratio</span>
          <div className="text-xl font-bold text-[#854d0e] mt-1 tabular-nums">{outstandingPct}%</div>
          <span className="text-[10px] text-[#334155]">Pending collection</span>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-[#334155]">Total Concessions</span>
          <div className="text-xl font-bold text-[#1e3a5f] mt-1 tabular-nums">{formatCurrency(totalConcessions)}</div>
          <span className="text-[10px] text-[#334155]">Approved waivers</span>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-[#334155]">Total Refunds</span>
          <div className="text-xl font-bold text-[#991b1b] mt-1 tabular-nums">{formatCurrency(totalRefunds)}</div>
          <span className="text-[10px] text-[#334155]">Audited returns</span>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-[#334155]">Average Receipt</span>
          <div className="text-xl font-bold text-[#0f172a] mt-1 tabular-nums">{formatCurrency(avgPayment)}</div>
          <span className="text-[10px] text-[#334155]">Per transaction</span>
        </div>
      </div>

      {/* Charts Grid: 2 rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Invoiced vs Collected */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-2xs">
          <div className="mb-4">
            <h3 className="text-[14px] font-semibold text-[#0f172a]">Monthly Invoiced vs Collected</h3>
            <p className="text-[12px] text-[#334155]">6-month collection trajectory (June - November 2026)</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} tickFormatter={(val) => `Rs.${val/1000}k`} />
                <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), '']} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="invoiced" name="Invoiced" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="Collected" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Outstanding Balance Trend */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-2xs">
          <div className="mb-4">
            <h3 className="text-[14px] font-semibold text-[#0f172a]">Outstanding Balance Trend</h3>
            <p className="text-[12px] text-[#334155]">Uncollected arrears progression across academic cycle</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outstandingTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} tickFormatter={(val) => `Rs.${val/1000}k`} />
                <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), 'Outstanding']} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="balance" stroke="#854d0e" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Class-wise Collection Percentage */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-2xs">
          <div className="mb-4">
            <h3 className="text-[14px] font-semibold text-[#0f172a]">Class-wise Recovery Compliance %</h3>
            <p className="text-[12px] text-[#334155]">Collection rate per academic department</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classRateData} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#334155' }} unit="%" />
                <YAxis dataKey="class" type="category" tick={{ fontSize: 11, fill: '#0f172a' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: unknown) => [`${v}%`, 'Collection Rate']} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Bar dataKey="rate" fill="#166534" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Overdue Aging Distribution */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-2xs">
          <div className="mb-4">
            <h3 className="text-[14px] font-semibold text-[#0f172a]">Defaulter Aging Buckets</h3>
            <p className="text-[12px] text-[#334155]">Arrears classified by days overdue</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} tickFormatter={(val) => `Rs.${val/1000}k`} />
                <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), 'Arrears']} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {agingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
