// Bilingual UI component — renders paired zh/en content where editorial
// pairing is required, and single active-locale content elsewhere.
//
// This component is the presentation layer for the locale system (design:
// "Locale System"). It consumes the current locale from `LocaleProvider`
// (task 8.2, concurrent) and uses `resolveContent` from `lib/locale.ts` to
// render the active-locale field.

'use client';

import { type ReactNode } from 'react';
import { type Bilingual as BilingualType, resolveContent } from '@/lib/locale';
import { useLocaleValue } from '@/components/providers/LocaleProvider';

interface BilingualProps {
  /** The bilingual content to render. Can be string or ReactNode. */
  content: BilingualType<string> | BilingualType<ReactNode>;
  
  /** 
   * Mode for rendering bilingual content.
   * - 'single': Render only the active-locale content (default)
   * - 'paired': Render both zh and en content together (editorial pairing, Req 3.5)
   */
  mode?: 'single' | 'paired';
  
  /**
   * Optional className for styling the container when in paired mode
   */
  className?: string;
  
  /**
   * Optional component to wrap each language in paired mode
   */
  as?: 'div' | 'span' | 'p';
}

/**
 * Bilingual component renders bilingual content according to the active locale.
 * 
 * In 'single' mode (default), it uses `resolveContent` to display only the
 * active-locale field.
 * 
 * In 'paired' mode (editorial pairing per Req 3.5), it displays both zh and en
 * content together, useful for sections where both languages should be visible
 * simultaneously.
 * 
 * Requirements: 3.1 (bilingual content), 3.5 (editorial pairing)
 */
export function Bilingual({
  content,
  mode = 'single',
  className,
  as: Component = 'div',
}: BilingualProps) {
  const locale = useLocaleValue();

  if (mode === 'single') {
    // Single-locale mode: render only the active-locale content
    const resolved = resolveContent(content, locale);
    return <>{resolved}</>;
  }

  // Paired mode: render both zh and en content together for editorial pairing
  // This is used where Requirement 3.5 specifies bilingual pairing
  return (
    <Component className={className} data-bilingual-paired>
      <div data-lang="zh" className="bilingual-zh">
        {content.zh}
      </div>
      <div data-lang="en" className="bilingual-en">
        {content.en}
      </div>
    </Component>
  );
}

// Export type for convenience
export type { BilingualType };
