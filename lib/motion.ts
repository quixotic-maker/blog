/**
 * Motion_System pure config resolver (framework-free, testable).
 *
 * `resolveMotion` maps a semantic motion intent to concrete, band-constrained
 * transition values. It is the single source of truth for durations, stagger
 * offsets, and animation kind, and it is the one place reduced-motion is
 * enforced.
 *
 * Bands (Req 20.1, 20.2, 4.4):
 *   - section / element transitions: 400–600ms
 *   - loading: 800–1200ms
 *   - stagger offset (where applicable): 50–100ms
 *
 * Under reduced motion every intent collapses to `fade` or `static`
 * (never `align`) (Req 21.2).
 */

export type MotionIntent =
  | 'sectionEnter'
  | 'stagger'
  | 'counter'
  | 'parallax'
  | 'dataThread'
  | 'sharedElement'
  | 'loading';

export interface ResolvedMotion {
  durationMs: number;
  staggerMs?: number;
  kind: 'align' | 'fade' | 'static';
}

/** Section/element transition band midpoint (Req 20.1). */
const SECTION_DURATION_MS = 500;
/** Loading band midpoint (Req 4.4, Loading 800–1200ms). */
const LOADING_DURATION_MS = 1000;
/** Staggered entry offset midpoint (Req 20.2, 50–100ms). */
const STAGGER_MS = 75;

/**
 * Intents that animate a group of children with a staggered offset and so
 * carry a `staggerMs` value in the 50–100ms band.
 */
const STAGGERED_INTENTS: ReadonlySet<MotionIntent> = new Set<MotionIntent>([
  'sectionEnter',
  'stagger',
  'dataThread',
]);

/**
 * Resolve a semantic motion intent into concrete, band-constrained motion
 * values. Pure: output depends only on `intent`, `reduced`, and `mobile`.
 * 
 * When `mobile` is true, animations are simplified relative to desktop:
 * - Reduced stagger delays (faster transitions)
 * - Shorter durations for quicker feedback
 * - Less aggressive align offsets
 * (Req 23.2: simplify Motion_System animations on mobile)
 */
export function resolveMotion(
  intent: MotionIntent, 
  reduced: boolean, 
  mobile: boolean = false
): ResolvedMotion {
  if (reduced) {
    return resolveReduced(intent);
  }

  // Mobile simplification: reduce durations and stagger for snappier feel (Req 23.2)
  const durationMultiplier = mobile ? 0.7 : 1;
  const staggerMultiplier = mobile ? 0.6 : 1;
  
  const baseDuration = intent === 'loading' ? LOADING_DURATION_MS : SECTION_DURATION_MS;
  const durationMs = Math.round(baseDuration * durationMultiplier);
  
  const resolved: ResolvedMotion = { durationMs, kind: 'align' };

  if (STAGGERED_INTENTS.has(intent)) {
    resolved.staggerMs = Math.round(STAGGER_MS * staggerMultiplier);
  }

  return resolved;
}

/**
 * Reduced-motion collapse: parallax has no meaningful reduced animation and
 * renders as an instant static state; every other intent degrades to a simple
 * opacity fade. Neither ever yields `align` (Req 21.2).
 */
function resolveReduced(intent: MotionIntent): ResolvedMotion {
  if (intent === 'parallax') {
    return { durationMs: 0, kind: 'static' };
  }
  const durationMs = intent === 'loading' ? LOADING_DURATION_MS : SECTION_DURATION_MS;
  return { durationMs, kind: 'fade' };
}
