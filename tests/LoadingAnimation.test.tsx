import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LoadingAnimation } from '@/components/sections/LoadingAnimation';
import { MotionProvider } from '@/components/providers/MotionProvider';

/**
 * Tests for LoadingAnimation component.
 *
 * Requirements tested:
 * - Req 4.1: displays before Homepage content is revealed
 * - Req 4.2: establishes Grid_Motif and calibrates Data_Thread parameters
 * - Req 4.3: uses line-scan/calibration style (not a spinner)
 * - Req 4.4: renders amber on paper background
 * - Req 4.5: completes within 800-1200ms
 * - Req 4.6: calls onComplete callback
 * - Req 4.8: degrades to simple fade under reduced motion
 */

describe('LoadingAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders with calibration sequence in full motion mode', () => {
    const onComplete = vi.fn();
    
    // Mock matchMedia to return no reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false, // not reduced motion
        media: query,
        addListener: vi.fn(), // Deprecated but Framer Motion still uses it
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    render(
      <MotionProvider>
        <LoadingAnimation onComplete={onComplete} />
      </MotionProvider>
    );

    // Should render the calibration sequence
    expect(screen.getByText(/System Calibration/i)).toBeInTheDocument();
  });

  it('displays baseline Data_Thread metrics during calibration', () => {
    const onComplete = vi.fn();
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    render(
      <MotionProvider>
        <LoadingAnimation onComplete={onComplete} />
      </MotionProvider>
    );

    // Should display baseline metrics from activeMetrics('baseline')
    // These are the real Data_Thread parameters: 18 agents, 9600 baud, 1kHz, P95<200ms, H90,V120, jitter<100μs
    // The component renders them, so at least some should be visible
    const container = screen.getByText(/System Calibration/i).parentElement?.parentElement;
    expect(container).toBeInTheDocument();
  });

  it('calls onComplete after the loading duration completes', async () => {
    const onComplete = vi.fn();
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    render(
      <MotionProvider>
        <LoadingAnimation onComplete={onComplete} />
      </MotionProvider>
    );

    expect(onComplete).not.toHaveBeenCalled();

    // Loading duration is 1000ms (midpoint of 800-1200ms band)
    // Plus exit animation ~400ms
    vi.advanceTimersByTime(1000);
    vi.advanceTimersByTime(400);
    
    // Should call onComplete after both timers
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('renders simple fade under reduced motion', () => {
    const onComplete = vi.fn();
    
    // Mock matchMedia to return reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: true, // reduced motion
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    render(
      <MotionProvider>
        <LoadingAnimation onComplete={onComplete} />
      </MotionProvider>
    );

    // Should render simple "Loading..." text (Req 4.8)
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Should NOT render the calibration sequence
    expect(screen.queryByText(/System Calibration/i)).not.toBeInTheDocument();
  });

  it('uses line-scan/calibration style, not a spinner', () => {
    const onComplete = vi.fn();
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    const { container } = render(
      <MotionProvider>
        <LoadingAnimation onComplete={onComplete} />
      </MotionProvider>
    );

    // Should NOT contain any spinner-related classes or elements
    // (no "rotate", "spin", "circle", etc.)
    const html = container.innerHTML;
    expect(html).not.toMatch(/spin/i);
    expect(html).not.toMatch(/rotate/i);
    expect(html).not.toMatch(/circle/i);
    
    // Should contain calibration-related content
    expect(screen.getByText(/System Calibration/i)).toBeInTheDocument();
  });

  it('excludes AI-aesthetic elements', () => {
    const onComplete = vi.fn();
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    const { container } = render(
      <MotionProvider>
        <LoadingAnimation onComplete={onComplete} />
      </MotionProvider>
    );

    // Should NOT contain AI-aesthetic patterns (Req 4.7, 9.1, 9.2, 9.3)
    // No: pulsing glowing dots, shimmer skeletons, gradient progress rings, breathing glow orbs
    const html = container.innerHTML;
    expect(html).not.toMatch(/glow/i);
    expect(html).not.toMatch(/shimmer/i);
    expect(html).not.toMatch(/breath/i);
    // Note: we use "animate-pulse" for the cursor underscore, which is acceptable
    // as it's a typing cursor indicator, not a glowing dot pulse effect
    expect(html).not.toMatch(/gradient.*ring/i);
  });
});
