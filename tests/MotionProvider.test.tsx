import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MotionProvider, useReducedMotion } from '../components/providers/MotionProvider';

/**
 * Test component that consumes the useReducedMotion hook
 */
function TestConsumer() {
  const reduced = useReducedMotion();
  return <div data-testid="reduced-motion">{reduced ? 'reduced' : 'full'}</div>;
}

describe('MotionProvider', () => {
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('defaults to reduced motion when matchMedia is unavailable', () => {
    // Simulate matchMedia being unavailable (Req 21.3)
    (window as any).matchMedia = undefined;

    render(
      <MotionProvider>
        <TestConsumer />
      </MotionProvider>
    );

    expect(screen.getByTestId('reduced-motion').textContent).toBe('reduced');
  });

  it('reads matchMedia and respects prefers-reduced-motion: reduce', () => {
    // Mock matchMedia to return true for prefers-reduced-motion (Req 21.1)
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

    render(
      <MotionProvider>
        <TestConsumer />
      </MotionProvider>
    );

    expect(screen.getByTestId('reduced-motion').textContent).toBe('reduced');
  });

  it('reads matchMedia and respects no preference for reduced motion', () => {
    // Mock matchMedia to return false for prefers-reduced-motion (Req 21.1)
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

    render(
      <MotionProvider>
        <TestConsumer />
      </MotionProvider>
    );

    expect(screen.getByTestId('reduced-motion').textContent).toBe('full');
  });

  it('throws error when useReducedMotion is used outside provider', () => {
    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useReducedMotion must be used within a MotionProvider');
  });
});
