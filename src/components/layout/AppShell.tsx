'use client';

import React, { useState, Suspense } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { Toaster } from 'sonner';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    // Unslop pass 2 (Color): graphite-tinted background #fafafa (token: light graphite page bg)
    <div className="min-h-screen bg-[#fafafa] text-[#171717] antialiased">
      <Suspense fallback={<aside className="fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-[#e2e8f0]" />}>
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(prev => !prev)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
      </Suspense>

      <Suspense fallback={<header className="h-14 bg-white border-b border-[#e2e8f0]" />}>
        <TopNavbar
          collapsed={collapsed}
          onOpenMobile={() => setMobileOpen(true)}
        />
      </Suspense>

      {/* Main Content Area — Full-width and strictly left-aligned */}
      <main
        className={`min-h-[calc(100vh-3.5rem)] py-6 pr-6 lg:pr-8 pl-4 transition-[padding-left] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          collapsed ? 'lg:pl-[96px]' : 'lg:pl-[280px]'
        }`}
      >
        {/* Content container strictly full-width and left-aligned on all screen sizes */}
        <div className="w-full text-left">
          <Suspense fallback={<div className="py-16 text-left text-[13px] text-[#64748b]">Loading…</div>}>
            {children}
          </Suspense>
        </div>
      </main>

      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="light"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            border: '1px solid #e2e8f0',
            color: '#171717',
            fontSize: '13px',
            borderRadius: '10px',
          },
        }}
      />
    </div>
  );
}
