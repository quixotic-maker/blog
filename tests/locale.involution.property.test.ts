// Feature: personal-brand-website, Property 7: Locale toggle is an involution over two languages
//
// Property-based test targeting the pure Locale System in `lib/locale.ts`.
// For any locale, applying `toggleLocale` twice returns the original locale
// (it is an involution over the two languages), and applying it once always
// returns the other supported language.
//
// Validates: Requirements 3.3
import { describe, it } from 'vitest';
import fc from 'fast-check';
import { toggleLocale, type Locale } from '../lib/locale';

// Generator over the supported Locale union.
const localeArb: fc.Arbitrary<Locale> = fc.constantFrom<Locale>('zh', 'en');

describe('Property 7: Locale toggle is an involution over two languages', () => {
  it('returns the original locale when applied twice', () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        return toggleLocale(toggleLocale(locale)) === locale;
      }),
      { numRuns: 200 },
    );
  });

  it('always returns the other supported language when applied once', () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const toggled = toggleLocale(locale);
        // The result must differ from the input and remain a supported locale.
        return toggled !== locale && (toggled === 'zh' || toggled === 'en');
      }),
      { numRuns: 200 },
    );
  });
});
