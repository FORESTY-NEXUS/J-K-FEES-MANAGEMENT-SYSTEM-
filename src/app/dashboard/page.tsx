'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wallet,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  Users,
  Clock,
  Plus,
  Send,
  ChevronRight,
  TrendingUp,
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
} from 'recharts';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useGsapEntrance } from '@/hooks/useGsap';

// Darker, desaturated, high-contrast palette
const C = {
  primary: '#0f172a',    // Slate 900
  secondary: '#334155',  // Slate 700
  muted: '#64748b',      // Slate 500
  border: '#e2e8f0',     // Slate 200
  raised: '#f1f5f9',     // Slate 100
  bg: '#f8f9fb',
  surface: '#ffffff',
  // semantic (darker, desaturated, strong contrast)
  positive: '#166534',   // Dark forest green
  positiveBg: '#f0fdf4',
  warning: '#854d0e',    // Dark bronze amber
  warningBg: '#fefce8',
  danger: '#991b1b',     // Dark desaturated crimson
  dangerBg: '#fef2f2',
};

// Darker desaturated slate-navy accent
const ACCENT = '#1e3a5f';

export default function DashboardPage() {
  const { payments, auditLogs } = useFeeApp();
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'session'>('session');
  // Unslop pass 9: entrance — one stagger on the main content
  const containerRef = useGsapEntrance('.gsap-fade-in', 0.05, 0.0);

  // ── KPI mock data (client-specified exact figures) ─────────────────────────
  const kpis = {
    totalInvoiced: 4285000,
    totalCollected: 3420000,
    outstandingBalance: 865000,
    overdueBalance: 375000,
    totalStudents: 1250,
    fullyPaidStudents: 860,
    pendingStudents: 240,
    overdueStudents: 150,
  };

  const collectionRate = ((kpis.totalCollected / kpis.totalInvoiced) * 100).toFixed(1);

  // ── Chart data ──────────────────────────────────────────────────────────────
  // Chart A: Monthly collection trend — line chart (trend = line, unslop rule)
  const monthlyData = [
    { month: 'Jun', invoiced: 680000, collected: 620000 },
    { month: 'Jul', invoiced: 710000, collected: 660000 },
    { month: 'Aug', invoiced: 725000, collected: 675000 },
    { month: 'Sep', invoiced: 740000, collected: 690000 },
    { month: 'Oct', invoiced: 710000, collected: 650000 },
    { month: 'Nov', invoiced: 720000, collected: 525000 },
  ];

  // Chart B: Collection by class — bars (comparison = bars ✓)
  const classData = [
    { class: '9th', invoiced: 980000, collected: 810000 },
    { class: '10th', invoiced: 1040000, collected: 855000 },
    { class: '11th', invoiced: 1165000, collected: 925000 },
    { class: '12th', invoiced: 1100000, collected: 830000 },
  ];

  // Chart C: Payment method — one stacked bar / pie
  const methodData = [
    { name: 'Cash', value: 1650000 },
    { name: 'Bank transfer', value: 1220000 },
    { name: 'Online', value: 410000 },
    { name: 'Cheque', value: 140000 },
  ];
  // Unslop: one accent + neutral steps, not rainbow
  const METHOD_COLORS = [ACCENT, '#374151', '#6b7280', '#d1d5db'];

  const recentPayments = payments.slice(0, 6);
  const recentActivity = auditLogs.slice(0, 7);

  // Shared tooltip style
  const tooltipStyle = {
    backgroundColor: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: '8px',
    fontSize: '12px',
    color: C.primary,
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  };

  return (
    <div ref={containerRef} className="space-y-6">

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="gsap-fade-in flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-left">
        <div className="text-left">
          <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-[#0f172a]">
            Financial overview
          </h1>
          <p className="mt-0.5 text-[13px] text-[#64748b]">
            Jammu Kashmir College · Academic session {dateRange === 'today' ? 'today' : dateRange === 'week' ? 'this week' : dateRange === 'month' ? 'this month' : '2026–27'}
          </p>
        </div>

        {/* Date range selector — squircle pill */}
        <div className="flex items-center squircle-btn border border-[#e2e8f0] bg-white p-0.5 text-[12px] font-medium">
          {(['today', 'week', 'month', 'session'] as const).map((id) => (
            <button
              key={id}
              onClick={() => setDateRange(id)}
              className={`squircle-badge px-3 py-1.5 transition-colors duration-150 ${
                dateRange === id
                  ? 'bg-[#1e3a5f] text-white font-medium'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              {id === 'today' ? 'Today' : id === 'week' ? 'Week' : id === 'month' ? 'Month' : 'Session'}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI stat cards ─────────────────────────────────────────────────── */}
      <div className="gsap-fade-in grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        {/* Total Invoiced */}
        <div className="squircle-card p-5">
          <div className="text-[12px] font-medium text-[#64748b]">Total invoiced</div>
          <div className="mt-2 text-[28px] font-semibold tabular-nums tracking-[-0.02em] text-[#0f172a]">
            {formatCurrency(kpis.totalInvoiced)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-[#64748b]">
            <ArrowUpRight className="h-3 w-3 text-[#166534]" strokeWidth={2} />
            <span className="text-[#166534] font-medium">+8.4%</span>
            <span>vs last cycle</span>
          </div>
        </div>

        {/* Total Collected */}
        <div className="squircle-card p-5">
          <div className="text-[12px] font-medium text-[#64748b]">Collected</div>
          <div className="mt-2 text-[28px] font-semibold tabular-nums tracking-[-0.02em] text-[#0f172a]">
            {formatCurrency(kpis.totalCollected)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px]">
            <span className="text-[13px] font-semibold tabular-nums text-[#1e3a5f]">{collectionRate}%</span>
            <span className="text-[#64748b]">collection rate</span>
          </div>
        </div>

        {/* Outstanding */}
        <div className="squircle-card p-5">
          <div className="text-[12px] font-medium text-[#64748b]">Outstanding</div>
          <div className="mt-2 text-[28px] font-semibold tabular-nums tracking-[-0.02em] text-[#854d0e]">
            {formatCurrency(kpis.outstandingBalance)}
          </div>
          <div className="mt-2 text-[11px] text-[#64748b]">
            <span className="text-[#334155] font-medium tabular-nums">240</span> students within grace period
          </div>
        </div>

        {/* Overdue */}
        <div className="squircle-card p-5">
          <div className="text-[12px] font-medium text-[#64748b]">Overdue</div>
          <div className="mt-2 text-[28px] font-semibold tabular-nums tracking-[-0.02em] text-[#991b1b]">
            {formatCurrency(kpis.overdueBalance)}
          </div>
          <div className="mt-2 text-[11px] text-[#64748b]">
            <span className="text-[#991b1b] font-medium tabular-nums">150</span> accounts past due date
          </div>
        </div>
      </div>

      {/* ── Student reconciliation strip ────────────────────────────────────── */}
     

      {/* ── Charts: main trend (2/3 wide) + class comparison (1/3) ─────────── */}
      <div className="gsap-fade-in grid grid-cols-1 lg:grid-cols-3 gap-5 text-left">

        {/* Chart A: Monthly collection trend — LINE chart */}
        <div className="lg:col-span-2 squircle-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[14px] font-semibold text-[#0f172a]">Monthly collection trend</div>
              <div className="text-[12px] text-[#64748b] mt-0.5">Jun–Nov 2026 · invoiced vs collected</div>
            </div>
            <Link href="/analytics" className="text-[12px] font-medium text-[#334155] hover:text-[#0f172a] flex items-center gap-0.5 transition-colors">
              Analytics <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  formatter={(v: unknown) => [formatCurrency(Number(v)), '']}
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: C.primary }}
                />
                <Line
                  dataKey="invoiced"
                  name="Invoiced"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 3, fill: '#94a3b8' }}
                />
                <Line
                  dataKey="collected"
                  name="Collected"
                  stroke={ACCENT}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: ACCENT }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="mt-3 flex items-center gap-4 text-[11px] text-[#64748b]">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-[2px] w-5 bg-[#94a3b8] rounded-full" />
              Invoiced
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-[2px] w-5 rounded-full" style={{ backgroundColor: ACCENT }} />
              Collected
            </div>
          </div>
        </div>

        {/* Chart B: Collection by class — compact bars */}
        <div className="squircle-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[14px] font-semibold text-[#0f172a]">By class</div>
              <div className="text-[12px] text-[#64748b] mt-0.5">Collected vs invoiced</div>
            </div>
            <Link href="/reports" className="text-[12px] font-medium text-[#334155] hover:text-[#0f172a] flex items-center gap-0.5 transition-colors">
              Reports <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="2 4" horizontal={false} stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <YAxis
                  type="category"
                  dataKey="class"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  formatter={(v: unknown) => [formatCurrency(Number(v)), '']}
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="invoiced" name="Invoiced" fill="#cbd5e1" radius={[0, 3, 3, 0]} barSize={8} />
                <Bar dataKey="collected" name="Collected" fill={ACCENT} radius={[0, 3, 3, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Payment methods + fee status row ───────────────────────────────── */}
      <div className="gsap-fade-in grid grid-cols-1 md:grid-cols-2 gap-5 text-left">

        {/* Payment method: donut */}
        <div className="squircle-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[14px] font-semibold text-[#0f172a]">Payment methods</div>
              <div className="text-[12px] text-[#64748b] mt-0.5">Share of total collected</div>
            </div>
            <Link href="/payments" className="text-[12px] font-medium text-[#334155] hover:text-[#0f172a] flex items-center gap-0.5 transition-colors">
              Payments <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={methodData} innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                    {methodData.map((_, i) => (
                      <Cell key={i} fill={METHOD_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), '']} contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {methodData.map((m, i) => {
                const pct = ((m.value / kpis.totalCollected) * 100).toFixed(0);
                return (
                  <div key={m.name} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: METHOD_COLORS[i] }} />
                      <span className="text-[#334155] font-medium">{m.name}</span>
                    </div>
                    <span className="tabular-nums font-semibold text-[#0f172a]">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="squircle-card p-5">
          <div className="text-[14px] font-semibold text-[#0f172a] mb-4">Quick actions</div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { href: '/fee-collection', icon: Wallet, label: 'Collect fee', sub: 'Record a payment' },
              { href: '/invoices', icon: FileText, label: 'Generate invoices', sub: 'Bulk billing' },
              { href: '/notifications', icon: Send, label: 'Send reminders', sub: 'WhatsApp alerts' },
              { href: '/students', icon: Plus, label: 'Enroll student', sub: 'Add account' },
            ].map(({ href, icon: Icon, label, sub }) => (
              <Link
                key={href}
                href={href}
                className="flex items-start gap-3 squircle-btn border border-[#e2e8f0] bg-[#f8f9fb] p-3 hover:bg-white hover:border-[#cbd5e1] transition-colors duration-150 group"
              >
                <Icon className="h-4 w-4 mt-0.5 text-[#64748b] group-hover:text-[#0f172a] transition-colors shrink-0" strokeWidth={1.5} />
                <div>
                  <div className="text-[12px] font-semibold text-[#0f172a]">{label}</div>
                  <div className="text-[11px] text-[#64748b]">{sub}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Overdue alert */}
          <div className="mt-3.5 flex items-start gap-2.5 squircle-btn border border-[#fecaca] bg-[#fef2f2] px-3.5 py-2.5">
            <AlertTriangle className="h-4 w-4 mt-0.5 text-[#991b1b] shrink-0" strokeWidth={1.5} />
            <div className="text-[12px]">
              <span className="font-semibold text-[#991b1b]">150 overdue accounts</span>
              <span className="text-[#64748b] ml-1">— follow-up required</span>
              <span className="tabular-nums font-bold text-[#991b1b] ml-1.5">{formatCurrency(375000)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent transactions + activity ─────────────────────────────────── */}
      <div className="gsap-fade-in grid grid-cols-1 lg:grid-cols-3 gap-5 text-left">

        {/* Transactions table — 2 col span */}
        <div className="lg:col-span-2 squircle-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[14px] font-semibold text-[#0f172a]">Recent receipts</div>
              <div className="text-[12px] text-[#64748b] mt-0.5">Latest collected fee settlements</div>
            </div>
            <Link href="/payments" className="text-[12px] font-medium text-[#334155] hover:text-[#0f172a] flex items-center gap-0.5 transition-colors">
              All payments <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-[11px] font-semibold text-[#64748b]">
                  <th className="pb-2.5">Receipt</th>
                  <th className="pb-2.5">Student</th>
                  <th className="pb-2.5">Class</th>
                  <th className="pb-2.5 hidden md:table-cell">Method</th>
                  <th className="pb-2.5 hidden sm:table-cell">Date</th>
                  <th className="pb-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {recentPayments.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#f8f9fb] transition-colors duration-100">
                    <td className="py-2.5 font-mono text-[11px] font-medium text-[#1e3a5f]">{tx.receiptNumber}</td>
                    <td className="py-2.5 text-[13px] font-medium text-[#0f172a]">{tx.studentName}</td>
                    <td className="py-2.5 text-[12px] text-[#334155]">{tx.class}-{tx.section}</td>
                    <td className="py-2.5 text-[12px] text-[#334155] hidden md:table-cell">{tx.paymentMethod}</td>
                    <td className="py-2.5 text-[12px] text-[#64748b] font-mono hidden sm:table-cell">{formatDate(tx.paymentDate)}</td>
                    <td className="py-2.5 text-right tabular-nums text-[13px] font-semibold text-[#166534]">
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity feed — 1 col */}
        <div className="squircle-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[14px] font-semibold text-[#0f172a]">Recent activity</div>
            <Link href="/audit-logs" className="text-[12px] font-medium text-[#334155] hover:text-[#0f172a] flex items-center gap-0.5 transition-colors">
              All logs <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivity.map((act) => (
              <div key={act.id} className="flex items-start gap-2.5 text-[12px]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1e3a5f]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-[#0f172a] truncate">{act.action}</span>
                    <span className="text-[10px] text-[#64748b] font-mono shrink-0">{act.timestamp.slice(11, 16)}</span>
                  </div>
                  <p className="text-[11px] text-[#334155] mt-0.5 line-clamp-1">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
