'use client';

import { siteContent } from '@/content/site';
import { Bilingual } from '@/components/ui/Bilingual';

/**
 * FooterSection is the final Homepage section containing the signature sign-off,
 * positioning statement, and contact links.
 *
 * Requirements:
 * - Req 17.1: display the signature "quixoticmaker — Yiheng Liu" (ONLY place the real name appears)
 * - Req 17.2: display the AI Product Manager positioning
 * - Req 17.3: display GitHub/LinkedIn/Email contact links from `siteContent.footer.links`
 * - Req 17.4: on hover, link color changes from gray to amber accent
 * - Req 17.5: links open their destinations with `rel="noopener noreferrer"` for security
 *
 * The footer is styled with generous whitespace and clear visual hierarchy,
 * serving as the final section on the Homepage.
 */
export function FooterSection() {
  // Map contact link kinds to readable labels (bilingual)
  const linkLabels: Record<string, { en: string; zh: string }> = {
    github: { en: 'GitHub', zh: 'GitHub' },
    linkedin: { en: 'LinkedIn', zh: 'LinkedIn' },
    email: { en: 'Email', zh: '邮箱' },
  };

  return (
    <footer
      className="relative py-12 md:py-16 lg:py-24 px-4 sm:px-6 bg-paper border-t border-grid"
      aria-labelledby="footer-signature"
    >
      <div className="max-w-7xl mx-auto">
        {/* Signature sign-off: "quixoticmaker — Yiheng Liu" (Req 17.1)
            This is the ONLY place the real name appears on the site */}
        <div className="text-center mb-6 md:mb-8">
          <p
            id="footer-signature"
            className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight"
          >
            {siteContent.footer.signature}
          </p>
        </div>

        {/* AI PM positioning statement (Req 17.2) */}
        <div className="text-center mb-8 md:mb-12">
          <p className="font-mono text-sm md:text-base text-gray">
            <Bilingual content={siteContent.footer.positioning} mode="single" />
          </p>
        </div>

        {/* Contact links: GitHub / LinkedIn / Email (Req 17.3)
            Gray → amber hover (Req 17.4)
            rel="noopener noreferrer" for security (Req 17.5)
            Mobile-friendly touch targets (Req 23.3) */}
        <nav
          className="flex flex-wrap items-center justify-center gap-6 md:gap-8"
          aria-label="Contact links"
        >
          {siteContent.footer.links.map((link) => (
            <a
              key={link.kind}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm md:text-base text-gray hover:text-accent transition-colors duration-300 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`Visit ${link.kind}`}
            >
              <Bilingual content={linkLabels[link.kind]} mode="single" />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
