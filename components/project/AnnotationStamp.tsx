/**
 * AnnotationStamp — renders annotations/stamps for credibility (Req 19.4).
 *
 * This component displays annotation and stamp styling to reinforce
 * credibility on Project_Pages, using the Visual_System monospace typeface
 * and amber accent color for technical annotations.
 *
 * Requirements:
 * - Req 19.4: apply annotation and stamp styling to reinforce credibility
 * - Req 18.3: apply same Visual_System
 *
 * Task 14.1: Implement ProjectPage shell and building blocks
 */

'use client';

import type { ReactNode } from 'react';

export interface AnnotationStampProps {
  /**
   * The annotation content (e.g., "VERIFIED", "PRODUCTION", "REAL METRICS")
   */
  children: ReactNode;

  /**
   * Variant style for the stamp
   * - "default": gray text with subtle border
   * - "accent": amber text with amber border (for emphasis)
   * - "inline": minimal inline annotation style
   */
  variant?: 'default' | 'accent' | 'inline';

  /**
   * Optional className for additional styling
   */
  className?: string;
}

/**
 * AnnotationStamp displays an annotation or stamp to reinforce credibility,
 * using monospace typography and engineering-style visual language.
 */
export function AnnotationStamp({
  children,
  variant = 'default',
  className = '',
}: AnnotationStampProps) {
  const variantStyles = {
    default: 'border-gray text-gray',
    accent: 'border-accent text-accent',
    inline: 'border-0 text-gray',
  };

  const baseStyles = 'inline-flex items-center font-mono text-xs uppercase tracking-wider';
  
  if (variant === 'inline') {
    return (
      <span className={`${baseStyles} ${variantStyles.inline} ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <span
      className={`${baseStyles} px-2 py-1 border ${variantStyles[variant]} ${className}`}
      style={{
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {children}
    </span>
  );
}
