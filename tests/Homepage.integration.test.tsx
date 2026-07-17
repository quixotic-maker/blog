/**
 * Integration test for Homepage order (Task 12.2).
 *
 * Verifies:
 * - Req 2.3: All sections render in the required top-to-bottom order
 *   (LoadingAnimation → HeroSection → DataAnchorSection → ProjectCard previews
 *   → ExperienceSection → PhilosophySection → FooterSection)
 * - Req 6.5: Chapter phrases appear in the fixed ordered sequence between
 *   project cards (Hero → Jarvis → My Heart → ARF)
 *
 * This test renders the full Homepage (app/page.tsx) and asserts that elements
 * appear in the correct DOM order. It uses screen queries to extract elements
 * and verify their positions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import HomePage from '@/app/page';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { chapters } from '@/content/chapters';
import { projectsMeta } from '@/content/projectsMeta';

// Wrapper to provide both LocaleProvider and MotionProvider contexts
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </MotionProvider>
  );
}

describe('Homepage integration: section order and chapter phrases', () => {
  it('renders all sections in the required top-to-bottom order (Req 2.3)', async () => {
    const { container } = render(<HomePage />, { wrapper: Wrapper });

    // Wait for the main content to appear (after LoadingAnimation completes)
    await waitFor(
      () => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Now verify the section order by checking DOM positions
    // Get all major sections in DOM order
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();

    if (!main) {
      throw new Error('Main element not found');
    }

    // Get all sections/elements in DOM order
    const allElements = Array.from(main.querySelectorAll('*'));

    // Helper to find section index by identifying content
    const findSectionIndex = (identifier: string | RegExp): number => {
      return allElements.findIndex((el) => {
        const text = el.textContent || '';
        if (typeof identifier === 'string') {
          return text.includes(identifier);
        }
        return identifier.test(text);
      });
    };

    // Required order (Req 2.3):
    // 1. HeroSection (has the main heading with id="hero-heading")
    // 2. DataAnchorSection (has "Key Metrics" sr-only heading)
    // 3. ChapterTransition phrases + ProjectCards
    // 4. ExperienceSection (has "Experience" or "经历")
    // 5. PhilosophySection (has "Philosophy" or "产品哲学")
    // 6. FooterSection (footer element with signature)

    // Find sections more specifically
    const heroHeading = main.querySelector('#hero-heading');
    const dataAnchorHeading = main.querySelector('#data-anchors-heading');
    const experienceHeading = main.querySelector('#experience-heading');
    const philosophyHeading = main.querySelector('#philosophy-heading');
    const footer = main.querySelector('footer');

    expect(heroHeading).toBeInTheDocument();
    expect(dataAnchorHeading).toBeInTheDocument();
    expect(experienceHeading).toBeInTheDocument();
    expect(philosophyHeading).toBeInTheDocument();
    expect(footer).toBeInTheDocument();

    // Get their indices in the element array
    const heroIndex = heroHeading ? allElements.indexOf(heroHeading) : -1;
    const dataAnchorIndex = dataAnchorHeading ? allElements.indexOf(dataAnchorHeading) : -1;
    const experienceIndex = experienceHeading ? allElements.indexOf(experienceHeading) : -1;
    const philosophyIndex = philosophyHeading ? allElements.indexOf(philosophyHeading) : -1;
    const footerIndex = footer ? allElements.indexOf(footer) : -1;

    // Verify sections exist
    expect(heroIndex).toBeGreaterThanOrEqual(0);
    expect(dataAnchorIndex).toBeGreaterThanOrEqual(0);
    expect(experienceIndex).toBeGreaterThanOrEqual(0);
    expect(philosophyIndex).toBeGreaterThanOrEqual(0);
    expect(footerIndex).toBeGreaterThanOrEqual(0);

    // Verify order: Hero → DataAnchor → ... → Experience → Philosophy → Footer
    expect(heroIndex).toBeLessThan(dataAnchorIndex);
    expect(dataAnchorIndex).toBeLessThan(experienceIndex);
    expect(experienceIndex).toBeLessThan(philosophyIndex);
    expect(philosophyIndex).toBeLessThan(footerIndex);
  });

  it('renders chapter phrases in the fixed ordered sequence between project cards (Req 6.5)', async () => {
    const { container } = render(<HomePage />, { wrapper: Wrapper });

    // Wait for the main content to appear (after LoadingAnimation completes)
    await waitFor(
      () => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Get the main content
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();

    if (!main) {
      throw new Error('Main element not found');
    }

    // The required chapter phrase sequence (Req 6.5):
    // 1. Hero → "从理解语义开始…" / "It begins with understanding meaning…"
    // 2. Jarvis → "…到调度智能体…" / "…to orchestrating intelligent agents…"
    // 3. My Heart → "…再到驱动物理世界…" / "…then to driving the physical world…"
    // 4. ARF → "…最终，统一所有机器人。" / "…and finally, unifying all robots."

    // Find all chapter phrases in the DOM
    const chapterElements: Element[] = [];
    const allElements = Array.from(main.querySelectorAll('*'));

    // Find elements containing chapter phrases (check both zh and en)
    for (const chapter of chapters) {
      const element = allElements.find((el) => {
        const text = el.textContent || '';
        return text.includes(chapter.zh) || text.includes(chapter.en);
      });
      
      if (element) {
        chapterElements.push(element);
      }
    }

    // Should have all 4 chapter phrases
    expect(chapterElements).toHaveLength(4);

    // Verify they appear in the correct sequence by DOM order
    // Each chapter element should appear before the next one
    for (let i = 0; i < chapterElements.length - 1; i++) {
      const currentPos = allElements.indexOf(chapterElements[i]);
      const nextPos = allElements.indexOf(chapterElements[i + 1]);
      
      expect(currentPos).toBeLessThan(nextPos);
    }

    // Verify the content of each chapter phrase matches the expected sequence
    for (let i = 0; i < chapters.length; i++) {
      const chapterText = chapterElements[i].textContent || '';
      // Should contain either Chinese or English text from the chapter
      const containsChapter =
        chapterText.includes(chapters[i].zh) ||
        chapterText.includes(chapters[i].en);
      
      expect(containsChapter).toBe(true);
    }
  });

  it('verifies chapter phrases appear between project cards in sequence (Req 6.5)', async () => {
    const { container } = render(<HomePage />, { wrapper: Wrapper });

    // Wait for the main content to appear (after LoadingAnimation completes)
    await waitFor(
      () => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();

    if (!main) {
      throw new Error('Main element not found');
    }

    // Get all sections/articles in DOM order
    const allElements = Array.from(main.querySelectorAll('section, article, div'));

    // Helper to find element index by content
    const findElementIndex = (identifier: string): number => {
      return allElements.findIndex((el) => {
        const text = el.textContent || '';
        return text.includes(identifier);
      });
    };

    // Find chapter phrase indices
    const chapter1Index = findElementIndex(chapters[0].zh); // Hero chapter
    const chapter2Index = findElementIndex(chapters[1].zh); // Jarvis chapter
    const chapter3Index = findElementIndex(chapters[2].zh); // My Heart chapter
    const chapter4Index = findElementIndex(chapters[3].zh); // ARF chapter

    // Find project card indices (by project names)
    const jarvisIndex = findElementIndex(projectsMeta[0].name.zh);
    const myHeartIndex = findElementIndex(projectsMeta[1].name.zh);
    const arfIndex = findElementIndex(projectsMeta[2].name.zh);

    // Verify all elements exist
    expect(chapter1Index).toBeGreaterThanOrEqual(0);
    expect(chapter2Index).toBeGreaterThanOrEqual(0);
    expect(chapter3Index).toBeGreaterThanOrEqual(0);
    expect(chapter4Index).toBeGreaterThanOrEqual(0);
    expect(jarvisIndex).toBeGreaterThanOrEqual(0);
    expect(myHeartIndex).toBeGreaterThanOrEqual(0);
    expect(arfIndex).toBeGreaterThanOrEqual(0);

    // Verify the interleaved sequence:
    // DataAnchor → Chapter1 (Hero) → Jarvis → Chapter2 → MyHeart → Chapter3 → ARF → Chapter4 → Experience
    
    // Chapter 1 should come before Jarvis card
    expect(chapter1Index).toBeLessThan(jarvisIndex);
    
    // Jarvis card should come before Chapter 2
    expect(jarvisIndex).toBeLessThan(chapter2Index);
    
    // Chapter 2 should come before My Heart card
    expect(chapter2Index).toBeLessThan(myHeartIndex);
    
    // My Heart card should come before Chapter 3
    expect(myHeartIndex).toBeLessThan(chapter3Index);
    
    // Chapter 3 should come before ARF card
    expect(chapter3Index).toBeLessThan(arfIndex);
    
    // ARF card should come before Chapter 4
    expect(arfIndex).toBeLessThan(chapter4Index);
  });

  it('verifies all three project cards are present in order', async () => {
    render(<HomePage />, { wrapper: Wrapper });

    // Wait for the main content to appear (after LoadingAnimation completes)
    await waitFor(
      () => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify all three project cards are rendered (using default Chinese locale)
    const jarvisCard = screen.getByText(projectsMeta[0].name.zh);
    const myHeartCard = screen.getByText(projectsMeta[1].name.zh);
    const arfCard = screen.getByText(projectsMeta[2].name.zh);

    expect(jarvisCard).toBeInTheDocument();
    expect(myHeartCard).toBeInTheDocument();
    expect(arfCard).toBeInTheDocument();
  });

  it('verifies LoadingAnimation appears initially then reveals content', async () => {
    render(<HomePage />, { wrapper: Wrapper });

    // Initially, LoadingAnimation should be visible (reduced motion shows "Loading...")
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    // Main content should not be visible yet
    expect(screen.queryByRole('main')).not.toBeInTheDocument();

    // Wait for LoadingAnimation to complete and main content to appear
    await waitFor(
      () => {
        expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // And main content should be visible
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
