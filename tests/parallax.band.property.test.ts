// Feature: personal-brand-website, Property 1: Parallax offsets stay within the depth band
//
// Property-based test targeting the pure Parallax_System logic in
// `lib/parallax.ts`. With reduced motion off, the magnitude of each axis of the
// offset returned by `layerOffset` must stay within the inclusive [4, 12] px
// depth band for any pointer position, depth index, and max depth.
//
// Validates: Requirements 5.3
import { describe, it } from 'vitest';
import fc from 'fast-check';
import {
  layerOffset,
  PARALLAX_MIN_OFFSET_PX,
  PARALLAX_MAX_OFFSET_PX,
} from '../lib/parallax';

describe('Property 1: Parallax offsets stay within the depth band', () => {
  it('keeps each axis magnitude within [4, 12] px for any pointer, depth, and maxDepth', () => {
    fc.assert(
      fc.property(
        // Pointer position: any finite double on each axis.
        fc.record({
          x: fc.double({ noNaN: true, noDefaultInfinity: true }),
          y: fc.double({ noNaN: true, noDefaultInfinity: true }),
        }),
        // Depth index and max depth: any finite doubles (the module clamps them).
        fc.double({ noNaN: true, noDefaultInfinity: true }),
        fc.double({ noNaN: true, noDefaultInfinity: true }),
        (pointer, depthIndex, maxDepth) => {
          const offset = layerOffset(pointer, depthIndex, maxDepth, false);

          const magX = Math.abs(offset.x);
          const magY = Math.abs(offset.y);

          return (
            magX >= PARALLAX_MIN_OFFSET_PX &&
            magX <= PARALLAX_MAX_OFFSET_PX &&
            magY >= PARALLAX_MIN_OFFSET_PX &&
            magY <= PARALLAX_MAX_OFFSET_PX
          );
        },
      ),
      { numRuns: 200 },
    );
  });
});
