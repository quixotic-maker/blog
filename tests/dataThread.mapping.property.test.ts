// Feature: personal-brand-website, Property 9: Data_Thread maps each section context to its real metrics deterministically
//
// Property-based test targeting the pure Data_Thread logic in
// `lib/dataThread.ts`. For any section context, `activeMetrics` returns exactly
// the fixed real metric set defined for that context, and repeated calls with
// the same context return the same set — the scroll-to-metrics mapping is a
// pure, deterministic function of section context.
//
// Validates: Requirements 6.2
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { activeMetrics, type SectionContext } from '../lib/dataThread';

// The fixed, expected real metric set for each section context (Req 6.2).
// Defined independently of the module's internal source of truth so the test
// verifies the mapping itself rather than tautologically echoing it.
const EXPECTED: Record<SectionContext, readonly string[]> = {
  baseline: ['18 agents', '9600 baud', '1kHz', 'P95<200ms', 'H90,V120', 'jitter<100μs'],
  jarvis: ['P95<200ms', '18 agents'],
  'my-heart': ['9600 baud', 'H90,V120'],
  arf: ['1kHz', 'jitter<100μs'],
};

const sectionContextArb: fc.Arbitrary<SectionContext> = fc.constantFrom(
  'baseline',
  'jarvis',
  'my-heart',
  'arf',
);

describe('Property 9: Data_Thread maps each section context to its real metrics deterministically', () => {
  it('returns exactly the fixed real metric set for any section context', () => {
    fc.assert(
      fc.property(sectionContextArb, (context) => {
        expect(activeMetrics(context)).toEqual(EXPECTED[context]);
      }),
      { numRuns: 200 },
    );
  });

  it('is deterministic: repeated calls with the same context return the same set', () => {
    fc.assert(
      fc.property(sectionContextArb, (context) => {
        const first = activeMetrics(context);
        const second = activeMetrics(context);
        // Same members in the same order across repeated calls (pure function).
        expect(second).toEqual(first);
      }),
      { numRuns: 200 },
    );
  });
});
