'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * MotionProvider reads `prefers-reduced-motion` and viewport size once on mount
 * and exposes the reduced-motion state and mobile detection via React context.
 *
 * Requirements:
 * - Req 21.1: read `prefers-reduced-motion` when the visitor's environment requests it
 * - Req 21.3: default to reduced motion when `matchMedia` is unavailable (SSR, older browsers)
 * - Req 23.2: simplify Motion_System animations on mobile relative to desktop
 *
 * This is the single top-level provider that every animated component asks
 * for its resolved motion config, so reduced-motion and mobile simplification
 * are enforced in one place.
 */

interface MotionContextValue {
  prefersReducedMotion: boolean;
  isMobile: boolean;
}

const MotionContext = createContext<MotionContextValue | undefined>(undefined);

interface MotionProviderProps {
  children: ReactNode;
}

/**
 * Mobile breakpoint threshold in pixels.
 * Matches Tailwind's default 'md' breakpoint (768px).
 * Viewports below this are classified as mobile.
 */
const MOBILE_BREAKPOINT = 768;

export function MotionProvider({ children }: MotionProviderProps) {
  // Default to reduced motion (true) for SSR and when matchMedia is unavailable (Req 21.3)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  
  // Default to mobile (true) for SSR to ensure mobile-first rendering (Req 23.2)
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Read matchMedia once on mount (Req 21.1)
    // If matchMedia is unavailable, keep the default (reduced motion = true)
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    }
    
    // Detect mobile viewport once on mount (Req 23.2)
    // Viewport below MOBILE_BREAKPOINT (768px) is classified as mobile
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      };
      
      // Check immediately on mount
      checkMobile();
      
      // Listen for resize events to update mobile state
      // Using a simple debounce to avoid excessive re-renders
      let resizeTimeout: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(checkMobile, 150);
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        clearTimeout(resizeTimeout);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <MotionContext.Provider value={{ prefersReducedMotion, isMobile }}>
      {children}
    </MotionContext.Provider>
  );
}

/**
 * Hook for consuming the reduced-motion state.
 * Throws if used outside MotionProvider.
 */
export function useReducedMotion(): boolean {
  const context = useContext(MotionContext);
  if (context === undefined) {
    throw new Error('useReducedMotion must be used within a MotionProvider');
  }
  return context.prefersReducedMotion;
}

/**
 * Hook for consuming the mobile detection state.
 * Throws if used outside MotionProvider.
 * Returns true when viewport width is below MOBILE_BREAKPOINT (768px).
 */
export function useIsMobile(): boolean {
  const context = useContext(MotionContext);
  if (context === undefined) {
    throw new Error('useIsMobile must be used within a MotionProvider');
  }
  return context.isMobile;
}

/**
 * Hook for consuming both reduced-motion and mobile state.
 * Throws if used outside MotionProvider.
 * 
 * Use this when you need both values to determine motion behavior,
 * particularly for implementing Req 23.2 (simplify animations on mobile).
 */
export function useMotionContext(): MotionContextValue {
  const context = useContext(MotionContext);
  if (context === undefined) {
    throw new Error('useMotionContext must be used within a MotionProvider');
  }
  return context;
}
