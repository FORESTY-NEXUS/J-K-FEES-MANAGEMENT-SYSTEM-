'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  Search,
  Bell,
  Wallet,
  CalendarDays,
} from 'lucide-react';
import { useFeeApp } from '@/lib/context/FeeAppContext';
import { GlobalSearchModal } from '@/components/shared/GlobalSearchModal';

interface TopNavbarProps {
  collapsed: boolean;
  onOpenMobile: () => void;
}

export function TopNavbar({ collapsed, onOpenMobile }: TopNavbarProps) {
  const { activeSession, auditLogs } = useFeeApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const recentLogs = auditLogs.slice(0, 5);

  return (
    <>
      {/* Topbar — 56px (h-14), neutral surface, hairline border
          Unslop pass 1: h-14 = 56px (tokens: 56–64) ✓
          Unslop pass 9: transition-[padding-left] not transition-all */}
      <header
        className={`sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#e2e8f0] bg-white pl-4 pr-6 lg:pr-8 transition-[padding-left] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          collapsed ? 'lg:pl-[96px]' : 'lg:pl-[280px]'
        }`}
      >
        {/* Left: mobile hamburger + search */}
        <div className="flex items-center gap-3 text-left">
          <button
            onClick={onOpenMobile}
            className="flex h-8 w-8 items-center justify-center squircle-btn text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors duration-150 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" strokeWidth={1.5} />
          </button>

          {/* Search — squircle input */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-8 w-56 sm:w-72 items-center justify-between squircle-btn border border-[#e2e8f0] bg-[#f8f9fb] px-3 text-[13px] text-[#64748b] hover:border-[#cbd5e1] hover:bg-white transition-colors duration-150 text-left"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-[#64748b]" strokeWidth={1.5} />
              <span>Search</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 squircle-badge border border-[#e2e8f0] bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#64748b] font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          {/* Active Session */}
          <div className="hidden md:flex items-center gap-1.5 text-[12px] text-[#334155] squircle-badge border border-[#e2e8f0] bg-[#f8f9fb] px-2.5 py-1">
            <CalendarDays className="h-3.5 w-3.5 text-[#1e3a5f]" strokeWidth={1.5} />
            <span className="font-medium text-[#0f172a]">{activeSession?.name || '2026–27'}</span>
          </div>

          {/* Demo badge — darker muted desaturated tone */}
          <div
            className="hidden sm:flex items-center gap-1.5 squircle-badge border border-[#cbd5e1] bg-[#f1f5f9] px-2 py-1 text-[11px] font-semibold text-[#334155]"
            title="Frontend demonstration — all data is mock"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#1e3a5f]" />
            <span>Demo</span>
          </div>

          {/* Collect Fee — primary squircle button */}
          <Link
            href="/fee-collection"
            className="hidden sm:inline-flex items-center gap-1.5 squircle-btn bg-[#1e3a5f] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#142842] transition-colors duration-150"
          >
            <Wallet className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>Collect fee</span>
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(prev => !prev)}
              className="relative flex h-8 w-8 items-center justify-center squircle-btn text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors duration-150"
              title="Recent activity"
            >
              <Bell className="h-4 w-4" strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#1e3a5f]" />
            </button>

            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div
                  className="absolute right-0 mt-2 z-50 w-80 sm:w-96 squircle-card p-3 text-left"
                  style={{ boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}
                >
                  <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2 mb-3">
                    <span className="text-[13px] font-semibold text-[#0f172a]">Recent activity</span>
                    <Link
                      href="/audit-logs"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[12px] font-medium text-[#1e3a5f] hover:underline transition-colors"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="space-y-1 max-h-72 overflow-y-auto">
                    {recentLogs.map((log) => (
                      <div key={log.id} className="squircle-badge px-2.5 py-2 hover:bg-[#f8f9fb] transition-colors text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-medium text-[#0f172a]">{log.action}</span>
                          <span className="text-[11px] text-[#64748b] font-mono">{log.timestamp.slice(11, 16)}</span>
                        </div>
                        <p className="text-[11px] text-[#334155] mt-0.5 line-clamp-1">{log.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#e2e8f0]">
            <div className="flex h-7 w-7 items-center justify-center squircle-btn bg-[#1e3a5f] text-white text-[11px] font-bold select-none">
              RM
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-[12px] font-semibold text-[#0f172a] leading-tight">M. Rashid Minhas</span>
              <span className="text-[11px] text-[#64748b] leading-tight">Chief accountant</span>
            </div>
          </div>
        </div>
      </header>

      <GlobalSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
