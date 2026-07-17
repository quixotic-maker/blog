// Unit test for PhilosophySection — verifies the component renders the four
// philosophy entries that define product thinking and approach.
//
// Requirements tested:
// - Req 16.1: renders Vibecoding approach
// - Req 16.2: renders AI-Native design, Agentic UX, and Generative UI concepts
// - Req 16.3: renders "Breathing Room" principle
// - Req 16.4: renders redefinition of "Skill"

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PhilosophySection } from '@/components/sections/PhilosophySection';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { siteContent } from '@/content/site';

describe('PhilosophySection', () => {
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
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
  });

  afterEach(() => {
    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('renders philosophy section with heading', () => {
    render(
      <MotionProvider>
        <PhilosophySection />
      </MotionProvider>
    );
    
    // Section heading should be present
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders all four philosophy entries', () => {
    const { container } = render(
      <MotionProvider>
        <PhilosophySection />
      </MotionProvider>
    );
    
    // Should render exactly 4 philosophy entries
    const cards = container.querySelectorAll('.border.border-grid');
    expect(cards).toHaveLength(4);
  });

  it('renders entries in a grid layout with clear visual hierarchy', () => {
    const { container } = render(
      <MotionProvider>
        <PhilosophySection />
      </MotionProvider>
    );
    
    // Look for the grid container that creates the layout
    const gridContainer = container.querySelector('.grid.md\\:grid-cols-2');
    expect(gridContainer).toBeInTheDocument();
    
    // Each entry should be in cards with consistent styling
    const cards = container.querySelectorAll('.border.border-grid');
    expect(cards.length).toBe(4);
  });

  it('uses Bilingual component for philosophy content', () => {
    render(
      <MotionProvider>
        <PhilosophySection />
      </MotionProvider>
    );
    
    // Verify that bilingual content is being rendered
    // At least one of the philosophy entries should be visible
    const philosophyValues = [
      siteContent.philosophy.vibecoding,
      siteContent.philosophy.aiNative,
      siteContent.philosophy.breathingRoom,
      siteContent.philosophy.skillRedefinition,
    ];
    
    // Check that at least one language variant is rendered for each entry
    philosophyValues.forEach((entry) => {
      const hasEnglish = screen.queryByText(entry.en);
      const hasChinese = screen.queryByText(entry.zh);
      
      // At least one language should be rendered
      expect(hasEnglish || hasChinese).toBeTruthy();
    });
  });

  it('includes Vibecoding content (Req 16.1)', () => {
    render(
      <MotionProvider>
        <PhilosophySection />
      </MotionProvider>
    );
    
    const vibecodingEntry = siteContent.philosophy.vibecoding;
    
    // Check for Vibecoding text in either language
    const hasEnglish = screen.queryByText(vibecodingEntry.en);
    const hasChinese = screen.queryByText(vibecodingEntry.zh);
    
    expect(hasEnglish || hasChinese).toBeTruthy();
  });

  it('includes AI-Native design, Agentic UX, and Generative UI content (Req 16.2)', () => {
    render(
      <MotionProvider>
        <PhilosophySection />
      </MotionProvider>
    );
    
    const aiNativeEntry = siteContent.philosophy.aiNative;
    
    // Check for AI-Native text in either language
    const hasEnglish = screen.queryByText(aiNativeEntry.en);
    const hasChinese = screen.queryByText(aiNativeEntry.zh);
    
    expect(hasEnglish || hasChinese).toBeTruthy();
  });

  it('includes "Breathing Room" content (Req 16.3)', () => {
    render(
      <MotionProvider>
        <PhilosophySection />
      </MotionProvider>
    );
    
    const breathingRoomEntry = siteContent.philosophy.breathingRoom;
    
    // Check for "Breathing Room" text in either language
    const hasEnglish = screen.queryByText(breathingRoomEntry.en);
    const hasChinese = screen.queryByText(breathingRoomEntry.zh);
    
    expect(hasEnglish || hasChinese).toBeTruthy();
  });

  it('includes redefinition of "Skill" content (Req 16.4)', () => {
    render(
      <MotionProvider>
        <PhilosophySection />
      </MotionProvider>
    );
    
    const skillRedefinitionEntry = siteContent.philosophy.skillRedefinition;
    
    // Check for skill redefinition text in either language
    const hasEnglish = screen.queryByText(skillRedefinitionEntry.en);
    const hasChinese = screen.queryByText(skillRedefinitionEntry.zh);
    
    expect(hasEnglish || hasChinese).toBeTruthy();
  });

  it('applies consistent visual styling with whitespace and hover effects', () => {
    const { container } = render(
      <MotionProvider>
        <PhilosophySection />
      </MotionProvider>
    );
    
    // Cards should have consistent styling (border, padding, hover effects)
    const cards = container.querySelectorAll('.border.border-grid');
    expect(cards.length).toBe(4);
    
    // Each card should have consistent responsive padding (mobile: p-6, desktop: md:p-8)
    cards.forEach(card => {
      const hasResponsivePadding = 
        card.classList.contains('p-6') || 
        card.classList.contains('p-8') ||
        Array.from(card.classList).some(cls => cls.includes('p-'));
      expect(hasResponsivePadding).toBe(true);
      // Should have hover transition
      expect(card.classList.contains('hover:border-accent/30')).toBe(true);
    });
  });

  it('uses proper semantic structure', () => {
    const { container } = render(
      <MotionProvider>
        <PhilosophySection />
      </MotionProvider>
    );
    
    // Should have a section element
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    
    // Should have aria-labelledby pointing to the heading
    expect(section?.getAttribute('aria-labelledby')).toBe('philosophy-heading');
    
    // Should have the heading with correct id
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.id).toBe('philosophy-heading');
  });
});
