'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { toggleLocale } from '@/lib/locale';

/**
 * LocaleToggle — a UI control (button) that switches the active language.
 *
 * Calls `toggleLocale` to switch to the other language and updates the
 * `LocaleProvider` state. Displays the current locale or a toggle icon.
 * All consumers of the `LocaleProvider` context see the new locale immediately
 * (Req 3.4).
 *
 * Requirements: 3.2, 3.3, 3.4
 */
export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  const handleToggle = () => {
    const newLocale = toggleLocale(locale);
    setLocale(newLocale);
  };

  // Display the *other* language as the button text (what you'll switch *to*)
  const nextLocale = toggleLocale(locale);
  const displayText = nextLocale === 'zh' ? '中文' : 'EN';

  return (
    <button
      onClick={handleToggle}
      className="font-mono text-sm text-gray hover:text-accent transition-colors duration-200 uppercase tracking-wide p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
      aria-label={`Switch to ${nextLocale === 'zh' ? 'Chinese' : 'English'}`}
    >
      {displayText}
    </button>
  );
}
