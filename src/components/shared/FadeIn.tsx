'use client';

import React from 'react';
import { useGsapEntrance } from '@/hooks/useGsap';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

export function FadeIn({ children, className = '', stagger = 0.04, delay = 0.02 }: FadeInProps) {
  const containerRef = useGsapEntrance('.gsap-fade-in', stagger, delay);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
