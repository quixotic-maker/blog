/**
 * ProjectCard component — renders a preview card for a project on the Homepage,
 * revealing key metrics on hover and navigating to the project's dedicated
 * page via SharedElementLink with a shared-element transition.
 *
 * Requirements: 2.4, 2.6, 18.1
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useReducedMotion } from '@/components/providers/MotionProvider';
import { SharedElementLink } from '@/components/systems/SharedElementLink';
import { resolveContent } from '@/lib/locale';
import type { ProjectMeta } from '@/lib/contentSchema';

export interface ProjectCardProps {
  project: ProjectMeta;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const name = resolveContent(project.name, locale);
  const tagline = resolveContent(project.tagline, locale);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <SharedElementLink
      href={project.route}
      layoutId={`project-card-${project.id}`}
      className="block"
    >
      <motion.article
        className="group relative overflow-hidden border border-grid bg-paper p-6 sm:p-8"
        initial={!reduced ? { opacity: 0, y: 40 } : undefined}
        whileInView={!reduced ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Amber sweep bar that grows on hover */}
        <motion.span
          className="absolute top-0 left-0 h-px bg-accent"
          initial={{ width: '0%' }}
          animate={{ width: isHovered ? '100%' : '0%' }}
          transition={{ duration: 0.5, ease }}
        />

        {/* Index + arrow row */}
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-xs text-accent tracking-widest">
            {project.index}
          </span>
          <motion.span
            className="font-mono text-sm text-accent"
            animate={{ x: isHovered ? 0 : -6, opacity: isHovered ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            →
          </motion.span>
        </div>

        {/* Project name */}
        <h3 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3 leading-none tracking-tight">
          {name}
        </h3>

        {/* Tagline */}
        <p className="text-sm text-gray mb-6 leading-relaxed max-w-md">
          {tagline}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techTags.slice(0, 4).map((tag, i) => (
            <span
              key={i}
              className="font-mono text-xs text-gray px-2 py-1 border border-grid"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Hover metrics preview (Req 2.6) */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            height: isHovered ? 'auto' : 0,
          }}
          transition={{ duration: 0.35, ease }}
          className="overflow-hidden border-t border-grid"
        >
          <div className="space-y-2 pt-4">
            {project.previewMetrics.map((metric, i) => (
              <motion.div
                key={i}
                className="flex justify-between items-baseline gap-4"
                initial={{ opacity: 0, x: -8 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  x: isHovered ? 0 : -8,
                }}
                transition={{ duration: 0.3, delay: isHovered ? 0.1 + i * 0.06 : 0, ease }}
              >
                <span className="font-mono text-sm text-accent font-bold tabular-nums">
                  {metric.value}
                </span>
                <span className="font-mono text-xs text-gray text-right">
                  {resolveContent(metric.label, locale)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.article>
    </SharedElementLink>
  );
}
