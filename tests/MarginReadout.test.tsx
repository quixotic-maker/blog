/**
 * Unit tests for MarginReadout component.
 *
 * Tests that MarginReadout:
 * - renders without crashing
 * - displays the correct content
 * - applies correct positioning classes
 * - uses monospace font and accent color
 * - is non-interactive (pointer-events-none)
 * - has appropriate aria-label
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarginReadout } from '../components/systems/MarginReadout';

describe('MarginReadout', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MarginReadout position="top-left" content="X:0,Y:0" />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('displays the correct content', () => {
    render(<MarginReadout position="top-left" content="Page 1 / Col 12" />);
    expect(screen.getByText('Page 1 / Col 12')).toBeTruthy();
  });

  it('applies correct positioning for top-left', () => {
    const { container } = render(
      <MarginReadout position="top-left" content="test" />
    );
    const element = container.firstChild as HTMLElement;
    
    expect(element.className).toContain('top-4');
    expect(element.className).toContain('left-4');
  });

  it('applies correct positioning for top-right', () => {
    const { container } = render(
      <MarginReadout position="top-right" content="test" />
    );
    const element = container.firstChild as HTMLElement;
    
    expect(element.className).toContain('top-4');
    expect(element.className).toContain('right-4');
  });

  it('applies correct positioning for bottom-left', () => {
    const { container } = render(
      <MarginReadout position="bottom-left" content="test" />
    );
    const element = container.firstChild as HTMLElement;
    
    expect(element.className).toContain('bottom-4');
    expect(element.className).toContain('left-4');
  });

  it('applies correct positioning for bottom-right', () => {
    const { container } = render(
      <MarginReadout position="bottom-right" content="test" />
    );
    const element = container.firstChild as HTMLElement;
    
    expect(element.className).toContain('bottom-4');
    expect(element.className).toContain('right-4');
  });

  it('uses monospace font family', () => {
    const { container } = render(
      <MarginReadout position="top-left" content="test" />
    );
    const element = container.firstChild as HTMLElement;
    
    expect(element.style.fontFamily).toBe('var(--font-mono)');
  });

  it('uses accent color', () => {
    const { container } = render(
      <MarginReadout position="top-left" content="test" />
    );
    const element = container.firstChild as HTMLElement;
    
    expect(element.style.color).toBe('var(--color-accent)');
  });

  it('is non-interactive with pointer-events-none', () => {
    const { container } = render(
      <MarginReadout position="top-left" content="test" />
    );
    const element = container.firstChild as HTMLElement;
    
    expect(element.className).toContain('pointer-events-none');
  });

  it('has appropriate aria-label', () => {
    const { container } = render(
      <MarginReadout position="top-left" content="X:100,Y:200" />
    );
    const element = container.firstChild as HTMLElement;
    
    expect(element.getAttribute('aria-label')).toBe('Margin readout: X:100,Y:200');
  });

  it('is fixed positioned', () => {
    const { container } = render(
      <MarginReadout position="top-left" content="test" />
    );
    const element = container.firstChild as HTMLElement;
    
    expect(element.className).toContain('fixed');
  });
});
