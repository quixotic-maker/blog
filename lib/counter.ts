// Feature: personal-brand-website
//
// Pure, framework-free counter interpolation for the MechanicalCounter
// (split-flap / odometer) system. This module governs the numeric mapping
// from animation progress to the displayed value and is independently
// unit- and property-testable.
//
// Contract (Req 11.4):
// - `counterValue(target, progress)` maps animation progress (0 -> 1) to a
//   displayed value.
// - For a non-decreasing sequence of progress values in [0, 1], the produced
//   sequence of displayed values is monotonic non-decreasing.
// - `counterValue(target, 1)` returns `target` exactly.

/**
 * Clamp a progress value into the closed interval [0, 1].
 *
 * Non-finite input (NaN / Infinity) is treated as the start of the
 * animation (0) so the counter never renders a garbage value.
 */
function clampProgress(progress: number): number {
  if (Number.isNaN(progress)) {
    return 0;
  }
  if (progress <= 0) {
    return 0;
  }
  if (progress >= 1) {
    return 1;
  }
  return progress;
}

/**
 * Map animation progress (0 -> 1) to the displayed counter value.
 *
 * The value is linearly interpolated from 0 toward `target`, which makes it
 * monotonic non-decreasing with respect to non-decreasing progress for the
 * headline numbers this drives. When progress reaches (or exceeds) 1 the
 * function returns `target` exactly, guaranteeing the counter terminates on
 * the real value rather than a floating-point approximation.
 *
 * @param target   The final displayed value (a real Data_Thread figure).
 * @param progress Animation progress, expected in [0, 1]; values outside the
 *                 range are clamped.
 * @returns The value to display at the given progress.
 */
export function counterValue(target: number, progress: number): number {
  const p = clampProgress(progress);

  // Terminate exactly at the target when the animation completes.
  if (p >= 1) {
    return target;
  }

  // Anchor the start of the animation at zero.
  if (p <= 0) {
    return 0;
  }

  return target * p;
}
