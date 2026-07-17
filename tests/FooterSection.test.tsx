// Unit test for FooterSection — verifies the component renders the signature
// sign-off, positioning statement, and contact links with correct styling.
//
// Requirements tested:
// - Req 17.1: displays signature "quixoticmaker — Yiheng Liu" (ONLY place real name appears)
// - Req 17.2: displays AI Product Manager positioning
// - Req 17.3: displays GitHub/LinkedIn/Email contact links
// - Req 17.4: link color changes from gray to amber on hover
// - Req 17.5: links open with rel="noopener noreferrer"

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FooterSection } from '@/components/sections/FooterSection';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { siteContent } from '@/content/site';

describe('FooterSection', () => {
  it('renders the signature sign-off "quixoticmaker — Yiheng Liu" (Req 17.1)', () => {
    render(
      <LocaleProvider>
        <FooterSection />
      </LocaleProvider>
    );
    
    // The signature should be present — this is the ONLY place the real name appears
    expect(screen.getByText(siteContent.footer.signature)).toBeInTheDocument();
    expect(screen.getByText('quixoticmaker — Yiheng Liu')).toBeInTheDocument();
  });

  it('renders the AI PM positioning statement (Req 17.2)', () => {
    render(
      <LocaleProvider>
        <FooterSection />
      </LocaleProvider>
    );
    
    // The positioning statement should be present in at least one language
    const hasEnglish = screen.queryByText(siteContent.footer.positioning.en);
    const hasChinese = screen.queryByText(siteContent.footer.positioning.zh);
    
    expect(hasEnglish || hasChinese).toBeTruthy();
  });

  it('renders all contact links: GitHub, LinkedIn, Email (Req 17.3)', () => {
    render(
      <LocaleProvider>
        <FooterSection />
      </LocaleProvider>
    );
    
    // All three contact links should be present
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    
    // Verify each link kind is present
    siteContent.footer.links.forEach((link) => {
      const linkElement = screen.getByRole('link', { name: new RegExp(link.kind, 'i') });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', link.href);
    });
  });

  it('opens links in new tab with rel="noopener noreferrer" (Req 17.5)', () => {
    render(
      <LocaleProvider>
        <FooterSection />
      </LocaleProvider>
    );
    
    const links = screen.getAllByRole('link');
    
    // All links should open in new tab with security attributes
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('applies hover styles: gray to amber transition (Req 17.4)', () => {
    const { container } = render(
      <LocaleProvider>
        <FooterSection />
      </LocaleProvider>
    );
    
    const links = container.querySelectorAll('a');
    
    // Each link should have the gray→amber hover classes
    links.forEach((link) => {
      expect(link.classList.contains('text-gray')).toBe(true);
      expect(link.classList.contains('hover:text-accent')).toBe(true);
      expect(link.classList.contains('transition-colors')).toBe(true);
    });
  });

  it('uses generous whitespace and clear visual hierarchy', () => {
    const { container } = render(
      <LocaleProvider>
        <FooterSection />
      </LocaleProvider>
    );
    
    // Footer should have generous responsive padding
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    // Check for responsive padding classes: py-12 md:py-16 lg:py-24
    const hasResponsivePadding = 
      footer?.classList.contains('py-12') || 
      footer?.classList.contains('py-16') || 
      footer?.classList.contains('py-24') ||
      Array.from(footer?.classList || []).some(cls => cls.includes('py-'));
    expect(hasResponsivePadding).toBe(true);
    
    // Content should be centered with proper spacing
    const maxWidthContainer = footer?.querySelector('.max-w-7xl');
    expect(maxWidthContainer).toBeInTheDocument();
  });

  it('renders signature with display font and proper hierarchy', () => {
    const { container } = render(
      <LocaleProvider>
        <FooterSection />
      </LocaleProvider>
    );
    
    // Signature should use display font
    const signature = screen.getByText(siteContent.footer.signature);
    expect(signature.classList.contains('font-display')).toBe(true);
    expect(signature.classList.contains('font-bold')).toBe(true);
    expect(signature.classList.contains('text-ink')).toBe(true);
  });

  it('renders positioning with monospace font', () => {
    const { container } = render(
      <LocaleProvider>
        <FooterSection />
      </LocaleProvider>
    );
    
    // Positioning statement should use monospace font
    const positioning = container.querySelector('.font-mono');
    expect(positioning).toBeInTheDocument();
    expect(positioning?.classList.contains('text-gray')).toBe(true);
  });

  it('includes semantic HTML structure with proper ARIA labels', () => {
    render(
      <LocaleProvider>
        <FooterSection />
      </LocaleProvider>
    );
    
    // Should use footer element
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    
    // Should have navigation for contact links
    const nav = screen.getByRole('navigation', { name: /contact links/i });
    expect(nav).toBeInTheDocument();
  });

  it('renders all three expected contact links with correct hrefs', () => {
    render(
      <LocaleProvider>
        <FooterSection />
      </LocaleProvider>
    );
    
    // GitHub link
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/quixoticmaker');
    
    // LinkedIn link
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/yiheng-liu');
    
    // Email link
    const emailLink = screen.getByRole('link', { name: /email|邮箱/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:hello@quixoticmaker.com');
  });
});
