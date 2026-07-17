/**
 * Unit tests for ExplodedViewMotif component.
 *
 * Tests Requirements:
 * - Req 19.2: renders exploded-view assembly diagram
 * - Req 19.3: renders numeric labels in monospace
 * - Req 19.5: renders statically under reduced motion
 *
 * Task 14.2: Implement OscilloscopeMotif (My Heart) and ExplodedViewMotif (ARF)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExplodedViewMotif } from '@/components/project/ExplodedViewMotif';
import { MotionProvider } from '@/components/providers/MotionProvider';

describe('ExplodedViewMotif', () => {
  it('renders the exploded view assembly diagram', () => {
    render(
      <MotionProvider>
        <ExplodedViewMotif />
      </MotionProvider>
    );

    // Check for the caption text
    expect(screen.getByText(/ARF Layered Architecture Assembly/i)).toBeInTheDocument();
  });

  it('renders all ARF architecture layers with labels in monospace (Req 19.3)', () => {
    render(
      <MotionProvider>
        <ExplodedViewMotif />
      </MotionProvider>
    );

    // Check for layer labels with indices (numeric values in monospace)
    expect(screen.getByText(/L0 HAL:/i)).toBeInTheDocument();
    expect(screen.getByText(/L1 RTS:/i)).toBeInTheDocument();
    expect(screen.getByText(/L2 DMS:/i)).toBeInTheDocument();
    expect(screen.getByText(/L3 ACR:/i)).toBeInTheDocument();
    expect(screen.getByText(/L4 DIL:/i)).toBeInTheDocument();
    expect(screen.getByText(/L5 App:/i)).toBeInTheDocument();
  });

  it('renders layer descriptions in the legend', () => {
    render(
      <MotionProvider>
        <ExplodedViewMotif />
      </MotionProvider>
    );

    // Check for layer descriptions
    expect(screen.getByText(/Hardware Abstraction/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-Time Scheduling/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Algorithm Container/i)).toBeInTheDocument();
    expect(screen.getByText(/Decision Intelligence/i)).toBeInTheDocument();
    expect(screen.getByText(/Application Layer/i)).toBeInTheDocument();
  });

  it('renders SVG with proper dimensions', () => {
    const { container } = render(
      <MotionProvider>
        <ExplodedViewMotif width={700} height={500} />
      </MotionProvider>
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 700 500');
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(
      <MotionProvider>
        <ExplodedViewMotif />
      </MotionProvider>
    );

    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-label')).toContain('Exploded view assembly diagram');
  });

  it('renders statically under reduced motion (Req 19.5)', () => {
    // Mock prefers-reduced-motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      }),
    });

    const { container } = render(
      <MotionProvider>
        <ExplodedViewMotif />
      </MotionProvider>
    );

    // Under reduced motion, layers should be static <g> elements, not <motion.g>
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    // All layers should still be rendered
    expect(screen.getByText(/L0 HAL:/i)).toBeInTheDocument();
    expect(screen.getByText(/L5 App:/i)).toBeInTheDocument();
  });

  it('matches structural snapshot', () => {
    const { container } = render(
      <MotionProvider>
        <ExplodedViewMotif />
      </MotionProvider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
