// Feature: personal-brand-website
//
// Parallax_System pure logic layer (framework-free, testable).
//
// Realizes the 2.5D depth-layering math described in the design's
// Parallax_System section. Content is organized into 3-4 ordered depth layers
// (`background` -> `mid` -> `foreground`); a layer's `depthIndex` runs from 0
// (background, moves least) to `maxDepth` (foreground, tracks the pointer most).
//
// Invariants encoded here (validated by Properties 1-3):
//   - Pointer-driven per-axis offset magnitude is clamped to the [4, 12] px band
//     and increases monotonically with depth (Req 5.2, 5.3).
//   - Scroll-driven vertical translation is ordered so the background moves the
//     least and the foreground the most (Req 5.4).
//   - Reduced motion zeroes both offsets (Req 5.6, 21.2).

/** A 2D vector of pixel offsets. */
export interface Vec2 {
  x: number;
  y: number;
}

/** Minimum per-axis pointer offset magnitude, in pixels (Req 5.3). */
export const PARALLAX_MIN_OFFSET_PX = 4;

/** Maximum per-axis pointer offset magnitude, in pixels (Req 5.3). */
export const PARALLAX_MAX_OFFSET_PX = 12;

/** Vertical scroll translation for the background-most layer, in pixels. */
export const SCROLL_MIN_SHIFT_PX = 4;

/** Vertical scroll translation for the foreground-most layer, in pixels. */
export const SCROLL_MAX_SHIFT_PX = 24;

const ZERO: Vec2 = { x: 0, y: 0 };

/**
 * Normalized depth position of a layer within the stack.
 *
 * Returns a value in [0, 1] where 0 is the background-most layer and 1 the
 * foreground-most. Guards against a non-positive `maxDepth` (treated as a
 * single background layer) and clamps `depthIndex` into [0, maxDepth] so any
 * input produces a well-defined fraction.
 */
function depthFraction(depthIndex: number, maxDepth: number): number {
  if (!Number.isFinite(depthIndex) || !Number.isFinite(maxDepth) || maxDepth <= 0) {
    return 0;
  }
  const clampedIndex = Math.min(Math.max(depthIndex, 0), maxDepth);
  return clampedIndex / maxDepth;
}

/**
 * The per-axis offset magnitude for a layer, interpolated across the depth band.
 *
 * Background (fraction 0) sits near {@link PARALLAX_MIN_OFFSET_PX} and the
 * foreground (fraction 1) near {@link PARALLAX_MAX_OFFSET_PX}, increasing
 * monotonically with depth.
 */
function bandMagnitude(fraction: number): number {
  return PARALLAX_MIN_OFFSET_PX + (PARALLAX_MAX_OFFSET_PX - PARALLAX_MIN_OFFSET_PX) * fraction;
}

/**
 * Direction sign derived from a pointer component. A zero or positive component
 * shifts positively; a negative component shifts negatively. This keeps each
 * axis magnitude within the [4, 12] band regardless of pointer position.
 */
function directionSign(component: number): number {
  return component < 0 ? -1 : 1;
}

/**
 * Pointer-driven parallax offset for a single depth layer.
 *
 * The magnitude of each axis is fixed by the layer's depth (within the
 * [4, 12] px band and monotonically increasing with `depthIndex`); the pointer
 * position only chooses the direction each axis shifts. When `reduced` is true
 * the offset is zeroed.
 * 
 * When `mobile` is true, offsets are reduced by 50% for subtler parallax effect
 * on mobile devices (Req 23.2: simplify Motion_System animations on mobile).
 *
 * @param pointer    Current pointer position (only the sign of each axis is used).
 * @param depthIndex Layer depth, 0 (background) .. `maxDepth` (foreground).
 * @param maxDepth   Index of the foreground-most layer.
 * @param reduced    Whether reduced-motion mode is active.
 * @param mobile     Whether mobile viewport is active (optional, defaults to false).
 */
export function layerOffset(
  pointer: Vec2,
  depthIndex: number,
  maxDepth: number,
  reduced: boolean,
  mobile: boolean = false,
): Vec2 {
  if (reduced) {
    return { ...ZERO };
  }

  let magnitude = bandMagnitude(depthFraction(depthIndex, maxDepth));
  
  // Mobile simplification: reduce parallax offset by 50% (Req 23.2)
  if (mobile) {
    magnitude *= 0.5;
  }

  return {
    x: directionSign(pointer.x) * magnitude,
    y: directionSign(pointer.y) * magnitude,
  };
}

/**
 * Scroll-driven vertical parallax translation for a single depth layer.
 *
 * Returns a purely vertical translation (`x` is always 0) whose magnitude is
 * ordered so the background layer moves the least and the foreground the most.
 * The translation scales with scroll `progress` (0 -> 1). When `reduced` is
 * true the offset is zeroed.
 * 
 * When `mobile` is true, scroll offsets are reduced by 50% for subtler parallax
 * effect on mobile devices (Req 23.2: simplify Motion_System animations on mobile).
 *
 * @param progress   Global scroll progress, expected in [0, 1] (clamped).
 * @param depthIndex Layer depth, 0 (background) .. `maxDepth` (foreground).
 * @param maxDepth   Index of the foreground-most layer.
 * @param reduced    Whether reduced-motion mode is active.
 * @param mobile     Whether mobile viewport is active (optional, defaults to false).
 */
export function scrollOffset(
  progress: number,
  depthIndex: number,
  maxDepth: number,
  reduced: boolean,
  mobile: boolean = false,
): Vec2 {
  if (reduced) {
    return { ...ZERO };
  }

  const fraction = depthFraction(depthIndex, maxDepth);
  let shiftRange =
    SCROLL_MIN_SHIFT_PX + (SCROLL_MAX_SHIFT_PX - SCROLL_MIN_SHIFT_PX) * fraction;

  // Mobile simplification: reduce scroll parallax by 50% (Req 23.2)
  if (mobile) {
    shiftRange *= 0.5;
  }

  const clampedProgress = Number.isFinite(progress)
    ? Math.min(Math.max(progress, 0), 1)
    : 0;

  return {
    x: 0,
    y: clampedProgress * shiftRange,
  };
}
