'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Unslop: single easing curve for the whole app, cubic-bezier(0.22, 1, 0.36, 1)
// Rise 8px, duration 320ms, stagger 50ms, at most six items
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function useGsapEntrance(selector = '.gsap-fade-in', stagger = 0.05, delay = 0.0) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll(selector);
    if (!elements || elements.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.32,
          stagger,
          delay,
          ease: EASE,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [selector, stagger, delay]);

  return containerRef;
}
