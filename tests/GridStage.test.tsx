/**
 * Unit tests for GridStage component.
 *
 * Tests that GridStage:
 * - renders without crashing
 * - applies the correct styling (fixed positioning, grid background)
 * - is non-interactive (pointer-events-none)
 * - is marked as aria-hidden
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { GridStage } from '../components/systems/GridStage';

describe('GridStage', () => {
  it('renders without crashing', () => {
    const { container } = render(<GridStage />);
    expect(container.firstChild).toBeTruthy();
  });

  it('applies fixed positioning and covers the viewport', () => {
    const { container } = render(<GridStage />);
    const element = container.firstChild as HTMLElement;
    
    expect(element.className).toContain('fixed');
    expect(element.className).toContain('inset-0');
  });

  it('is non-interactive with pointer-events-none', () => {
    const { container } = render(<GridStage />);
    const element = container.firstChild as HTMLElement;
    
    expect(element.className).toContain('pointer-events-none');
  });

  it('is marked as aria-hidden for accessibility', () => {
    const { container } = render(<GridStage />);
    const element = container.firstChild as HTMLElement;
    
    expect(element.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies grid background using --color-grid', () => {
    const { container } = render(<GridStage />);
    const element = container.firstChild as HTMLElement;
    
    expect(element.style.backgroundImage).toContain('repeating-linear-gradient');
    expect(element.style.backgroundImage).toContain('var(--color-grid)');
  });
});
