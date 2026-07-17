import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { GridStage } from '@/components/systems/GridStage';
import { Header } from '@/components/sections/Header';
import { PAPER_TEXTURE } from '@/lib/assets';

/**
 * Root layout for the quixoticmaker site.
 *
 * This layout wires the complete application shell:
 * - Req 1.8: the browser tab title is set to the Wordmark "quixoticmaker"
 * - Req 1.6, 1.7, 1.9: Header renders the wordmark top-left with bilingual tagline
 * - Req 3.2: LocaleProvider + Header with LocaleToggle for language switching
 * - Req 21.1: MotionProvider reads prefers-reduced-motion and provides context
 * - Req 7.1: GridStage renders the baseline grid as the layout stage
 *
 * Provider nesting order: MotionProvider → LocaleProvider → content
 * GridStage is rendered as a fixed background layer (z-0)
 * Header is rendered as a fixed top layer (z-50)
 */
export const metadata: Metadata = {
  title: 'quixoticmaker',
  description:
    'AI Product Manager for hardware-AI integration and multi-agent coordination.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body 
        className="bg-paper text-ink antialiased"
        style={{
          // Inject paper texture path from typed constant (Req 22.1, 22.2)
          // CSS will use this via var(--paper-texture-url)
          ['--paper-texture-url' as string]: `url(${PAPER_TEXTURE})`,
        }}
      >
        <MotionProvider>
          <LocaleProvider>
            {/* GridStage: baseline grid as the layout stage behind all content (Req 7.1) */}
            <GridStage />
            
            {/* Header: wordmark + tagline + LocaleToggle (Req 1.6, 1.7, 1.9, 3.2) */}
            <Header />
            
            {/* Main content area with top padding to account for fixed header */}
            <main className="relative z-10 pt-20">
              {children}
            </main>
          </LocaleProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
