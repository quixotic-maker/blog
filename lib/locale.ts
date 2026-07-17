// Locale System — pure, framework-free logic (design: "Locale System").
//
// This module owns the two-language model and the pure functions the
// LocaleProvider / Bilingual components consume. It is deliberately
// self-contained (no React, no imports) so it can be unit- and
// property-tested in isolation.
//
// `Locale` and `Bilingual` are defined and exported here; `lib/contentSchema.ts`
// re-exports/aligns with these definitions rather than duplicating them.

/** The supported display languages of the Website (Req 3.1). */
export type Locale = 'zh' | 'en';

/**
 * A piece of primary content carried in both languages so it can switch
 * consistently site-wide (Req 3.1, 3.4, 3.5). Defaults to `string`, but any
 * paired value (e.g. structured content) is allowed.
 */
export type Bilingual<T = string> = { zh: T; en: T };

/**
 * Pure switch to the other supported language (Req 3.3).
 *
 * Applying `toggleLocale` twice returns the original locale (it is an
 * involution over the two languages), and applying it once always returns the
 * language that is not `current`.
 */
export function toggleLocale(current: Locale): Locale {
  return current === 'zh' ? 'en' : 'zh';
}

/**
 * Return the field for the active locale from a bilingual entry (Req 3.4).
 *
 * This is the single point where the active `Locale` selects which language of
 * a `Bilingual<T>` entry is rendered, keeping locale resolution deterministic
 * and testable.
 */
export function resolveContent<T>(entry: Bilingual<T>, locale: Locale): T {
  return entry[locale];
}
