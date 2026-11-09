'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Wallet,
  Receipt,
  FileText,
  MessageCircle,
  ChartNoAxesCombined,
  Settings,
  CalendarDays,
  Layers,
  GraduationCap,
  Shield,
  FileClock,
  Building2,
  Percent,
  Undo2,
  Send,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

interface NavGroup {
  // Unslop pass 5 (Type): sentence case, not uppercase tracked labels
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Student accounts',
    items: [
      { name: 'Students', href: '/students', icon: Users },
      { name: 'Fee structures', href: '/fee-structures', icon: Layers },
      { name: 'Fee assignments', href: '/fee-assignments', icon: SlidersHorizontal },
    ],
  },
  {
    title: 'Financial operations',
    items: [
      { name: 'Fee collection', href: '/fee-collection', icon: Wallet },
      { name: 'Invoices & challans', href: '/invoices', icon: FileText },
      { name: 'Payments', href: '/payments', icon: Receipt },
      { name: 'Adjustments & discounts', href: '/adjustments', icon: Percent },
      { name: 'Refunds', href: '/refunds', icon: Undo2 },
    ],
  },
  {
    title: 'Communication',
    items: [
      { name: 'WhatsApp notifications', href: '/notifications', icon: MessageCircle },
      { name: 'Message templates', href: '/message-templates', icon: Send },
    ],
  },
  {
    title: 'Reporting',
    items: [
      { name: 'Financial reports', href: '/reports', icon: ChartNoAxesCombined },
      { name: 'Collection analytics', href: '/analytics', icon: TrendingUp },
    ],
  },
  {
    title: 'System',
    items: [
      { name: 'Academic sessions', href: '/academic-sessions', icon: CalendarDays },
      { name: 'Classes & sections', href: '/classes', icon: GraduationCap },
      { name: 'User management', href: '/users', icon: Shield },
      { name: 'Audit logs', href: '/audit-logs', icon: FileClock },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container
          Unslop pass 1 (Spacing): 240–280px wide per tokens; 256px (w-64) ✓
          Unslop pass 9 (Motion): transition-[width,transform] not transition-all */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-[#e2e8f0] bg-white',
          'transition-[width,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
          collapsed ? 'w-[72px]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header Logo — 56px tall to match topbar */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#e2e8f0] px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            {/* Logo mark: squircle geometry */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center squircle-btn bg-[#1e3a5f] text-white">
              <Building2 className="h-4 w-4" strokeWidth={1.5} />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate text-left">
                <span className="truncate text-[13px] font-semibold text-[#0f172a] leading-tight">
                  Jammu Kashmir College
                </span>
                <span className="text-[11px] text-[#64748b] leading-tight">
                  Fee management
                </span>
              </div>
            )}
          </Link>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={onToggleCollapse}
            className="hidden h-6 w-6 items-center justify-center squircle-btn text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors duration-150 lg:flex"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} /> : <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 text-left">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.title} className={gi > 0 ? 'mt-5' : ''}>
              {!collapsed && (
                <div className="mb-1 px-2 pb-1 text-[11px] font-semibold text-[#64748b]">
                  {group.title}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={cn(
                        'group relative flex items-center gap-2.5 squircle-btn py-1.5 text-[13px] font-medium',
                        'transition-colors duration-150',
                        collapsed ? 'justify-center px-0' : 'px-2',
                        isActive
                          ? 'bg-[#f1f5f9] text-[#0f172a] font-semibold'
                          : 'text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      {/* Signature: thin left accent bar on active */}
                      {isActive && !collapsed && (
                        <span className="absolute left-0 top-1 bottom-1 w-[2.5px] rounded-r-full bg-[#1e3a5f]" />
                      )}
                      {/* Fixed icon column */}
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                        <Icon
                          className={cn(
                            'h-[16px] w-[16px] transition-colors duration-150',
                            isActive ? 'text-[#1e3a5f]' : 'text-[#64748b] group-hover:text-[#334155]'
                          )}
                          strokeWidth={1.5}
                        />
                      </span>
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom version */}
        {!collapsed && (
          <div className="px-4 py-3 border-t border-[#e2e8f0] text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#64748b]">Demo prototype</span>
              <span className="font-mono text-[10px] text-[#64748b] bg-[#f1f5f9] border border-[#e2e8f0] px-1.5 py-0.5 squircle-badge font-semibold">v1.0</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
