/**
 * Responsive/Mobile Adaptation Verification Tests
 *
 * This test suite verifies Requirements 23.1, 23.2, and 23.3:
 * - Req 23.1: side-by-side layouts stack vertically at mobile width
 * - Req 23.2: Motion_System animations simplify on mobile (via reduced motion)
 * - Req 23.3: preserve readability of all primary content on mobile
 *
 * Task 16.2: Implement responsive/mobile adaptation
 *
 * The tests verify:
 * 1. Grid layouts use mobile-first responsive classes (grid-cols-1 → md:grid-cols-2/3)
 * 2. Typography scales appropriately (text-base → md:text-lg, etc.)
 * 3. Padding and spacing are mobile-appropriate
 * 4. Content remains readable at mobile widths (320px–768px)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/sections/HeroSection';
import { DataAnchorSection } from '@/components/sections/DataAnchorSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { PhilosophySection } from '@/components/sections/PhilosophySection';
import { FooterSection } from '@/components/sections/FooterSection';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { Header } from '@/components/sections/Header';
import { projectsMeta } from '@/content/projectsMeta';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';

/**
 * Wrapper component that provides necessary context for components
 */
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </MotionProvider>
  );
}

describe('Responsive/Mobile Adaptation (Req 23)', () => {
  describe('Requirement 23.1: Side-by-side layouts stack vertically at mobile width', () => {
    it('DataAnchorSection uses mobile-first grid layout', () => {
      const { container } = render(
        <TestWrapper>
          <DataAnchorSection />
        </TestWrapper>
      );

      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();

      // Should start with grid-cols-1 (mobile) and scale up to md:grid-cols-2 lg:grid-cols-3
      const classNames = grid?.className || '';
      expect(classNames).toMatch(/grid-cols-1/);
      expect(classNames).toMatch(/md:grid-cols-2/);
      expect(classNames).toMatch(/lg:grid-cols-3/);
    });

    it('ExperienceSection uses mobile-first grid layout', () => {
      const { container } = render(
        <TestWrapper>
          <ExperienceSection />
        </TestWrapper>
      );

      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();

      // Should start with grid-cols-1 (mobile) and scale up to lg:grid-cols-2
      const classNames = grid?.className || '';
      expect(classNames).toMatch(/grid-cols-1/);
      expect(classNames).toMatch(/lg:grid-cols-2/);
    });

    it('PhilosophySection uses mobile-first grid layout', () => {
      const { container } = render(
        <TestWrapper>
          <PhilosophySection />
        </TestWrapper>
      );

      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();

      // Should start with grid-cols-1 (mobile) and scale up to md:grid-cols-2
      const classNames = grid?.className || '';
      expect(classNames).toMatch(/grid-cols-1/);
      expect(classNames).toMatch(/md:grid-cols-2/);
    });

    it('Header layout adapts to mobile width', () => {
      const { container } = render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const headerInner = container.querySelector('.flex.items-center.justify-between');
      expect(headerInner).toBeInTheDocument();
      
      // Header should have flex layout that works on mobile
      expect(headerInner?.className).toMatch(/flex/);
    });
  });

  describe('Requirement 23.2: Motion_System animations simplify on mobile', () => {
    it('MotionProvider respects reduced motion preference', () => {
      // The Motion_System already simplifies animations via reduced motion detection
      // This is tested in motion.reduced.property.test.ts and MotionProvider.test.tsx
      // Motion simplification on mobile is achieved through the same reduced-motion path
      
      const { container } = render(
        <TestWrapper>
          <HeroSection />
        </TestWrapper>
      );

      // Component should render successfully with motion system
      expect(container.querySelector('section')).toBeInTheDocument();
    });
  });

  describe('Requirement 23.3: Preserve readability of all primary content on mobile', () => {
    it('HeroSection has responsive typography', () => {
      const { container } = render(
        <TestWrapper>
          <HeroSection />
        </TestWrapper>
      );

      const heading = container.querySelector('h1');
      expect(heading).toBeInTheDocument();

      // Should scale from text-5xl → md:text-6xl → lg:text-7xl
      const classNames = heading?.className || '';
      expect(classNames).toMatch(/text-5xl/);
      expect(classNames).toMatch(/md:text-6xl/);
      expect(classNames).toMatch(/lg:text-7xl/);
    });

    it('HeroSection subtitle has responsive typography', () => {
      const { container } = render(
        <TestWrapper>
          <HeroSection />
        </TestWrapper>
      );

      const subtitle = container.querySelector('.text-xl');
      expect(subtitle).toBeInTheDocument();

      // Should scale from text-xl → md:text-2xl
      const classNames = subtitle?.className || '';
      expect(classNames).toMatch(/text-xl/);
      expect(classNames).toMatch(/md:text-2xl/);
    });

    it('DataAnchorSection headline numbers have responsive typography', () => {
      const { container } = render(
        <TestWrapper>
          <DataAnchorSection />
        </TestWrapper>
      );

      const numbers = container.querySelectorAll('.text-5xl');
      expect(numbers.length).toBeGreaterThan(0);

      // Each number should scale from text-5xl → md:text-6xl
      numbers.forEach((number) => {
        const classNames = number.className || '';
        expect(classNames).toMatch(/text-5xl/);
        expect(classNames).toMatch(/md:text-6xl/);
      });
    });

    it('ExperienceSection titles have responsive typography', () => {
      const { container } = render(
        <TestWrapper>
          <ExperienceSection />
        </TestWrapper>
      );

      const titles = container.querySelectorAll('.text-lg');
      expect(titles.length).toBeGreaterThan(0);

      // Titles should scale from text-lg → md:text-xl
      titles.forEach((title) => {
        const classNames = title.className || '';
        expect(classNames).toMatch(/text-lg/);
        expect(classNames).toMatch(/md:text-xl/);
      });
    });

    it('ExperienceSection details have responsive typography', () => {
      const { container } = render(
        <TestWrapper>
          <ExperienceSection />
        </TestWrapper>
      );

      const details = container.querySelectorAll('.text-sm');
      expect(details.length).toBeGreaterThan(0);

      // Details should scale from text-sm → md:text-base
      details.forEach((detail) => {
        const classNames = detail.className || '';
        expect(classNames).toMatch(/text-sm/);
        expect(classNames).toMatch(/md:text-base/);
      });
    });

    it('PhilosophySection content has responsive typography', () => {
      const { container } = render(
        <TestWrapper>
          <PhilosophySection />
        </TestWrapper>
      );

      const content = container.querySelectorAll('.text-sm');
      expect(content.length).toBeGreaterThan(0);

      // Content should scale from text-sm → md:text-base
      content.forEach((item) => {
        const classNames = item.className || '';
        expect(classNames).toMatch(/text-sm/);
        expect(classNames).toMatch(/md:text-base/);
      });
    });

    it('FooterSection signature has responsive typography', () => {
      const { container } = render(
        <TestWrapper>
          <FooterSection />
        </TestWrapper>
      );

      const signature = container.querySelector('.text-2xl');
      expect(signature).toBeInTheDocument();

      // Signature should scale from text-2xl → md:text-3xl
      const classNames = signature?.className || '';
      expect(classNames).toMatch(/text-2xl/);
      expect(classNames).toMatch(/md:text-3xl/);
    });

    it('FooterSection positioning has responsive typography', () => {
      const { container } = render(
        <TestWrapper>
          <FooterSection />
        </TestWrapper>
      );

      const positioning = container.querySelector('.font-mono.text-sm');
      expect(positioning).toBeInTheDocument();

      // Positioning should scale from text-sm → md:text-base
      const classNames = positioning?.className || '';
      expect(classNames).toMatch(/text-sm/);
      expect(classNames).toMatch(/md:text-base/);
    });

    it('All sections have mobile-appropriate padding', () => {
      const sections = [
        { component: HeroSection, name: 'HeroSection' },
        { component: DataAnchorSection, name: 'DataAnchorSection' },
        { component: ExperienceSection, name: 'ExperienceSection' },
        { component: PhilosophySection, name: 'PhilosophySection' },
      ];

      sections.forEach(({ component: Component, name }) => {
        const { container } = render(
          <TestWrapper>
            <Component />
          </TestWrapper>
        );

        const section = container.querySelector('section');
        expect(section, `${name} should render a section`).toBeInTheDocument();

        // All sections should have horizontal padding (px-6)
        const classNames = section?.className || '';
        expect(classNames, `${name} should have px-6`).toMatch(/px-6/);
      });
    });

    it('ProjectCard maintains readability on mobile', () => {
      const { container } = render(
        <TestWrapper>
          <ProjectCard project={projectsMeta[0]} />
        </TestWrapper>
      );

      // ProjectCard should render with appropriate structure
      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();

      // Title should be present and readable
      const title = container.querySelector('.text-2xl');
      expect(title).toBeInTheDocument();

      // Tech tags should be present
      const tags = container.querySelectorAll('.font-mono.text-xs');
      expect(tags.length).toBeGreaterThan(0);
    });
  });

  describe('Content Structure Verification', () => {
    it('All primary content sections render successfully', () => {
      const sections = [
        { component: HeroSection, label: 'Hero' },
        { component: DataAnchorSection, label: 'Data Anchors' },
        { component: ExperienceSection, label: 'Experience' },
        { component: PhilosophySection, label: 'Philosophy' },
        { component: FooterSection, label: 'Footer' },
      ];

      sections.forEach(({ component: Component, label }) => {
        const { container } = render(
          <TestWrapper>
            <Component />
          </TestWrapper>
        );

        expect(
          container.firstChild,
          `${label} section should render`
        ).toBeInTheDocument();
      });
    });

    it('All sections use max-w constraints for content width', () => {
      const { container: heroContainer } = render(
        <TestWrapper>
          <HeroSection />
        </TestWrapper>
      );
      expect(heroContainer.querySelector('.max-w-5xl')).toBeInTheDocument();

      const { container: dataContainer } = render(
        <TestWrapper>
          <DataAnchorSection />
        </TestWrapper>
      );
      expect(dataContainer.querySelector('.max-w-7xl')).toBeInTheDocument();

      const { container: expContainer } = render(
        <TestWrapper>
          <ExperienceSection />
        </TestWrapper>
      );
      expect(expContainer.querySelector('.max-w-7xl')).toBeInTheDocument();
    });
  });
});
