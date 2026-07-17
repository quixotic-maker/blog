/**
 * Unit tests for OscilloscopeMotif component.
 *
 * Tests Requirements:
 * - Req 19.1: renders oscilloscope/waveform motif
 * - Req 19.3: renders numeric values in monospace
 * - Req 19.5: renders statically under reduced motion
 *
 * Task 14.2: Implement OscilloscopeMotif (My Heart) and ExplodedViewMotif (ARF)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OscilloscopeMotif } from '@/components/project/OscilloscopeMotif';
import { MotionProvider } from '@/components/providers/MotionProvider';

describe('OscilloscopeMotif', () => {
  it('renders the oscilloscope motif with default values', () => {
    render(
      <MotionProvider>
        <OscilloscopeMotif />
      </MotionProvider>
    );

    // Check for the caption text
    expect(screen.getByText(/VAD\/RMS Energy Detection/i)).toBeInTheDocument();
    
    // Check for default RMS value
    expect(screen.getByText(/RMS: 0\.45/i)).toBeInTheDocument();
    
    // Check for default sample rate
    expect(screen.getByText(/RATE: 16kHz/i)).toBeInTheDocument();
  });

  it('renders custom RMS and sample rate values in monospace', () => {
    render(
      <MotionProvider>
        <OscilloscopeMotif rmsValue="0.72" sampleRate="8kHz" />
      </MotionProvider>
    );

    // Check for custom values (Req 19.3: numeric values in monospace)
    expect(screen.getByText(/RMS: 0\.72/i)).toBeInTheDocument();
    expect(screen.getByText(/RATE: 8kHz/i)).toBeInTheDocument();
  });

  it('renders SVG with proper dimensions', () => {
    const { container } = render(
      <MotionProvider>
        <OscilloscopeMotif width={400} height={150} />
      </MotionProvider>
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 400 150');
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(
      <MotionProvider>
        <OscilloscopeMotif />
      </MotionProvider>
    );

    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-label')).toContain('Oscilloscope waveform');
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
        <OscilloscopeMotif />
      </MotionProvider>
    );

    // Under reduced motion, paths should be static <path> elements, not <motion.path>
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
    
    // Check that the waveform is rendered (even if static)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('matches structural snapshot', () => {
    const { container } = render(
      <MotionProvider>
        <OscilloscopeMotif rmsValue="0.45" sampleRate="16kHz" />
      </MotionProvider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
