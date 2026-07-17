// Feature: personal-brand-website, Property 3: Reduced motion zeroes parallax
//
// For any pointer position, scroll progress, and depth index, when reduced
// motion is active, both `layerOffset` and `scrollOffset` return a zero vector
// {x: 0, y: 0}.
// Validates: Requirements 5.6, 21.2
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { layerOffset, scrollOffset, type Vec2 } from '@/lib/parallax';

const NUM_RUNS = 100;

// Generate finite floating-point numbers spanning the plausible input space
// (negative, zero, positive, fractional) without NaN/Infinity noise.
const finite = fc.double({ noNaN: true, noDefaultInfinity: true });

const pointer: fc.Arbitrary<Vec2> = fc.record({ x: finite, y: finite });

describe('Property 3: Reduced motion zeroes parallax', () => {
  it('layerOffset returns a zero vector for any pointer/depth when reduced', () => {
    fc.assert(
      fc.property(pointer, finite, finite, (pt, depthIndex, maxDepth) => {
        const offset = layerOffset(pt, depthIndex, maxDepth, true);
        expect(offset).toEqual({ x: 0, y: 0 });
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('scrollOffset returns a zero vector for any progress/depth when reduced', () => {
    fc.assert(
      fc.property(finite, finite, finite, (progress, depthIndex, maxDepth) => {
        const offset = scrollOffset(progress, depthIndex, maxDepth, true);
        expect(offset).toEqual({ x: 0, y: 0 });
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
