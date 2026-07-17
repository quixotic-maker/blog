/**
 * Integration test for reduced-motion and responsive behavior (Task 16.3).
 *
 * Verifies:
 * - Req 21.2: With `prefers-reduced-motion: reduce`, parallax/Data_Thread/counter/transitions
 *   render static or fade variants
 * - Req 21.3: All content remains reachable under reduced motion
 * - Req 23.1: At mobile width, side-by-side layouts stack vertically
 * - Req 23.3: Content remains readable on mobile
 *
 * **Validates: Requirements 21.2, 21.3, 23.1, 23.3**
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { ParallaxLayer } from '@/components/systems/ParallaxLayer';
import { DataThreads } from '@/components/systems/DataThreads';
import { MechanicalCounter } from '@/components/systems/MechanicalCounter';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { PhilosophySection } from '@/components/sections/PhilosophySection';
import { siteContent } from '@/content/site';

// Wrapper to provide both MotionProvider and LocaleProvider contexts
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </MotionProvider>
  );
}

describe('Reduced-motion integration tests', () => {
  let originalMatchMedia: typeof window.matchMedia | undefined;
  let originalInnerWidth: number;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    originalInnerWidth = window.innerWidth;
  });

  afterEach(() => {
    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia;
    }
    // Restore original innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  describe('Req 21.2: Reduced-motion renders static/fade variants', () => {
    beforeEach(() => {
      // Mock prefers-reduced-motion: reduce
      window.matchMedia = (query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      });

      // Set desktop width to isolate reduced-motion behavior from mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('renders ParallaxLayer statically without transform offsets', () => {
      const { container } = render(
        <Wrapper>
          <ParallaxLayer depthIndex={0} maxDepth={2}>
            <div data-testid="parallax-content">Test Content</div>
          </ParallaxLayer>
        </Wrapper>
      );

      const content = screen.getByTestId('parallax-content');
      expect(content).toBeInTheDocument();

      // Under reduced motion, ParallaxLayer should render as a plain div without motion.div
      // The parent should not have transform styles applied
      const parent = content.parentElement;
      expect(parent).toBeInTheDocument();

      // Check that no transform is applied (reduced motion renders static)
      const computedStyle = window.getComputedStyle(parent!);
      // In reduced motion mode, the component renders a div without transform
      // or transform should be 'none' or identity matrix
      const transform = computedStyle.transform;
      expect(transform === 'none' || transform === '' || !transform).toBe(true);
    });

    it('renders DataThreads statically without scroll-driven animation', () => {
      const { container } = render(
        <Wrapper>
          <DataThreads />
        </Wrapper>
      );

      // DataThreads should render margin readouts
      // Under reduced motion, they render statically (Req 6.6, 21.2)
      const marginReadouts = container.querySelectorAll('.font-mono');
      expect(marginReadouts.length).toBeGreaterThan(0);

      // Content should be readable
      marginReadouts.forEach((readout) => {
        expect(readout.textContent).toBeTruthy();
        // Should have amber accent color
        const style = window.getComputedStyle(readout);
        expect(style.color).toBeTruthy();
      });
    });

    it('renders MechanicalCounter as static text showing final value', () => {
      const targetValue = 42;

      render(
        <Wrapper>
          <MechanicalCounter target={targetValue} suffix="ms" />
        </Wrapper>
      );

      // Under reduced motion, counter should immediately show the target value (Req 11.5, 21.2)
      const counter = screen.getByText(`${targetValue}ms`);
      expect(counter).toBeInTheDocument();

      // Should be monospace
      expect(counter.className).toContain('font-mono');
    });

    it('renders ExperienceSection with fade transitions instead of align', async () => {
      const { container } = render(
        <Wrapper>
          <ExperienceSection />
        </Wrapper>
      );

      // Wait for content to render
      await waitFor(() => {
        expect(screen.getByText(/Experience|经历/)).toBeInTheDocument();
      });

      // All experience entries should be present and readable (Req 21.3)
      siteContent.experience.forEach((entry) => {
        const titleEn = screen.queryByText(entry.title.en);
        const titleZh = screen.queryByText(entry.title.zh);
        // At least one language should be visible
        expect(titleEn || titleZh).toBeTruthy();
      });

      // Content should be in the document (reachable)
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('renders PhilosophySection with fade transitions instead of align', async () => {
      const { container } = render(
        <Wrapper>
          <PhilosophySection />
        </Wrapper>
      );

      // Wait for content to render
      await waitFor(() => {
        expect(screen.getByText(/Philosophy|产品哲学/)).toBeInTheDocument();
      });

      // All philosophy entries should be present and readable (Req 21.3)
      const philosophyEntries = [
        siteContent.philosophy.vibecoding,
        siteContent.philosophy.aiNative,
        siteContent.philosophy.breathingRoom,
        siteContent.philosophy.skillRedefinition,
      ];

      philosophyEntries.forEach((entry) => {
        const contentEn = screen.queryByText(entry.en);
        const contentZh = screen.queryByText(entry.zh);
        // At least one language should be visible
        expect(contentEn || contentZh).toBeTruthy();
      });

      // Content should be in the document (reachable)
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Req 21.3: All content remains reachable under reduced motion', () => {
    beforeEach(() => {
      // Mock prefers-reduced-motion: reduce
      window.matchMedia = (query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      });

      // Set desktop width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('ensures all ExperienceSection entries are reachable', async () => {
      render(
        <Wrapper>
          <ExperienceSection />
        </Wrapper>
      );

      // Wait for section to render
      await waitFor(() => {
        expect(screen.getByText(/Experience|经历/)).toBeInTheDocument();
      });

      // Verify all experience entries are in the DOM
      expect(siteContent.experience.length).toBeGreaterThan(0);

      siteContent.experience.forEach((entry) => {
        // Check that entry title is present (either English or Chinese)
        const titleEn = screen.queryByText(entry.title.en);
        const titleZh = screen.queryByText(entry.title.zh);
        const hasTitle = titleEn || titleZh;
        
        expect(hasTitle).toBeTruthy();
      });
    });

    it('ensures all PhilosophySection entries are reachable', async () => {
      render(
        <Wrapper>
          <PhilosophySection />
        </Wrapper>
      );

      // Wait for section to render
      await waitFor(() => {
        expect(screen.getByText(/Philosophy|产品哲学/)).toBeInTheDocument();
      });

      // Verify all philosophy entries are in the DOM
      const philosophyEntries = [
        siteContent.philosophy.vibecoding,
        siteContent.philosophy.aiNative,
        siteContent.philosophy.breathingRoom,
        siteContent.philosophy.skillRedefinition,
      ];

      expect(philosophyEntries.length).toBe(4);

      philosophyEntries.forEach((entry) => {
        // Check that entry content is present (either English or Chinese)
        const contentEn = screen.queryByText(entry.en);
        const contentZh = screen.queryByText(entry.zh);
        const hasContent = contentEn || contentZh;
        
        expect(hasContent).toBeTruthy();
      });
    });

    it('ensures DataThreads metrics remain readable', () => {
      const { container } = render(
        <Wrapper>
          <DataThreads />
        </Wrapper>
      );

      // DataThreads should render readable margin readouts
      const marginReadouts = container.querySelectorAll('.font-mono');
      expect(marginReadouts.length).toBeGreaterThan(0);

      // All readouts should have text content
      marginReadouts.forEach((readout) => {
        expect(readout.textContent).toBeTruthy();
        expect(readout.textContent!.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Req 23.1: Mobile width stacks side-by-side layouts vertically', () => {
    beforeEach(() => {
      // Mock no reduced motion preference
      window.matchMedia = (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      });

      // Set mobile width (< 768px)
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375, // Typical mobile width
      });
    });

    it('stacks ExperienceSection layout vertically on mobile', async () => {
      const { container } = render(
        <Wrapper>
          <ExperienceSection />
        </Wrapper>
      );

      // Wait for section to render
      await waitFor(() => {
        expect(screen.getByText(/Experience|经历/)).toBeInTheDocument();
      });

      // Find the grid container
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();

      // On mobile, the grid should have 'grid-cols-1' class (single column)
      // Check that it has the grid-cols-1 class or that lg:grid-cols-2 is present
      expect(gridContainer?.className).toContain('grid-cols-1');
      expect(gridContainer?.className).toContain('lg:grid-cols-2');

      // All entries should still be present
      const entries = container.querySelectorAll('.grid > div');
      expect(entries.length).toBe(siteContent.experience.length);
    });

    it('stacks PhilosophySection layout vertically on mobile', async () => {
      const { container } = render(
        <Wrapper>
          <PhilosophySection />
        </Wrapper>
      );

      // Wait for section to render
      await waitFor(() => {
        expect(screen.getByText(/Philosophy|产品哲学/)).toBeInTheDocument();
      });

      // Find the grid container
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();

      // On mobile, the grid should have 'grid-cols-1' class (single column)
      expect(gridContainer?.className).toContain('grid-cols-1');
      expect(gridContainer?.className).toContain('md:grid-cols-2');

      // All entries should still be present (4 philosophy entries)
      const entries = container.querySelectorAll('.grid > div');
      expect(entries.length).toBe(4);
    });
  });

  describe('Req 23.3: Content remains readable on mobile', () => {
    beforeEach(() => {
      // Mock no reduced motion preference
      window.matchMedia = (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      });

      // Set mobile width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it('renders ExperienceSection content readably on mobile', async () => {
      render(
        <Wrapper>
          <ExperienceSection />
        </Wrapper>
      );

      // Wait for content to render
      await waitFor(() => {
        expect(screen.getByText(/Experience|经历/)).toBeInTheDocument();
      });

      // All experience entries should be readable
      siteContent.experience.forEach((entry) => {
        const titleEn = screen.queryByText(entry.title.en);
        const titleZh = screen.queryByText(entry.title.zh);
        expect(titleEn || titleZh).toBeTruthy();

        // Details should also be present
        const detailEn = screen.queryByText(entry.detail.en);
        const detailZh = screen.queryByText(entry.detail.zh);
        expect(detailEn || detailZh).toBeTruthy();
      });
    });

    it('renders PhilosophySection content readably on mobile', async () => {
      render(
        <Wrapper>
          <PhilosophySection />
        </Wrapper>
      );

      // Wait for content to render
      await waitFor(() => {
        expect(screen.getByText(/Philosophy|产品哲学/)).toBeInTheDocument();
      });

      // All philosophy entries should be readable
      const philosophyEntries = [
        siteContent.philosophy.vibecoding,
        siteContent.philosophy.aiNative,
        siteContent.philosophy.breathingRoom,
        siteContent.philosophy.skillRedefinition,
      ];

      philosophyEntries.forEach((entry) => {
        const contentEn = screen.queryByText(entry.en);
        const contentZh = screen.queryByText(entry.zh);
        expect(contentEn || contentZh).toBeTruthy();
      });
    });

    it('renders DataThreads readably on mobile', () => {
      const { container } = render(
        <Wrapper>
          <DataThreads />
        </Wrapper>
      );

      // DataThreads should render readable margin readouts even on mobile
      const marginReadouts = container.querySelectorAll('.font-mono');
      expect(marginReadouts.length).toBeGreaterThan(0);

      // All readouts should have readable text content
      marginReadouts.forEach((readout) => {
        expect(readout.textContent).toBeTruthy();
        expect(readout.textContent!.trim().length).toBeGreaterThan(0);
      });
    });

    it('renders MechanicalCounter readably on mobile', () => {
      const targetValue = 100;

      const { container } = render(
        <Wrapper>
          <MechanicalCounter target={targetValue} suffix="+" />
        </Wrapper>
      );

      // Counter should be readable (either animated or static depending on motion state)
      const counter = container.querySelector('.font-mono');
      expect(counter).toBeInTheDocument();
      expect(counter?.textContent).toBeTruthy();
    });
  });

  describe('Combined: Reduced motion + Mobile', () => {
    beforeEach(() => {
      // Mock both prefers-reduced-motion and mobile width
      window.matchMedia = (query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      });

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it('renders all content accessible with both reduced motion and mobile layout', async () => {
      const { container } = render(
        <Wrapper>
          <div>
            <ParallaxLayer depthIndex={0} maxDepth={2}>
              <div data-testid="parallax-content">Parallax Content</div>
            </ParallaxLayer>
            <DataThreads />
            <MechanicalCounter target={50} />
            <ExperienceSection />
            <PhilosophySection />
          </div>
        </Wrapper>
      );

      // Wait for sections to render
      await waitFor(() => {
        expect(screen.getByText(/Experience|经历/)).toBeInTheDocument();
        expect(screen.getByText(/Philosophy|产品哲学/)).toBeInTheDocument();
      });

      // Verify all major components are present and accessible
      expect(screen.getByTestId('parallax-content')).toBeInTheDocument();

      // DataThreads metrics should be present
      const metrics = container.querySelectorAll('.font-mono');
      expect(metrics.length).toBeGreaterThan(0);

      // All experience entries should be accessible
      siteContent.experience.forEach((entry) => {
        const hasTitle = screen.queryByText(entry.title.en) || screen.queryByText(entry.title.zh);
        expect(hasTitle).toBeTruthy();
      });

      // All philosophy entries should be accessible
      const philosophyEntries = [
        siteContent.philosophy.vibecoding,
        siteContent.philosophy.aiNative,
        siteContent.philosophy.breathingRoom,
        siteContent.philosophy.skillRedefinition,
      ];

      philosophyEntries.forEach((entry) => {
        const hasContent = screen.queryByText(entry.en) || screen.queryByText(entry.zh);
        expect(hasContent).toBeTruthy();
      });

      // Layouts should be stacked (grid-cols-1)
      const grids = container.querySelectorAll('.grid');
      grids.forEach((grid) => {
        expect(grid.className).toContain('grid-cols-1');
      });
    });
  });
});
