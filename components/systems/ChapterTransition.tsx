// ChapterTransition component — renders bilingual chapter-intro phrases between
// Homepage sections as magazine-style section dividers.
//
// This component accepts a ChapterPhrase prop from content/chapters.ts (or
// content/site.ts) and displays the bilingual chapter-intro phrase using the
// Bilingual component from task 8.3. The phrases are interleaved between
// Homepage sections in the fixed ordered sequence (Req 6.5): Hero → Jarvis →
// My Heart → ARF.
//
// Requirements:
// - Req 6.4: display bilingual Chapter_Transition phrase between sections
// - Req 6.5: sequence phrases in fixed order (Hero, Jarvis, My Heart, ARF)
//
// Styling: large type, centered, generous whitespace, styled as a section
// divider / magazine chapter heading.

'use client';

import { Bilingual } from '@/components/ui/Bilingual';
import type { ChapterPhrase } from '@/lib/contentSchema';

interface ChapterTransitionProps {
  /** The bilingual chapter phrase from content/chapters.ts or content/site.ts */
  phrase: ChapterPhrase;
  /**
   * Optional className for additional styling
   */
  className?: string;
}

/**
 * ChapterTransition renders a bilingual chapter-intro phrase between Homepage
 * sections as a magazine-style section divider.
 *
 * The phrases are displayed in editorial paired mode (both languages visible)
 * with large typography, centered alignment, and generous whitespace to act as
 * visual chapter markers that guide the visitor through the narrative arc:
 * semantic understanding → agent orchestration → physical world → robot unification.
 *
 * Requirements: 6.4 (display chapter phrase), 6.5 (fixed ordered sequence)
 */
export function ChapterTransition({
  phrase,
  className = '',
}: ChapterTransitionProps) {
  return (
    <section
      className={`
        relative
        flex
        flex-col
        items-center
        justify-center
        py-16
        md:py-24
        ${className}
      `.trim()}
      aria-label="Chapter transition"
    >
      <Bilingual
        content={phrase}
        mode="paired"
        className="
          flex
          flex-col
          items-center
          gap-3
          text-center
          md:gap-4
        "
        as="div"
      />

      <style jsx>{`
        section :global(.bilingual-zh),
        section :global(.bilingual-en) {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 4vw, 3rem);
          font-weight: var(--fw-bold);
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: var(--color-ink);
        }

        section :global(.bilingual-zh) {
          font-family: var(--font-zh);
        }

        /* Full opacity for readability */
        section :global(.bilingual-zh) {
          opacity: 1;
        }

        section :global(.bilingual-en) {
          opacity: 0.95;
        }

        /* Responsive sizing */
        @media (max-width: 768px) {
          section :global(.bilingual-zh),
          section :global(.bilingual-en) {
            font-size: clamp(1.5rem, 3.5vw, 2rem);
          }
        }
      `}</style>
    </section>
  );
}
