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
  ArrowUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useGsapEntrance } from '@/hooks/useGsap';

// Theme palette matching your green & slate design system
const C = {
  primary: '#0f172a',
  secondary: '#334155',
  muted: '#64748b',
  border: '#e2e8f0',
  raised: '#f1f5f9',
  bg: '#f8f9fb',
  surface: '#ffffff',
  positive: '#166534',
  positiveBg: '#f0fdf4',
  warning: '#854d0e',
  warningBg: '#fefce8',
  danger: '#991b1b',
  dangerBg: '#fef2f2',
};

const ACCENT = '#166534'; // Forest green theme accent

export default function DashboardPage() {
  const { payments, auditLogs } = useFeeApp();
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year'>('year');
  const containerRef = useGsapEntrance('.gsap-fade-in', 0.05, 0.0);

  // ── KPI mock data (exact figures from layout) ──────────────────────────────
  const kpis = {
    totalInvoiced: 4285000,
    totalCollected: 3420000,
    outstandingBalance: 365000,
    overdueBalance: 375000,
    totalStudents: 1250,
    totalInvoicesCount: 2480,
  };

  // ── Chart data ──────────────────────────────────────────────────────────────
  const monthlyData = [
    { month: 'Jun', invoiced: 32000, collected: 30000 },
    { month: 'Jul', invoiced: 35000, collected: 33000 },
    { month: 'Aug', invoiced: 38000, collected: 36000 },
    { month: 'Sep', invoiced: 41000, collected: 39000 },
    { month: 'Oct', invoiced: 37000, collected: 34000 },
    { month: 'Nov', invoiced: 39000, collected: 31000 },
  ];

  const classData = [
    { class: '04', collected: 82000 },
    { class: '05', collected: 91000 },
    { class: '06', collected: 78000 },
    { class: '07', collected: 65000 },
  ];

  const methodData = [
    { name: 'Cash', value: 1650000 },
    { name: 'Bank Transfer', value: 1220000 },
    { name: 'Card', value: 410000 },
    { name: 'Cheque', value: 140000 },
  ];
  const METHOD_COLORS = [ACCENT, '#334155', '#64748b', '#cbd5e1'];

  const recentInvoices = payments.slice(0, 5);
  const recentActivity = auditLogs.slice(0, 5);

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

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="gsap-fade-in flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-left">
        <div className="text-left">
          <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-[#0f172a]">
            Financial Overview
          </h1>
          <p className="mt-0.5 text-[13px] text-[#64748b]">
            Jinnah Market Online · Academic Session 2026–27
          </p>
        </div>

        {/* Date range selector */}
        <div className="flex items-center squircle-btn border border-[#e2e8f0] bg-white p-0.5 text-[12px] font-medium">
          {(['today', 'week', 'month', 'year'] as const).map((id) => (
            <button
              key={id}
              onClick={() => setDateRange(id)}
              className={`squircle-badge px-3 py-1.5 transition-colors duration-150 capitalize ${
                dateRange === id
                  ? 'bg-[#0f172a] text-white font-medium'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              {id === 'year' ? 'Year' : id}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Stat Cards with Icon Badges & Sparklines ────────────────────── */}
      <div className="gsap-fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        {/* Total Revenue */}
        <div className="squircle-card p-4 !bg-black/90 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[#166534] shrink-0">
              <Wallet className="h-3.5 w-3.5" strokeWidth={2.5} />
            </div>
            <span className="text-[12px] font-medium text-[#fdfefe]">Total Revenue</span>
          </div>
          <div className="my-2">
            <div className="text-[22px] font-semibold tabular-nums tracking-[-0.02em] text-[#efeff0]">
              {formatCurrency(kpis.totalInvoiced)}
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 text-[#1ae768]">
              <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
              <span className="font-semibold">+12.5%</span>
              <span className="text-[#dfe1e3]">vs last year</span>
            </div>

           
          </div>
        </div>

        {/* Total Collections */}
        <div className="squircle-card p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[#166534] shrink-0">
              <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.5} />
            </div>
            <span className="text-[12px] font-medium text-[#64748b]">Total Collections</span>
          </div>
          <div className="my-2">
            <div className="text-[22px] font-semibold tabular-nums tracking-[-0.02em] text-[#0f172a]">
              {formatCurrency(kpis.totalCollected)}
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 text-[#166534]">
              <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
              <span className="font-semibold">+10.8%</span>
              <span className="text-[#64748b]">vs last year</span>
            </div>
            
          </div>
        </div>

        {/* Outstanding */}
        <div className="squircle-card p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-[#fefce8] flex items-center justify-center text-[#854d0e] shrink-0">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
            </div>
            <span className="text-[12px] font-medium text-[#64748b]">Outstanding</span>
          </div>
          <div className="my-2">
            <div className="text-[22px] font-semibold tabular-nums tracking-[-0.02em] text-[#0f172a]">
              {formatCurrency(kpis.outstandingBalance)}
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 text-[#854d0e]">
              <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
              <span className="font-semibold">+7.6%</span>
              <span className="text-[#64748b]">vs last year</span>
            </div>
            <div className="h-6 w-16">
            
            </div>
          </div>
        </div>

        {/* Overdue */}
        <div className="squircle-card p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-[#fef2f2] flex items-center justify-center text-[#991b1b] shrink-0">
              <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.5} />
            </div>
            <span className="text-[12px] font-medium text-[#64748b]">Overdue</span>
          </div>
          <div className="my-2">
            <div className="text-[22px] font-semibold tabular-nums tracking-[-0.02em] text-[#0f172a]">
              {formatCurrency(kpis.overdueBalance)}
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 text-[#991b1b]">
              <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
              <span className="font-semibold">+1.9%</span>
              <span className="text-[#64748b]">vs last year</span>
            </div>
            
          </div>
        </div>
      </div>

      {/* ── Charts Row: Monthly Trend (2/3) + By Class (1/3) ─────────────── */}
      <div className="gsap-fade-in grid grid-cols-1 lg:grid-cols-3 gap-5 text-left">
        {/* Monthly Collection Trend */}
        <div className="lg:col-span-2 squircle-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[14px] font-semibold text-[#0f172a]">Monthly Collection Trend</div>
              <div className="text-[12px] text-[#64748b] mt-0.5">June 2026 – November 2026 · Includes all collected data</div>
            </div>
            <div className="text-[12px] text-[#64748b] bg-[#f8f9fb] px-2.5 py-1 rounded-md border border-[#e2e8f0]">
              This Year
            </div>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ACCENT} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={ACCENT} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}K`} />
                <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v) * 1000), '']} contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="collected" name="Collected" stroke={ACCENT} strokeWidth={2} fillOpacity={1} fill="url(#colorCollected)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-6 text-[11px] text-[#64748b]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#166534]" />
              <span>Collected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#cbd5e1]" />
              <span>Target</span>
            </div>
          </div>
        </div>

        {/* By Class */}
        <div className="squircle-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[14px] font-semibold text-[#0f172a]">By Class</div>
              <div className="text-[12px] text-[#64748b] mt-0.5">Collection by class</div>
            </div>
            <Link href="/reports" className="text-[12px] font-medium text-[#334155] hover:text-[#0f172a] flex items-center gap-0.5">
              Reports <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="2 4" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}k`} />
                <YAxis type="category" dataKey="class" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v) * 1000), '']} contentStyle={tooltipStyle} />
                <Bar dataKey="collected" fill="#166534" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[11px] text-[#64748b] pt-2 border-t border-[#e2e8f0]">
            <span>0k</span>
            <span>50k</span>
            <span>100k</span>
          </div>
        </div>
      </div>

      {/* ── Middle Row: Payment Methods + Quick Actions + Stats ──────────── */}
      <div className="gsap-fade-in grid grid-cols-1 lg:grid-cols-3 gap-5 text-left">
        {/* Payment Methods */}
        <div className="squircle-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[14px] font-semibold text-[#0f172a]">Payment Methods</div>
              <div className="text-[12px] text-[#64748b] mt-0.5">Share of total collected</div>
            </div>
            <Link href="/payments" className="text-[12px] font-medium text-[#334155] hover:text-[#0f172a] flex items-center gap-0.5">
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-36 w-36 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={methodData} innerRadius={36} outerRadius={56} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                    {methodData.map((_, i) => (
                      <Cell key={i} fill={METHOD_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), '']} contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 text-[12px]">
              {methodData.map((m, i) => {
                const pct = ((m.value / kpis.totalCollected) * 100).toFixed(0);
                return (
                  <div key={m.name} className="flex items-center justify-between">
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

        {/* Quick Actions */}
        <div className="squircle-card p-5 ">
          <div className="text-[14px] font-semibold text-[#0f172a] mb-4">Quick Actions</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/reports', icon: FileText, label: 'Generate Report' },
              { href: '/fee-collection', icon: Wallet, label: 'Record Payment' },
              { href: '/invoices', icon: FileText, label: 'View Invoices' },
              { href: '/students', icon: Users, label: 'Manage Clients' },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center justify-between squircle-btn border border-[#e2e8f0] bg-[#f8f9fb] p-3 hover:bg-white hover:border-[#cbd5e1] transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-[#64748b] group-hover:text-[#0f172a]" strokeWidth={1.5} />
                  <span className="text-[12px] font-semibold text-[#0f172a]">{label}</span>
                </div>
                <ChevronRight className="h-3 w-3 text-[#64748b]" />
              </Link>
            ))}
          </div>
        </div>

        {/* Banner & Metric Cards */}
        <div className="flex flex-col gap-4  squircle-card p-5">
          <div className="squircle-card p-4 bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] border border-[#bbf7d0] flex items-center justify-between">
            <div className="text-[12px] text-[#166534]">
              <span className="font-semibold">150%+ revenue</span> compared to last month.<br />
              <span className="text-[11px] opacity-85">Keep up the great work!</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-[#166534] text-white flex items-center justify-center shrink-0">
              <ArrowUp className="h-4 w-4" strokeWidth={2} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="squircle-card p-4">
              <div className="flex items-center gap-2 text-[#64748b] text-[11px] mb-1">
                <Users className="h-3.5 w-3.5 text-[#166534]" />
                <span>Active Clients</span>
              </div>
              <div className="text-[20px] font-semibold text-[#0f172a] tabular-nums">1,250</div>
              <div className="text-[10px] text-[#166534] font-medium mt-1">+8.2%</div>
            </div>
            <div className="squircle-card p-4">
              <div className="flex items-center gap-2 text-[#64748b] text-[11px] mb-1">
                <FileText className="h-3.5 w-3.5 text-[#166534]" />
                <span>Total Invoices</span>
              </div>
              <div className="text-[20px] font-semibold text-[#0f172a] tabular-nums">2,480</div>
              <div className="text-[10px] text-[#166534] font-medium mt-1">+6.1%</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Recent Invoices + Recent Activity ──────────────────── */}
      <div className="gsap-fade-in grid grid-cols-1 lg:grid-cols-3 gap-5 text-left">
        {/* Recent Invoices Table (2 col span) */}
        <div className="lg:col-span-2 squircle-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[14px] font-semibold text-[#0f172a]">Recent Invoices</div>
              <div className="text-[12px] text-[#64748b] mt-0.5">Latest client transactions</div>
            </div>
            <Link href="/payments" className="text-[12px] font-medium text-[#334155] hover:text-[#0f172a] flex items-center gap-0.5">
              View All <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-[11px] font-semibold text-[#64748b]">
                  <th className="pb-2.5">Invoice #</th>
                  <th className="pb-2.5">Student</th>
                  <th className="pb-2.5">Class</th>
                  <th className="pb-2.5 hidden sm:table-cell">Issued</th>
                  <th className="pb-2.5 hidden sm:table-cell">Due</th>
                  <th className="pb-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {recentInvoices.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#f8f9fb] transition-colors">
                    <td className="py-2.5 font-mono text-[11px] font-medium text-[#166534]">{tx.receiptNumber || 'RC-2026-0487'}</td>
                    <td className="py-2.5 text-[13px] font-medium text-[#0f172a]">{tx.studentName || 'Zainab Ali'}</td>
                    <td className="py-2.5 text-[12px] text-[#334155]">{tx.class || '04'}-{tx.section || 'A'}</td>
                    <td className="py-2.5 text-[12px] text-[#64748b] font-mono hidden sm:table-cell">{formatDate(tx.paymentDate || '2026-11-08')}</td>
                    <td className="py-2.5 text-[12px] text-[#64748b] font-mono hidden sm:table-cell">{formatDate(tx.paymentDate || '2026-11-08')}</td>
                    <td className="py-2.5 text-right tabular-nums text-[13px] font-semibold text-[#0f172a]">
                      {formatCurrency(tx.amount || 3200)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="squircle-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[14px] font-semibold text-[#0f172a]">Recent Activity</div>
            <Link href="/audit-logs" className="text-[12px] font-medium text-[#334155] hover:text-[#0f172a] flex items-center gap-0.5">
              View All <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="space-y-3.5">
            {recentActivity.map((act) => (
              <div key={act.id} className="flex items-start gap-2.5 text-[12px]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#166534]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-[#0f172a] truncate">{act.action || 'Payment Received'}</span>
                    <span className="text-[10px] text-[#64748b] font-mono shrink-0">2h ago</span>
                  </div>
                  <p className="text-[11px] text-[#334155] mt-0.5 line-clamp-1">{act.description || 'Rs. 3,200.00 via Bank Transfer from Zainab Ali'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}