/**
 * SharedElementLink component — wraps a Project_Card as navigation to its
 * Project_Page using Framer Motion's `layoutId` shared-element transition.
 *
 * This component uses Framer Motion's layout animation system to create a
 * seamless visual connection between a Project_Card on the Homepage and its
 * corresponding Project_Page. The `layoutId` prop identifies the shared
 * element across pages, enabling Framer Motion to animate the transition.
 *
 * Requirements:
 * - Req 18.1: perform shared-element transition connecting Project_Card to Project_Page
 * - Req 18.4: degrade to simple fade navigation under reduced motion
 *
 * Task 9.6: Implement SharedElementLink
 *
 * Implementation notes:
 * - Uses Next.js <Link> for navigation (client-side routing)
 * - Uses Framer Motion `layoutId` to create shared-element transition
 * - Consumes `useReducedMotion` from MotionProvider
 * - When reduced motion is active, degrades to simple fade (no layoutId)
 * - Children (e.g., Project_Card) are wrapped in motion.div with layoutId
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/providers/MotionProvider';
import { resolveMotion } from '@/lib/motion';
import type { ReactNode } from 'react';

export interface SharedElementLinkProps {
  /**
   * Target route for navigation, e.g., `/work/jarvis`
   */
  href: string;

  /**
   * Unique identifier for the shared-element transition.
   * This layoutId must match between the Project_Card on the Homepage
   * and the target element on the Project_Page for the transition to work.
   */
  layoutId: string;

  /**
   * Children to wrap (typically a Project_Card component)
   */
  children: ReactNode;

  /**
   * Optional className for styling the wrapper
   */
  className?: string;
}

/**
 * SharedElementLink wraps its children (e.g., a Project_Card) as a navigation
 * link to a Project_Page, using Framer Motion's `layoutId` shared-element
 * transition to visually connect the card to its destination page.
 *
 * Under reduced motion, the layoutId is omitted and the transition degrades
 * to a simple fade navigation (Req 18.4).
 */
export function SharedElementLink({
  href,
  layoutId,
  children,
  className,
}: SharedElementLinkProps) {
  const reducedMotion = useReducedMotion();

  // Resolve motion config for shared-element transition
  const motionConfig = resolveMotion('sharedElement', reducedMotion);

  // Under reduced motion, render as a simple Link wrapper without layoutId
  // This degrades to a simple fade navigation (Req 18.4)
  if (reducedMotion || motionConfig.kind === 'fade') {
    return (
      <Link href={href} className={className}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionConfig.durationMs / 1000 }}
        >
          {children}
        </motion.div>
      </Link>
    );
  }

  // Full shared-element transition with layoutId (Req 18.1)
  return (
    <Link href={href} className={className}>
      <motion.div
        layoutId={layoutId}
        transition={{
          duration: motionConfig.durationMs / 1000,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.div>
    </Link>
  );
}
