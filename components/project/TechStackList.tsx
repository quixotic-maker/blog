'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/providers/MotionProvider';
import { sectionVariants } from './ProjectPage';

export interface TechStackListProps {
  tags: string[];
  title?: string;
  className?: string;
}

export function TechStackList({ tags, title = 'Tech Stack', className = '' }: TechStackListProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={!reduced ? sectionVariants : undefined}
    >
      <p className="font-mono text-xs text-gray uppercase tracking-widest mb-4">{title}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <motion.span
            key={i}
            className="font-mono text-xs text-ink border border-grid px-3 py-1.5 hover:border-accent hover:text-accent transition-colors duration-200 cursor-default"
            whileHover={!reduced ? { scale: 1.03 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
