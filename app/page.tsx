/**
 * Homepage (site root) — Req 2.1, 2.3, 6.4, 6.5, 12.
 *
 * Task 12.1: Compose app/page.tsx in required order
 *
 * The Homepage is a single long-scroll narrative that assembles all sections in
 * the required vertical order with ChapterTransition phrases interleaved between
 * project cards. The sequence is:
 *
 * 1. LoadingAnimation (reveals page on completion)
 * 2. HeroSection
 * 3. DataAnchorSection
 * 4. ChapterTransition (Hero → "从理解语义开始…")
 * 5. ProjectCard (Jarvis) wrapped in SharedElementLink
 * 6. ChapterTransition (Jarvis → "…到调度智能体…")
 * 7. ProjectCard (My Heart) wrapped in SharedElementLink
 * 8. ChapterTransition (My Heart → "…再到驱动物理世界…")
 * 9. ProjectCard (ARF) wrapped in SharedElementLink
 * 10. ChapterTransition (ARF → "…最终，统一所有机器人。")
 * 11. ExperienceSection
 * 12. PhilosophySection
 * 13. FooterSection
 *
 * Requirements:
 * - Req 2.1: provide single long-scroll Homepage at site root
 * - Req 2.3: order sections top-to-bottom as specified
 * - Req 6.5: interleave ChapterTransition phrases in fixed sequence
 * - Req 12: all section requirements (positioning, data anchors, projects, etc.)
 *
 * Implementation notes:
 * - Uses 'use client' to manage loading state
 * - LoadingAnimation calls onComplete to reveal main content
 * - The four ChapterTransition placements match the fixed sequence from
 *   content/chapters.ts (Hero → Jarvis → My Heart → ARF)
 * - Three ProjectCard components are wrapped in SharedElementLink for
 *   jarvis, my-heart, arf (from projectsMeta)
 */

'use client';

import { useState } from 'react';
import { LoadingAnimation } from '@/components/sections/LoadingAnimation';
import { HeroSection } from '@/components/sections/HeroSection';
import { DataAnchorSection } from '@/components/sections/DataAnchorSection';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { PhilosophySection } from '@/components/sections/PhilosophySection';
import { FooterSection } from '@/components/sections/FooterSection';
import { ChapterTransition } from '@/components/systems/ChapterTransition';
import { chapters } from '@/content/chapters';
import { projectsMeta } from '@/content/projectsMeta';

export default function HomePage() {
  // Loading state: true during LoadingAnimation, false after onComplete
  const [isLoading, setIsLoading] = useState(true);

  // Callback fired when LoadingAnimation completes (Req 4.6)
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Extract the three projects in order: Jarvis, My Heart, ARF
  const [jarvisProject, myHeartProject, arfProject] = projectsMeta;

  return (
    <>
      {/* Step 1: LoadingAnimation — reveals page on completion (Req 4.1, 4.6) */}
      {isLoading && <LoadingAnimation onComplete={handleLoadingComplete} />}

      {/* Main content — rendered after LoadingAnimation completes */}
      {!isLoading && (
        <main>
          {/* Step 2: HeroSection — positioning statement + SystemDiagram (Req 10) */}
          <HeroSection />

          {/* Step 3: DataAnchorSection — ~5 headline numbers (Req 11) */}
          <DataAnchorSection />

          {/* Step 4: ChapterTransition — Hero → "从理解语义开始…" (Req 6.5, index 0) */}
          <ChapterTransition phrase={chapters[0]} />

          {/* Step 5: ProjectCard (Jarvis) wrapped in SharedElementLink (Req 2.4, 12) */}
          <div className="px-4 sm:px-6 py-8 md:py-12 max-w-7xl mx-auto">
            <ProjectCard project={jarvisProject} />
          </div>

          {/* Step 6: ChapterTransition — Jarvis → "…到调度智能体…" (Req 6.5, index 1) */}
          <ChapterTransition phrase={chapters[1]} />

          {/* Step 7: ProjectCard (My Heart) wrapped in SharedElementLink (Req 2.4, 13) */}
          <div className="px-4 sm:px-6 py-8 md:py-12 max-w-7xl mx-auto">
            <ProjectCard project={myHeartProject} />
          </div>

          {/* Step 8: ChapterTransition — My Heart → "…再到驱动物理世界…" (Req 6.5, index 2) */}
          <ChapterTransition phrase={chapters[2]} />

          {/* Step 9: ProjectCard (ARF) wrapped in SharedElementLink (Req 2.4, 14) */}
          <div className="px-4 sm:px-6 py-8 md:py-12 max-w-7xl mx-auto">
            <ProjectCard project={arfProject} />
          </div>

          {/* Step 10: ChapterTransition — ARF → "…最终，统一所有机器人。" (Req 6.5, index 3) */}
          <ChapterTransition phrase={chapters[3]} />

          {/* Step 11: ExperienceSection — parallel peer entries (Req 15) */}
          <ExperienceSection />

          {/* Step 12: PhilosophySection — product philosophy (Req 16) */}
          <PhilosophySection />

          {/* Step 13: FooterSection — signature + contact links (Req 17) */}
          <FooterSection />
        </main>
      )}
    </>
  );
}
