// Unit test for ExperienceSection — verifies the component renders experience
// entries as parallel, equal-weight peer items with no time axis.
//
// Requirements tested:
// - Req 15.1: renders BAAI internship entry
// - Req 15.2: renders competition team lead entry
// - Req 15.3: presents entries as parallel peer items (two-column layout)

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { siteContent } from '@/content/site';

describe('ExperienceSection', () => {
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

  it('renders experience entries from siteContent', () => {
    render(
      <MotionProvider>
        <ExperienceSection />
      </MotionProvider>
    );
    
    // Section heading should be present
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders both experience entries (BAAI and competition team lead)', () => {
    render(
      <MotionProvider>
        <ExperienceSection />
      </MotionProvider>
    );
    
    // Should render exactly 2 experience entries
    const entries = screen.getAllByRole('heading', { level: 3 });
    expect(entries).toHaveLength(2);
  });

  it('renders entries in a parallel layout (no timeline/chronological emphasis)', () => {
    const { container } = render(
      <MotionProvider>
        <ExperienceSection />
      </MotionProvider>
    );
    
    // Look for the grid container that creates the two-column layout
    const gridContainer = container.querySelector('.grid.lg\\:grid-cols-2');
    expect(gridContainer).toBeInTheDocument();
    
    // Each entry should be in equal-height cards
    const cards = container.querySelectorAll('.h-full');
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });

  it('uses Bilingual component for titles and details', () => {
    const { container } = render(
      <MotionProvider>
        <ExperienceSection />
      </MotionProvider>
    );
    
    // Verify that bilingual content is being rendered
    // The component should render content based on the active locale
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.length).toBe(2);
    
    // Verify the structure includes both title and detail for each entry
    siteContent.experience.forEach((entry) => {
      // At least one of the bilingual variants (en or zh) should be in the document
      const hasEnglishTitle = screen.queryByText(entry.title.en);
      const hasChineseTitle = screen.queryByText(entry.title.zh);
      const hasEnglishDetail = screen.queryByText(entry.detail.en);
      const hasChineseDetail = screen.queryByText(entry.detail.zh);
      
      // At least one language should be rendered for each entry
      expect(
        hasEnglishTitle || hasChineseTitle
      ).toBeTruthy();
      expect(
        hasEnglishDetail || hasChineseDetail
      ).toBeTruthy();
    });
  });

  it('applies visual styling that emphasizes peer/equal-weight relationship', () => {
    const { container } = render(
      <MotionProvider>
        <ExperienceSection />
      </MotionProvider>
    );
    
    // Cards should have equal styling (border, padding, hover effects)
    const cards = container.querySelectorAll('.border.border-grid');
    expect(cards.length).toBe(2);
    
    // Each card should have consistent responsive padding (mobile: p-6, desktop: md:p-8)
    cards.forEach(card => {
      const hasResponsivePadding = 
        card.classList.contains('p-6') || 
        card.classList.contains('p-8') ||
        Array.from(card.classList).some(cls => cls.includes('p-'));
      expect(hasResponsivePadding).toBe(true);
    });
  });

  it('includes BAAI internship content (Req 15.1)', () => {
    render(
      <MotionProvider>
        <ExperienceSection />
      </MotionProvider>
    );
    
    const baaiEntry = siteContent.experience[0];
    
    // Check for BAAI-related text in either language
    const hasEnglish = screen.queryByText(baaiEntry.title.en);
    const hasChinese = screen.queryByText(baaiEntry.title.zh);
    
    expect(hasEnglish || hasChinese).toBeTruthy();
  });

  it('includes competition team lead content (Req 15.2)', () => {
    render(
      <MotionProvider>
        <ExperienceSection />
      </MotionProvider>
    );
    
    const competitionEntry = siteContent.experience[1];
    
    // Check for competition team lead text in either language
    const hasEnglish = screen.queryByText(competitionEntry.title.en);
    const hasChinese = screen.queryByText(competitionEntry.title.zh);
    
    expect(hasEnglish || hasChinese).toBeTruthy();
  });
});
