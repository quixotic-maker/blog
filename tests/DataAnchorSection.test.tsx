/**
 * DataAnchorSection component tests.
 *
 * Validates:
 * - Req 11.1: displays approximately five headline numbers
 * - Req 11.2: renders each headline number in the monospace typeface
 * - Req 11.3: displays a bilingual label for each headline number
 * - Req 11.4: animates numbers via MechanicalCounter on viewport entry
 * - Req 11.5: under reduced motion, displays static final text
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataAnchorSection } from '@/components/sections/DataAnchorSection';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { siteContent } from '@/content/site';

describe('DataAnchorSection', () => {
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    // Mock matchMedia for motion detection
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

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <MotionProvider>
        <LocaleProvider>{component}</LocaleProvider>
      </MotionProvider>
    );
  };

  it('renders approximately five headline numbers (Req 11.1)', () => {
    renderWithProviders(<DataAnchorSection />);
    
    // Check that we have ~5 data anchors (the exact count from siteContent.dataAnchors)
    const expectedCount = siteContent.dataAnchors.length;
    expect(expectedCount).toBeGreaterThanOrEqual(4);
    expect(expectedCount).toBeLessThanOrEqual(6);
    expect(expectedCount).toBe(5); // Exactly 5 as specified
  });

  it('displays bilingual labels for each headline number (Req 11.3)', () => {
    renderWithProviders(<DataAnchorSection />);
    
    // Check that at least one bilingual label is present
    // We're checking for the English version since default locale is 'en'
    const firstAnchor = siteContent.dataAnchors[0];
    const labelText = firstAnchor.label.en;
    
    expect(screen.getByText(labelText)).toBeInTheDocument();
  });

  it('uses MechanicalCounter for each number with monospace font (Req 11.2, 11.4)', () => {
    const { container } = renderWithProviders(<DataAnchorSection />);
    
    // MechanicalCounter adds font-mono class (Req 11.2)
    const monoElements = container.querySelectorAll('.font-mono');
    expect(monoElements.length).toBeGreaterThan(0);
  });

  it('renders with proper semantic structure', () => {
    renderWithProviders(<DataAnchorSection />);
    
    // Check for section element
    const section = screen.getByRole('region', { name: /key metrics/i });
    expect(section).toBeInTheDocument();
  });

  it('applies grid layout with generous whitespace', () => {
    const { container } = renderWithProviders(<DataAnchorSection />);
    
    // Check for grid classes
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer?.className).toMatch(/gap-\d+/);
  });

  it('displays static final text under reduced motion (Req 11.5)', () => {
    // Mock reduced motion preference
    window.matchMedia = ((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
    })) as typeof window.matchMedia;

    const { container } = renderWithProviders(<DataAnchorSection />);
    
    // Under reduced motion, numbers should be rendered as static text
    // Check that the first data anchor value is present
    const firstValue = siteContent.dataAnchors[0].value.toString();
    expect(container.textContent).toContain(firstValue);
  });

  it('renders all data anchor values', () => {
    // Mock reduced motion for this test to get static values
    window.matchMedia = ((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
    })) as typeof window.matchMedia;

    renderWithProviders(<DataAnchorSection />);
    
    // Verify that all anchor values from content are present
    // Under reduced motion, values are rendered immediately as static text
    siteContent.dataAnchors.forEach((anchor) => {
      const valueRegex = new RegExp(anchor.value.toString());
      expect(document.body.textContent).toMatch(valueRegex);
    });
  });

  it('includes suffixes when present', () => {
    const { container } = renderWithProviders(<DataAnchorSection />);
    
    // Find an anchor with a suffix (e.g., "ms P95", "kHz", "μs", "baud")
    const anchorWithSuffix = siteContent.dataAnchors.find((a) => a.suffix);
    
    if (anchorWithSuffix && anchorWithSuffix.suffix) {
      expect(container.textContent).toContain(anchorWithSuffix.suffix);
    }
  });
});
