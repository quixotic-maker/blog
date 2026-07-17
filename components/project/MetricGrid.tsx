'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/providers/MotionProvider';
import { sectionVariants } from './ProjectPage';
import type { ReactNode } from 'react';

export interface Metric {
  value: string;
  label: ReactNode;
}

export interface MetricGridProps {
  metrics: Metric[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function MetricGrid({ metrics, columns = 2, className = '' }: MetricGridProps) {
  const reduced = useReducedMotion();

  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <motion.div
      className={`grid ${colClass} gap-px border border-grid ${className}`}
      variants={!reduced ? sectionVariants : undefined}
    >
      {metrics.map((metric, i) => (
        <motion.div
          key={i}
          className="group p-6 bg-paper hover:bg-grid/30 transition-colors duration-300 cursor-default"
          whileHover={!reduced ? { y: -2 } : undefined}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="font-mono text-2xl md:text-3xl text-accent font-bold mb-2 tabular-nums">
            {metric.value}
          </div>
          <div className="font-mono text-xs text-gray leading-relaxed uppercase tracking-wide">
            {metric.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
