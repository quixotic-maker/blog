// Feature: personal-brand-website, Property 6: Counter output is monotonic and terminates at the target
//
// Property-based test targeting the pure MechanicalCounter logic in
// `lib/counter.ts`. For any non-negative target value and any non-decreasing
// sequence of progress values in [0, 1], `counterValue` must produce a
// non-decreasing sequence of displayed values, and `counterValue(target, 1)`
// must equal the target exactly.
//
// The counter counts up from 0, so the "non-decreasing" invariant holds for
// non-negative targets (the real headline numbers this drives), so the target
// generator is constrained to realistic non-negative values.
//
// Validates: Requirements 11.4
import { describe, it } from 'vitest';
import fc from 'fast-check';
import { counterValue } from '../lib/counter';

describe('Property 6: Counter output is monotonic and terminates at the target', () => {
  it('produces a non-decreasing displayed sequence for a non-decreasing progress sequence', () => {
    fc.assert(
      fc.property(
        // Realistic non-negative headline target.
        fc.double({ min: 0, max: 1_000_000, noNaN: true, noDefaultInfinity: true }),
        // A sequence of progress values in [0, 1]; sorted ascending below so the
        // sequence is non-decreasing, matching the animation's forward playback.
        fc.array(
          fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true }),
          { minLength: 1, maxLength: 50 },
        ),
        (target, rawProgress) => {
          const progress = [...rawProgress].sort((a, b) => a - b);

          let previous = counterValue(target, progress[0]);
          for (let i = 1; i < progress.length; i += 1) {
            const current = counterValue(target, progress[i]);
            if (current < previous) {
              return false;
            }
            previous = current;
          }
          return true;
        },
      ),
      { numRuns: 200 },
    );
  });

  it('terminates exactly at the target when progress reaches 1', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1_000_000, noNaN: true, noDefaultInfinity: true }),
        (target) => counterValue(target, 1) === target,
      ),
      { numRuns: 200 },
    );
  });
});
