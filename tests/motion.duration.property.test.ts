// Feature: personal-brand-website, Property 4: Non-reduced motion durations fall in the specified bands
//
// Property-based test targeting the pure Motion_System resolver in
// `lib/motion.ts`. With reduced motion off, `resolveMotion` must return a
// `durationMs` within the band required for the intent (loading 800–1200ms;
// all other section/element transitions 400–600ms) and, where a stagger
// applies, a `staggerMs` within 50–100ms.
//
// Validates: Requirements 20.1, 20.2, 4.4
import { describe, it } from 'vitest';
import fc from 'fast-check';
import { resolveMotion, type MotionIntent } from '../lib/motion';

const MOTION_INTENTS: readonly MotionIntent[] = [
  'sectionEnter',
  'stagger',
  'counter',
  'parallax',
  'dataThread',
  'sharedElement',
  'loading',
];

// Section/element transition band (Req 20.1).
const SECTION_MIN_MS = 400;
const SECTION_MAX_MS = 600;
// Loading band (Req 4.4).
const LOADING_MIN_MS = 800;
const LOADING_MAX_MS = 1200;
// Stagger offset band (Req 20.2).
const STAGGER_MIN_MS = 50;
const STAGGER_MAX_MS = 100;

describe('Property 4: Non-reduced motion durations fall in the specified bands', () => {
  it('returns durationMs (and staggerMs where present) within the required bands for any intent', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<MotionIntent>(...MOTION_INTENTS),
        (intent) => {
          const resolved = resolveMotion(intent, false);

          // Duration must fall in the intent's band.
          if (intent === 'loading') {
            if (
              resolved.durationMs < LOADING_MIN_MS ||
              resolved.durationMs > LOADING_MAX_MS
            ) {
              return false;
            }
          } else if (
            resolved.durationMs < SECTION_MIN_MS ||
            resolved.durationMs > SECTION_MAX_MS
          ) {
            return false;
          }

          // Where a stagger applies, it must fall in the 50–100ms band.
          if (resolved.staggerMs !== undefined) {
            if (
              resolved.staggerMs < STAGGER_MIN_MS ||
              resolved.staggerMs > STAGGER_MAX_MS
            ) {
              return false;
            }
          }

          return true;
        },
      ),
      { numRuns: 200 },
    );
  });
});
