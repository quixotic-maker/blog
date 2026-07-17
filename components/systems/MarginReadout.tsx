'use client';

/**
 * MarginReadout renders monospace coordinate/page number/column number
 * readouts in the page margins, styled in --color-accent (amber).
 *
 * Requirements:
 * - Req 7.3: display monospace coordinate readouts, page numbers, or column
 *   numbers in the page margins
 * - Req 7.4: render the margin readouts in the amber accent color
 *
 * Positioned in margins (left/right/top/bottom) using the monospace font
 * (var(--font-mono)).
 */

interface MarginReadoutProps {
  /**
   * Position of the readout in the margin.
   */
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /**
   * The content to display (e.g., coordinates, page number, column number).
   */
  content: string;
}

export function MarginReadout({ position, content }: MarginReadoutProps) {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div
      className={`pointer-events-none fixed z-10 ${positionClasses[position]}`}
      style={{
        fontFamily: 'var(--font-mono)',
        color: 'var(--color-accent)',
        fontSize: '0.75rem',
        fontWeight: 'var(--fw-regular)',
      }}
      aria-label={`Margin readout: ${content}`}
    >
      {content}
    </div>
  );
}
