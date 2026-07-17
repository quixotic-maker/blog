/**
 * Unit tests for Header component (Task 10.2).
 *
 * Verifies:
 * - Req 1.6: wordmark "quixoticmaker" is rendered
 * - Req 1.7: wordmark is positioned (structural assertion)
 * - Req 1.9: bilingual tagline switches with locale
 * - Req 1.8: tab title equals "quixoticmaker" (tested via layout metadata)
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/sections/Header';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { siteContent } from '@/content/site';
import { metadata } from '@/app/layout';

// Wrapper to provide LocaleProvider context
function Wrapper({ children }: { children: React.ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}

describe('Header', () => {
  it('renders the lowercase wordmark "quixoticmaker" (Req 1.6)', () => {
    render(<Header />, { wrapper: Wrapper });
    
    // The wordmark should be present as an h1
    const wordmark = screen.getByRole('heading', { level: 1 });
    expect(wordmark).toHaveTextContent(siteContent.branding.wordmark);
    expect(wordmark).toHaveTextContent('quixoticmaker');
  });

  it('renders the wordmark with lowercase styling (Req 1.7)', () => {
    render(<Header />, { wrapper: Wrapper });
    
    const wordmark = screen.getByRole('heading', { level: 1 });
    // Check that the lowercase class is applied
    expect(wordmark.className).toContain('lowercase');
  });

  it('renders the bilingual tagline in Chinese by default (Req 1.9)', () => {
    render(<Header />, { wrapper: Wrapper });
    
    // Default locale is 'zh', so Chinese tagline should be shown
    const tagline = screen.getByText(siteContent.branding.tagline.zh);
    expect(tagline).toBeInTheDocument();
    expect(tagline.className).toContain('font-mono');
  });

  it('includes the LocaleToggle control', () => {
    render(<Header />, { wrapper: Wrapper });
    
    // The LocaleToggle should be present as a button
    const toggle = screen.getByRole('button', { name: /switch to/i });
    expect(toggle).toBeInTheDocument();
  });

  it('switches bilingual tagline when locale changes (Req 1.9)', () => {
    render(<Header />, { wrapper: Wrapper });
    
    // Initially Chinese tagline should be shown (default locale is 'zh')
    expect(screen.getByText(siteContent.branding.tagline.zh)).toBeInTheDocument();
    expect(screen.queryByText(siteContent.branding.tagline.en)).not.toBeInTheDocument();
    
    // Click the locale toggle to switch to English
    const toggle = screen.getByRole('button', { name: /switch to/i });
    fireEvent.click(toggle);
    
    // Now English tagline should be shown
    expect(screen.getByText(siteContent.branding.tagline.en)).toBeInTheDocument();
    expect(screen.queryByText(siteContent.branding.tagline.zh)).not.toBeInTheDocument();
  });

  it('has proper semantic structure for accessibility', () => {
    render(<Header />, { wrapper: Wrapper });
    
    // Should have header landmark
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Should have h1 heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});

describe('Layout Metadata', () => {
  it('sets tab title to "quixoticmaker" (Req 1.8)', () => {
    // The browser tab title is set via Next.js metadata export in app/layout.tsx
    expect(metadata.title).toBe('quixoticmaker');
  });
});
