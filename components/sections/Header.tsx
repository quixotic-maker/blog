'use client';

import Link from 'next/link';
import { useLocale } from '@/components/providers/LocaleProvider';
import { LocaleToggle } from '@/components/ui/LocaleToggle';
import { siteContent } from '@/content/site';
import { resolveContent } from '@/lib/locale';

/**
 * Header renders the persistent top header with the lowercase "quixoticmaker"
 * wordmark (top-left), the bilingual sub-positioning tagline, and the LocaleToggle.
 *
 * Requirements:
 * - Req 1.6: use the Wordmark "quixoticmaker" as the site brand name
 * - Req 1.7: display the Wordmark in the top-left of the header
 * - Req 1.9: display the bilingual sub-positioning tagline:
 *   - en: "AI PM · Hardware-AI Integration"
 *   - zh: "软硬一体 · 多智能体协同"
 * - Req 3.2: include the LocaleToggle control for switching Language_Mode
 *
 * The wordmark is lowercase and positioned top-left. The real name "Yiheng Liu"
 * appears only in the footer sign-off, not here (Req 1.6, 17.1).
 */
export function Header() {
  const { locale } = useLocale();

  // Resolve the bilingual tagline for the active locale
  const tagline = resolveContent(siteContent.branding.tagline, locale);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
        {/* Left side: wordmark (clickable → home) + tagline */}
        <Link href="/" className="flex flex-col gap-1 min-w-0 group" aria-label="Back to home">
          {/* Wordmark: lowercase "quixoticmaker" (Req 1.6, 1.7) */}
          <h1 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight lowercase truncate group-hover:text-accent transition-colors duration-200">
            {siteContent.branding.wordmark}
          </h1>

          {/* Bilingual sub-positioning tagline (Req 1.9) - hide on very small screens */}
          <p className="font-mono text-xs text-gray tracking-wide hidden sm:block">
            {tagline}
          </p>
        </Link>

        {/* Right side: LocaleToggle (Req 3.2) */}
        <LocaleToggle />
      </div>
    </header>
  );
}
