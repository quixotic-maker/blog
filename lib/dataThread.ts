// Data_Thread System — pure, framework-free logic (design: "Data_Thread").
//
// This module owns the deterministic mapping from the scroll section/context
// the visitor is entering to the fixed set of real project metrics that the
// `DataThreads` component renders as monospace amber margin readouts on top of
// the Grid_Motif (Req 6.1, 6.2, 6.3). It is deliberately self-contained (no
// React, no imports) so it can be unit- and property-tested in isolation.

/**
 * The section/context the visitor is currently scrolled into.
 *
 * The three project contexts each map to their own real metric set; every
 * other (non-project) context — the Hero, Data_Anchor, Experience, Philosophy,
 * and Footer sections, plus the initial state — resolves to the `baseline`
 * set, which shows the site's real technical parameters (Req 6.1, 6.2).
 */
export type SectionContext = 'baseline' | 'jarvis' | 'my-heart' | 'arf';

/**
 * A metric set is an ordered, immutable list of real-parameter readout strings
 * (e.g. "P95<200ms", "9600 baud"). It is treated as a set: the same context
 * always yields the same fixed members.
 */
export type MetricSet = readonly string[];

/**
 * The fixed, real metric set for each section context (Req 6.2).
 *
 * - `baseline` shows the site's real technical parameters spanning all projects
 *   (Req 6.1): "18 agents", "9600 baud", "1kHz", "P95<200ms", "H90,V120",
 *   "jitter<100μs".
 * - `jarvis` → "P95<200ms", "18 agents".
 * - `my-heart` → "9600 baud", "H90,V120".
 * - `arf` → "1kHz", "jitter<100μs".
 *
 * The values are frozen so the shared source of truth can never be mutated by
 * a consumer, keeping `activeMetrics` a pure, deterministic function.
 */
const METRIC_SETS: Readonly<Record<SectionContext, MetricSet>> = Object.freeze({
  baseline: Object.freeze([
    '18 agents',
    '9600 baud',
    '1kHz',
    'P95<200ms',
    'H90,V120',
    'jitter<100μs',
  ]),
  jarvis: Object.freeze(['P95<200ms', '18 agents']),
  'my-heart': Object.freeze(['9600 baud', 'H90,V120']),
  arf: Object.freeze(['1kHz', 'jitter<100μs']),
});

/**
 * Map a section context deterministically to its fixed real metric set
 * (Req 6.2).
 *
 * This is a pure function of `sectionContext`: for any given context it always
 * returns exactly the metric set defined for that context, and repeated calls
 * with the same context return equal sets. Project contexts return that
 * project's real metrics; any non-project context returns the `baseline` set.
 */
export function activeMetrics(sectionContext: SectionContext): MetricSet {
  return METRIC_SETS[sectionContext] ?? METRIC_SETS.baseline;
}
