'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/components/providers/MotionProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface ProjectPageProps {
  layoutId: string;
  children: ReactNode;
  className?: string;
  /**
   * Optional custom loader element rendered before the page content is
   * revealed. Each project supplies its own themed loader (see ProjectLoaders).
   * The loader receives an `onComplete` callback via cloneElement.
   */
  loader?: ReactNode;
  /** How long the loader is shown before revealing content (ms). Default 600. */
  loaderDuration?: number;
}

/** Fallback page-level loading animation — quick line-scan reveal. */
function DefaultReveal({ onComplete, duration }: { onComplete: () => void; duration: number }) {
  useEffect(() => {
    const t = setTimeout(onComplete, duration);
    return () => clearTimeout(t);
  }, [onComplete, duration]);

  return (
    <motion.div
      className="fixed inset-0 z-40 bg-paper pointer-events-none flex flex-col items-center justify-center gap-4"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } }}
    >
      <motion.div
        className="h-px bg-accent"
        initial={{ width: 0 }}
        animate={{ width: '60vw' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      <motion.p
        className="font-mono text-xs text-accent uppercase tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        Loading
      </motion.p>
    </motion.div>
  );
}

/** Container animation — stagger children in from below */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ProjectPage({
  layoutId,
  children,
  className = '',
  loader,
  loaderDuration = 600,
}: ProjectPageProps) {
  const reduced = useReducedMotion();
  const { locale } = useLocale();
  const [revealed, setRevealed] = useState(false);

  const handleComplete = () => setRevealed(true);

  // Under reduced motion, skip the loader entirely.
  useEffect(() => {
    if (reduced) setRevealed(true);
  }, [reduced]);

  return (
    <>
      {/* Page reveal loading animation — custom per-project loader, or fallback */}
      <AnimatePresence>
        {!revealed && !reduced && (
          loader ? (
            <ProjectLoaderHost onComplete={handleComplete}>{loader}</ProjectLoaderHost>
          ) : (
            <DefaultReveal onComplete={handleComplete} duration={loaderDuration} />
          )
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        layoutId={layoutId}
        className={`min-h-screen bg-paper text-ink ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Back-to-home control (Req 2.5) — sits below the global header,
            an explicit "← Back" affordance for project pages. */}
        <nav className="max-w-6xl mx-auto px-6 md:px-12 pt-24">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-xs text-gray hover:text-accent transition-colors duration-200"
            aria-label="Back to Home"
          >
            <motion.span
              className="inline-block"
              initial={false}
              whileHover={{ x: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              ←
            </motion.span>
            <span className="tracking-wider uppercase">{locale === 'zh' ? '返回' : 'Back'}</span>
          </Link>
        </nav>

        {/* Content — two-column grid on desktop */}
        <motion.div
          className="max-w-6xl mx-auto px-6 md:px-12 pt-10 pb-32"
          variants={!reduced ? containerVariants : undefined}
          initial={!reduced ? 'hidden' : undefined}
          animate={!reduced && revealed ? 'visible' : undefined}
        >
          {children}
        </motion.div>
      </motion.div>
    </>
  );
}

/**
 * Wraps a custom loader element and injects the `onComplete` callback,
 * so project loaders can signal when their sequence is finished.
 */
import { cloneElement, isValidElement } from 'react';

function ProjectLoaderHost({
  children,
  onComplete,
}: {
  children: ReactNode;
  onComplete: () => void;
}) {
  if (isValidElement(children)) {
    return cloneElement(children as React.ReactElement<{ onComplete?: () => void }>, {
      onComplete,
    });
  }
  return <>{children}</>;
}
