// Feature: personal-brand-website, Property 5: Reduced motion collapses every intent to fade or static
//
// Property-based test targeting the pure Motion_System resolver in
// `lib/motion.ts`. When reduced motion is active, `resolveMotion` must collapse
// every semantic motion intent to a `kind` of either 'fade' or 'static' and
// never 'align'.
//
// Validates: Requirements 21.2, 4.6, 6.6, 11.5, 18.4, 19.5
import { describe, it } from 'vitest';
import fc from 'fast-check';
import { resolveMotion, type MotionIntent } from '../lib/motion';

// Generator over the full MotionIntent union.
const motionIntentArb: fc.Arbitrary<MotionIntent> = fc.constantFrom<MotionIntent>(
  'sectionEnter',
  'stagger',
  'counter',
  'parallax',
  'dataThread',
  'sharedElement',
  'loading',
);

describe('Property 5: Reduced motion collapses every intent to fade or static', () => {
  it("returns kind 'fade' or 'static' (never 'align') for any intent under reduced motion", () => {
    fc.assert(
      fc.property(motionIntentArb, (intent) => {
        const resolved = resolveMotion(intent, true);
        return resolved.kind === 'fade' || resolved.kind === 'static';
      }),
      { numRuns: 200 },
    );
  });
});
