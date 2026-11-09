'use client';

import React from 'react';
import { FeeAppProvider } from '@/lib/context/FeeAppContext';
import { AppShell } from '@/components/layout/AppShell';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <FeeAppProvider>
      <AppShell>{children}</AppShell>
    </FeeAppProvider>
  );
}
