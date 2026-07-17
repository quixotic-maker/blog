/**
 * Unit tests for HeroSection component (Task 11.2).
 *
 * Verifies:
 * - Req 1.1: positioning statement is rendered
 * - Req 1.2: full-stack capability statement is rendered
 * - Req 10.1: positioning statement is displayed in Hero_Section
 * - Req 10.2: SystemDiagram is included
 * - Large display typography and generous whitespace
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/sections/HeroSection';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { siteContent } from '@/content/site';

// Wrapper to provide both LocaleProvider and MotionProvider contexts
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </MotionProvider>
  );
}

describe('HeroSection', () => {
  it('renders the AI PM positioning statement (Req 1.1, 10.1)', () => {
    render(<HeroSection />, { wrapper: Wrapper });
    
    // Default locale is 'zh', so Chinese positioning should be shown
    const positioning = screen.getByText(siteContent.hero.positioning.zh);
    expect(positioning).toBeInTheDocument();
  });

  it('renders the full-stack capability statement (Req 1.2)', () => {
    render(<HeroSection />, { wrapper: Wrapper });
    
    // Default locale is 'zh', so Chinese capability should be shown
    const capability = screen.getByText(siteContent.hero.capability.zh);
    expect(capability).toBeInTheDocument();
  });

  it('includes the SystemDiagram component (Req 10.2)', () => {
    render(<HeroSection />, { wrapper: Wrapper });
    
    // Check for the system diagram by its aria-label
    const diagram = screen.getByRole('img', {
      name: /system flow diagram/i,
    });
    expect(diagram).toBeInTheDocument();
  });

  it('uses large display typography for positioning statement', () => {
    render(<HeroSection />, { wrapper: Wrapper });
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.className).toContain('font-display');
    expect(heading.className).toMatch(/text-5xl|text-6xl|text-7xl/);
  });

  it('has proper semantic structure with section and heading', () => {
    render(<HeroSection />, { wrapper: Wrapper });
    
    // Should have section landmark (region role)
    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('aria-labelledby', 'hero-heading');
    
    // Should have h1 heading with id
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('id', 'hero-heading');
  });

  it('renders subtitle with monospace font', () => {
    render(<HeroSection />, { wrapper: Wrapper });
    
    const subtitle = screen.getByText(siteContent.hero.subtitle.zh);
    expect(subtitle).toBeInTheDocument();
    expect(subtitle.className).toContain('font-mono');
  });
});
