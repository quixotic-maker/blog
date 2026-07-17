'use client';

/**
 * GridStage renders the baseline grid using --color-grid as the layout stage
 * behind all content.
 *
 * Requirements:
 * - Req 7.1: render a visible baseline grid using --color-grid (#E5E2DC)
 *   as the layout stage behind all content
 *
 * The grid is implemented as a fixed/absolute positioned element that stays
 * behind content with horizontal baseline grid lines.
 */

export function GridStage() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage: `repeating-linear-gradient(
          to bottom,
          transparent 0,
          transparent calc(1.5rem - 1px),
          var(--color-grid) calc(1.5rem - 1px),
          var(--color-grid) 1.5rem
        )`,
      }}
      aria-hidden="true"
    />
  );
}
