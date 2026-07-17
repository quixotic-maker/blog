/**
 * Unit tests for SystemDiagram component (Task 11.2).
 *
 * Verifies:
 * - Req 10.2: represents the semantic-to-physical-execution flow
 * - Req 10.3: uses boxes, connectors, and monospace protocol annotations
 * - Restrained engineering style (NOT illustrative artwork)
 * - Reduced motion: renders as static graphic (Req 19.5)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SystemDiagram } from '@/components/sections/SystemDiagram';
import { MotionProvider } from '@/components/providers/MotionProvider';

// Wrapper to provide MotionProvider context
function Wrapper({ children }: { children: React.ReactNode }) {
  return <MotionProvider>{children}</MotionProvider>;
}

describe('SystemDiagram', () => {
  it('renders an SVG diagram (Req 10.2)', () => {
    render(<SystemDiagram />, { wrapper: Wrapper });
    
    const diagram = screen.getByRole('img', {
      name: /system flow diagram/i,
    });
    expect(diagram).toBeInTheDocument();
    expect(diagram.tagName).toBe('svg');
  });

  it('represents the three-stage flow: semantic → decoupling → action (Req 10.2)', () => {
    const { container } = render(<SystemDiagram />, { wrapper: Wrapper });
    
    // Check for the three stages by their text content
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    // Stage 1: Semantic
    expect(svg?.textContent).toContain('Semantic');
    expect(svg?.textContent).toContain('LLM / Intent');
    
    // Stage 2: Decoupling
    expect(svg?.textContent).toContain('Decoupling');
    expect(svg?.textContent).toContain('AgentRegistry');
    
    // Stage 3: Action
    expect(svg?.textContent).toContain('Action');
    expect(svg?.textContent).toContain('HW / Servo / Agent');
  });

  it('uses monospace protocol annotations (Req 10.3)', () => {
    const { container } = render(<SystemDiagram />, { wrapper: Wrapper });
    
    const svg = container.querySelector('svg');
    
    // Check for protocol annotations below the flow
    expect(svg?.textContent).toContain('<user_input>');
    expect(svg?.textContent).toContain('<task_queue>');
    expect(svg?.textContent).toContain('<execution>');
    
    // Check for connector labels
    expect(svg?.textContent).toContain('parse');
    expect(svg?.textContent).toContain('dispatch');
  });

  it('uses boxes and connectors in engineering style (Req 10.3)', () => {
    const { container } = render(<SystemDiagram />, { wrapper: Wrapper });
    
    const svg = container.querySelector('svg');
    
    // Should have rectangular boxes (not illustrative shapes)
    const rects = svg?.querySelectorAll('rect[stroke]');
    expect(rects).toBeDefined();
    expect(rects!.length).toBeGreaterThanOrEqual(3); // At least 3 stage boxes
    
    // Should have connector lines
    const lines = svg?.querySelectorAll('line');
    expect(lines).toBeDefined();
    expect(lines!.length).toBeGreaterThanOrEqual(2); // At least 2 connectors
    
    // Should have arrow markers
    const markers = svg?.querySelectorAll('marker');
    expect(markers).toBeDefined();
  });

  it('includes a subtle grid pattern for engineering aesthetic', () => {
    const { container } = render(<SystemDiagram />, { wrapper: Wrapper });
    
    const svg = container.querySelector('svg');
    const pattern = svg?.querySelector('pattern#diagram-grid');
    expect(pattern).toBeInTheDocument();
  });

  it('has proper accessibility with aria-label', () => {
    render(<SystemDiagram />, { wrapper: Wrapper });
    
    const diagram = screen.getByRole('img');
    expect(diagram).toHaveAttribute('aria-label');
    expect(diagram.getAttribute('aria-label')).toMatch(/system flow/i);
  });
});
