// Feature: personal-brand-website, Property 2: Parallax offset magnitude increases with depth
//
// For any two depth layers where layer A has a smaller depth index than layer B
// (same pointer and max depth, reduced motion off), the offset magnitude produced
// for the background-most layer is less than or equal to that of the
// foreground-most layer — the background moves least and the foreground tracks
// the pointer most.
//
// Validates: Requirements 5.2
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { layerOffset, type Vec2 } from '@/lib/parallax';

/** Per-axis magnitude of the offset vector. */
function axisMagnitudes(v: Vec2): { x: number; y: number } {
  return { x: Math.abs(v.x), y: Math.abs(v.y) };
}

describe('Property 2: parallax offset magnitude increases with depth', () => {
  it('background-most layer offset magnitude <= foreground-most layer offset magnitude', () => {
    fc.assert(
      fc.property(
        // A pointer position (any finite coordinates).
        fc.record({
          x: fc.double({ min: -5000, max: 5000, noNaN: true }),
          y: fc.double({ min: -5000, max: 5000, noNaN: true }),
        }),
        // maxDepth: index of the foreground-most layer (positive).
        fc.integer({ min: 1, max: 8 }),
        // Two depth indices; we order them so depthA <= depthB.
        fc.integer({ min: 0, max: 8 }),
        fc.integer({ min: 0, max: 8 }),
        (pointer, maxDepth, d0, d1) => {
          const depthA = Math.min(d0, d1); // background-most (smaller index)
          const depthB = Math.max(d0, d1); // foreground-most (larger index)

          const offsetA = layerOffset(pointer, depthA, maxDepth, false);
          const offsetB = layerOffset(pointer, depthB, maxDepth, false);

          const magA = axisMagnitudes(offsetA);
          const magB = axisMagnitudes(offsetB);

          // The background-most layer must move no more than the foreground-most,
          // on each axis.
          expect(magA.x).toBeLessThanOrEqual(magB.x);
          expect(magA.y).toBeLessThanOrEqual(magB.y);
        },
      ),
      { numRuns: 200 },
    );
  });
});
