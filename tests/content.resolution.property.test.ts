// Feature: personal-brand-website, Property 8: Content resolution always yields the active-locale field
//
// Property-based test targeting the pure `resolveContent` function in
// `lib/locale.ts` and the bilingual parity of the authored content. The
// property: for any bilingual content entry and any locale, `resolveContent`
// returns exactly that locale's field, and for every primary content entry both
// the `zh` and `en` fields are present and non-empty (bilingual parity).
//
// Validates: Requirements 3.1, 3.4, 3.5
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { resolveContent, type Locale, type Bilingual } from '../lib/locale';
import { siteContent } from '../content/site';
import { projectsMeta } from '../content/projectsMeta';

// Generator over the supported Locale union.
const localeArb: fc.Arbitrary<Locale> = fc.constantFrom<Locale>('zh', 'en');

// Generator for arbitrary bilingual entries with non-empty string values.
const bilingualStringArb: fc.Arbitrary<Bilingual<string>> = fc.record({
  zh: fc.string({ minLength: 1 }),
  en: fc.string({ minLength: 1 }),
});

// Generator for arbitrary bilingual entries with any type T.
function bilingualArb<T>(valueArb: fc.Arbitrary<T>): fc.Arbitrary<Bilingual<T>> {
  return fc.record({
    zh: valueArb,
    en: valueArb,
  });
}

describe('Property 8: Content resolution always yields the active-locale field', () => {
  it('resolveContent returns exactly the active-locale field for arbitrary bilingual entries', () => {
    fc.assert(
      fc.property(
        bilingualStringArb,
        localeArb,
        (entry, locale) => {
          const resolved = resolveContent(entry, locale);
          return resolved === entry[locale];
        },
      ),
      { numRuns: 100 },
    );
  });

  it('resolveContent works for bilingual entries with structured content', () => {
    // Test with numbers
    fc.assert(
      fc.property(
        bilingualArb(fc.integer()),
        localeArb,
        (entry, locale) => {
          const resolved = resolveContent(entry, locale);
          return resolved === entry[locale];
        },
      ),
      { numRuns: 100 },
    );

    // Test with objects
    fc.assert(
      fc.property(
        bilingualArb(fc.record({ value: fc.string(), count: fc.integer() })),
        localeArb,
        (entry, locale) => {
          const resolved = resolveContent(entry, locale);
          return resolved === entry[locale];
        },
      ),
      { numRuns: 100 },
    );
  });

  it('all primary content in siteContent has bilingual parity (non-empty zh and en fields)', () => {
    // Helper to check bilingual parity
    const checkBilingual = (entry: Bilingual, path: string): void => {
      expect(entry.zh, `${path}.zh should be non-empty`).toBeTruthy();
      expect(entry.en, `${path}.en should be non-empty`).toBeTruthy();
      expect(
        typeof entry.zh === 'string' ? entry.zh.trim().length : true,
        `${path}.zh should be non-empty after trim`,
      ).toBeGreaterThan(0);
      expect(
        typeof entry.en === 'string' ? entry.en.trim().length : true,
        `${path}.en should be non-empty after trim`,
      ).toBeGreaterThan(0);
    };

    // Branding
    checkBilingual(siteContent.branding.tagline, 'branding.tagline');

    // Hero
    checkBilingual(siteContent.hero.positioning, 'hero.positioning');
    checkBilingual(siteContent.hero.capability, 'hero.capability');
    checkBilingual(siteContent.hero.subtitle, 'hero.subtitle');

    // Data anchors
    siteContent.dataAnchors.forEach((anchor, i) => {
      checkBilingual(anchor.label, `dataAnchors[${i}].label`);
    });

    // Experience
    siteContent.experience.forEach((entry, i) => {
      checkBilingual(entry.title, `experience[${i}].title`);
      checkBilingual(entry.detail, `experience[${i}].detail`);
    });

    // Philosophy
    checkBilingual(siteContent.philosophy.vibecoding, 'philosophy.vibecoding');
    checkBilingual(siteContent.philosophy.aiNative, 'philosophy.aiNative');
    checkBilingual(
      siteContent.philosophy.breathingRoom,
      'philosophy.breathingRoom',
    );
    checkBilingual(
      siteContent.philosophy.skillRedefinition,
      'philosophy.skillRedefinition',
    );

    // Footer
    checkBilingual(siteContent.footer.positioning, 'footer.positioning');

    // Chapters
    siteContent.chapters.forEach((chapter, i) => {
      checkBilingual(chapter, `chapters[${i}]`);
    });
  });

  it('all primary content in projectsMeta has bilingual parity (non-empty zh and en fields)', () => {
    // Helper to check bilingual parity
    const checkBilingual = (entry: Bilingual, path: string): void => {
      expect(entry.zh, `${path}.zh should be non-empty`).toBeTruthy();
      expect(entry.en, `${path}.en should be non-empty`).toBeTruthy();
      expect(
        typeof entry.zh === 'string' ? entry.zh.trim().length : true,
        `${path}.zh should be non-empty after trim`,
      ).toBeGreaterThan(0);
      expect(
        typeof entry.en === 'string' ? entry.en.trim().length : true,
        `${path}.en should be non-empty after trim`,
      ).toBeGreaterThan(0);
    };

    projectsMeta.forEach((project) => {
      checkBilingual(project.name, `projects.${project.id}.name`);
      checkBilingual(project.tagline, `projects.${project.id}.tagline`);

      project.previewMetrics.forEach((metric, i) => {
        checkBilingual(
          metric.label,
          `projects.${project.id}.previewMetrics[${i}].label`,
        );
      });
    });
  });

  it('resolveContent produces consistent results across locales for real content', () => {
    // Test with actual content from the site
    const zhResult = resolveContent(siteContent.hero.positioning, 'zh');
    const enResult = resolveContent(siteContent.hero.positioning, 'en');

    expect(zhResult).toBe(siteContent.hero.positioning.zh);
    expect(enResult).toBe(siteContent.hero.positioning.en);
    expect(zhResult).not.toBe(enResult); // Different languages should produce different content
  });
});
