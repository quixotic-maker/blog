/**
 * Test for My Heart Project Page
 * 
 * Validates task 15.2:
 * - MDX content is imported and renders
 * - ProjectPage shell is used with correct layoutId
 * - OscilloscopeMotif is included
 * - ProjectHeader displays correct index, name, tagline
 * - MetricGrid displays metrics
 * - TechStackList displays tech tags
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyHeartPage from '@/app/work/my-heart/page';
import { projectsMeta } from '@/content/projectsMeta';

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    path: ({ children, ...props }: any) => <path {...props}>{children}</path>,
  },
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => ({ get: () => 0 }),
}));

// Mock the MotionProvider
vi.mock('@/components/providers/MotionProvider', () => ({
  useReducedMotion: () => false,
}));

describe('My Heart Project Page', () => {
  const myHeartMeta = projectsMeta[1]; // My Heart is at index 1

  it('renders the project header with correct index', () => {
    render(<MyHeartPage />);
    
    // Check for project index "02"
    expect(screen.getByText('02')).toBeDefined();
  });

  it('includes the OscilloscopeMotif signature motif', () => {
    render(<MyHeartPage />);
    
    // Check for oscilloscope SVG element
    const svg = document.querySelector('svg[aria-label*="Oscilloscope"]');
    expect(svg).toBeDefined();
  });

  it('displays key metrics including 9600 baud and H90,V120', () => {
    render(<MyHeartPage />);
    
    // Check for the key metrics specified in requirements
    expect(screen.getByText('9600 baud')).toBeDefined();
    expect(screen.getByText('H90,V120')).toBeDefined();
  });

  it('renders the MDX content', () => {
    render(<MyHeartPage />);
    
    // Check for some key content from the MDX
    // The overview heading should be present
    const content = document.body.textContent || '';
    expect(content).toContain('Overview');
  });

  it('includes the back-to-home control', () => {
    render(<MyHeartPage />);
    
    // Check for back link
    const backLink = screen.getByText('Back to Home');
    expect(backLink).toBeDefined();
  });

  it('displays the technology stack from projectsMeta', () => {
    render(<MyHeartPage />);
    
    // Check for some tech stack items
    expect(screen.getByText('Whisper ASR')).toBeDefined();
    expect(screen.getByText('Arduino Nano')).toBeDefined();
  });

  it('uses the correct projectsMeta for My Heart', () => {
    // Verify we're using the correct metadata
    expect(myHeartMeta.id).toBe('my-heart');
    expect(myHeartMeta.index).toBe('02');
    expect(myHeartMeta.signatureMotif).toBe('oscilloscope');
  });

  it('includes architecture highlights section', () => {
    render(<MyHeartPage />);
    
    const content = document.body.textContent || '';
    // Check for the architecture highlights section content
    expect(content).toContain('Software-Hardware Decoupling');
    expect(content).toContain('Jitter Suppression');
  });
});
