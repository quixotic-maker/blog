import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { MotionProvider, useReducedMotion } from '../components/providers/MotionProvider';
import { resolveMotion, type MotionIntent } from '../lib/motion';

/**
 * Integration test: MotionProvider + motion.ts resolveMotion
 * 
 * This demonstrates how animated components should consume the MotionProvider
 * and use it with the motion.ts library to get resolved motion configs.
 */

function MockAnimatedComponent({ intent }: { intent: MotionIntent }) {
  const reduced = useReducedMotion();
  const config = resolveMotion(intent, reduced);
  
  return (
    <div data-testid="motion-config">
      {JSON.stringify(config)}
    </div>
  );
}

describe('MotionProvider integration with motion.ts', () => {
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('provides reduced motion state to resolveMotion when user prefers reduced motion', () => {
    // Mock prefers-reduced-motion: reduce
    window.matchMedia = (query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    });

    const { container } = render(
      <MotionProvider>
        <MockAnimatedComponent intent="sectionEnter" />
      </MotionProvider>
    );

    const config = JSON.parse(container.querySelector('[data-testid="motion-config"]')?.textContent || '{}');
    
    // When reduced motion is active, kind should be 'fade' not 'align' (Req 21.2)
    expect(config.kind).toBe('fade');
    expect(config.durationMs).toBe(500);
  });

  it('provides full motion state to resolveMotion when user does not prefer reduced motion', () => {
    // Mock no preference for reduced motion
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    });

    const { container } = render(
      <MotionProvider>
        <MockAnimatedComponent intent="sectionEnter" />
      </MotionProvider>
    );

    const config = JSON.parse(container.querySelector('[data-testid="motion-config"]')?.textContent || '{}');
    
    // When reduced motion is off, kind should be 'align' (Req 20.2)
    expect(config.kind).toBe('align');
    expect(config.durationMs).toBe(500);
    expect(config.staggerMs).toBe(75);
  });

  it('defaults to reduced motion when matchMedia is unavailable', () => {
    // Simulate SSR or older browsers
    (window as any).matchMedia = undefined;

    const { container } = render(
      <MotionProvider>
        <MockAnimatedComponent intent="parallax" />
      </MotionProvider>
    );

    const config = JSON.parse(container.querySelector('[data-testid="motion-config"]')?.textContent || '{}');
    
    // Parallax under reduced motion should be static (Req 5.6, 21.2)
    expect(config.kind).toBe('static');
    expect(config.durationMs).toBe(0);
  });
});
