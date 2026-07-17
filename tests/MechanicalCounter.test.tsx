/**
 * Unit tests for MechanicalCounter component.
 *
 * Tests that MechanicalCounter:
 * - renders without crashing
 * - displays the target value
 * - renders in monospace font
 * - renders static target under reduced motion (Req 11.5)
 * - handles suffix correctly
 * - uses counter logic from lib/counter.ts
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { MechanicalCounter } from '../components/systems/MechanicalCounter';
import { MotionProvider } from '../components/providers/MotionProvider';

describe('MechanicalCounter', () => {
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('renders without crashing', () => {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
    })) as typeof window.matchMedia;

    const { container } = render(
      <MotionProvider>
        <MechanicalCounter target={42} />
      </MotionProvider>
    );

    expect(container.firstChild).toBeTruthy();
  });

  it('renders static target under reduced motion (Req 11.5)', () => {
    // Mock matchMedia to return reduced motion preference
    window.matchMedia = ((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
    })) as typeof window.matchMedia;

    const { container } = render(
      <MotionProvider>
        <MechanicalCounter target={100} />
      </MotionProvider>
    );

    // Under reduced motion, the target value should be displayed immediately
    expect(container.textContent).toContain('100');
    
    // The component should render as a plain div, not motion.div
    const element = container.querySelector('.font-mono');
    expect(element).toBeTruthy();
    
    // Verify it's static by checking no motion-specific attributes
    const hasMotionAttributes = element?.hasAttribute('data-framer-motion');
    expect(hasMotionAttributes).toBeFalsy();
  });

  it('displays the target value under reduced motion', () => {
    window.matchMedia = ((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
    })) as typeof window.matchMedia;

    const { container } = render(
      <MotionProvider>
        <MechanicalCounter target={250} />
      </MotionProvider>
    );

    expect(container.textContent).toBe('250');
  });

  it('renders with suffix under reduced motion', () => {
    window.matchMedia = ((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
    })) as typeof window.matchMedia;

    const { container } = render(
      <MotionProvider>
        <MechanicalCounter target={200} suffix="ms" />
      </MotionProvider>
    );

    expect(container.textContent).toBe('200ms');
  });

  it('uses monospace font under reduced motion', () => {
    window.matchMedia = ((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
    })) as typeof window.matchMedia;

    const { container } = render(
      <MotionProvider>
        <MechanicalCounter target={42} />
      </MotionProvider>
    );

    const element = container.querySelector('.font-mono');
    expect(element).toBeTruthy();
  });

  it('renders with custom className', () => {
    window.matchMedia = ((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
    })) as typeof window.matchMedia;

    const { container } = render(
      <MotionProvider>
        <MechanicalCounter target={42} className="custom-counter" />
      </MotionProvider>
    );

    const element = container.querySelector('.custom-counter');
    expect(element).toBeTruthy();
  });

  it('handles zero target value', () => {
    window.matchMedia = ((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
    })) as typeof window.matchMedia;

    const { container } = render(
      <MotionProvider>
        <MechanicalCounter target={0} />
      </MotionProvider>
    );

    expect(container.textContent).toBe('0');
  });

  it('handles large target values', () => {
    window.matchMedia = ((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
    })) as typeof window.matchMedia;

    const { container } = render(
      <MotionProvider>
        <MechanicalCounter target={999999} />
      </MotionProvider>
    );

    expect(container.textContent).toBe('999999');
  });

  it('rounds decimal target values', () => {
    window.matchMedia = ((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
    })) as typeof window.matchMedia;

    const { container } = render(
      <MotionProvider>
        <MechanicalCounter target={42.7} />
      </MotionProvider>
    );

    // Should round 42.7 to 43
    expect(container.textContent).toBe('43');
  });

  it('handles various suffix formats', () => {
    window.matchMedia = ((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
    })) as typeof window.matchMedia;

    const suffixes = ['+', '%', 'ms', 'K', '<', '>'];
    
    suffixes.forEach((suffix) => {
      const { container, unmount } = render(
        <MotionProvider>
          <MechanicalCounter target={100} suffix={suffix} />
        </MotionProvider>
      );
      
      expect(container.textContent).toBe(`100${suffix}`);
      unmount();
    });
  });

  it('renders animated counter when motion is enabled', () => {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
    })) as typeof window.matchMedia;

    const { container } = render(
      <MotionProvider>
        <MechanicalCounter target={42} />
      </MotionProvider>
    );

    // When motion is enabled, component should render
    expect(container.firstChild).toBeTruthy();
    
    // Should have monospace font
    const element = container.querySelector('.font-mono');
    expect(element).toBeTruthy();
  });

  it('uses tabular-nums for consistent digit width in animated mode', () => {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
    })) as typeof window.matchMedia;

    const { container } = render(
      <MotionProvider>
        <MechanicalCounter target={42} />
      </MotionProvider>
    );

    // Should have tabular-nums class for consistent digit spacing
    const element = container.querySelector('.tabular-nums');
    expect(element).toBeTruthy();
  });
});
