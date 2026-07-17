'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/providers/MotionProvider';
import { sectionVariants } from './ProjectPage';
import type { ReactNode } from 'react';

export interface ProjectHeaderProps {
  index: string;
  name: ReactNode;
  tagline: ReactNode;
  className?: string;
}

export function ProjectHeader({ index, name, tagline, className = '' }: ProjectHeaderProps) {
  const reduced = useReducedMotion();

  return (
    <motion.header
      className={`mb-20 border-b border-grid pb-12 ${className}`}
      variants={!reduced ? sectionVariants : undefined}
    >
      {/* Index + divider line */}
      <div className="flex items-center gap-4 mb-8">
        <span className="font-mono text-xs text-accent tracking-widest uppercase">
          Project {index}
        </span>
        <span className="flex-1 h-px bg-grid" />
      </div>

      {/* Title — large, tight */}
      <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-ink leading-none tracking-tight mb-6">
        {name}
      </h1>

      {/* Tagline */}
      <p className="font-body text-lg md:text-xl text-gray max-w-2xl leading-relaxed">
        {tagline}
      </p>
    </motion.header>
  );
}
