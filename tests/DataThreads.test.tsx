import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataThreads } from '../components/systems/DataThreads';
import { MotionProvider } from '../components/providers/MotionProvider';

/**
 * Unit test: DataThreads component
 *
 * Tests:
 * - Renders baseline metrics initially
 * - Renders metrics in monospace amber color (Req 6.1, 6.3)
 * - Renders statically under reduced motion (Req 6.6)
 */

describe('DataThreads', () => {
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('renders baseline metrics initially', () => {
    // Mock matchMedia to return no reduced motion
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
        <DataThreads />
      </MotionProvider>
    );

    // Baseline metrics should be present
    expect(container.textContent).toContain('18 agents');
    expect(container.textContent).toContain('9600 baud');
    expect(container.textContent).toContain('1kHz');
    expect(container.textContent).toContain('P95<200ms');
  });

  it('renders metrics with monospace font and amber color', () => {
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
        <DataThreads />
      </MotionProvider>
    );

    // Find metric elements
    const metricElements = container.querySelectorAll('.font-mono');
    expect(metricElements.length).toBeGreaterThan(0);

    // Check that metrics use amber accent color
    metricElements.forEach((element) => {
      const style = (element as HTMLElement).style;
      expect(style.color).toBe('var(--color-accent)');
    });
  });

  it('renders statically under reduced motion', () => {
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
        <DataThreads />
      </MotionProvider>
    );

    // Metrics should still be present
    expect(container.textContent).toContain('18 agents');

    // Check that metrics are rendered as plain divs (not motion.div)
    const metricElements = container.querySelectorAll('.font-mono');
    expect(metricElements.length).toBeGreaterThan(0);

    // All metrics should be visible (no exit animation)
    metricElements.forEach((element) => {
      expect(element).toBeVisible();
    });
  });

  it('positions metrics in left and right margins', () => {
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
        <DataThreads />
      </MotionProvider>
    );

    // Check for left margin container
    const leftMargin = container.querySelector('.left-4');
    expect(leftMargin).toBeTruthy();

    // Check for right margin container
    const rightMargin = container.querySelector('.right-4');
    expect(rightMargin).toBeTruthy();
  });

  it('is non-interactive (pointer-events-none)', () => {
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
        <DataThreads />
      </MotionProvider>
    );

    // The wrapper should have pointer-events-none
    const wrapper = container.querySelector('.pointer-events-none');
    expect(wrapper).toBeTruthy();
  });
});
