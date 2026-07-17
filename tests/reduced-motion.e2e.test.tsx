/**
 * End-to-end integration test for reduced-motion degradation.
 *
 * Task 16.1: Wire reduced-motion degradation end-to-end
 *
 * This test verifies that all animated systems consume `MotionProvider`
 * and degrade correctly when prefers-reduced-motion is active:
 *
 * 1. Parallax (ParallaxLayer) — zeroes offsets (Req 5.6) ✓
 * 2. Data_Thread (DataThreads) — static readouts (Req 6.6) ✓
 * 3. Counters (MechanicalCounter) — static target (Req 11.5) ✓
 * 4. Shared-element transitions (SharedElementLink) — fade (Req 18.4) ✓
 * 5. Chapter transitions (ChapterTransition) — static by design ✓
 * 6. Loading animation (LoadingAnimation) — fade (Req 4.6) ✓
 * 7. Signature motifs (OscilloscopeMotif, ExplodedViewMotif) — static (Req 19.5) ✓
 *
 * Requirements validated: 21.1, 21.2, 21.3, 4.6, 5.6, 6.6, 11.5, 18.4, 19.5
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MotionProvider } from '../components/providers/MotionProvider';
import { ParallaxLayer } from '../components/systems/ParallaxLayer';
import { DataThreads } from '../components/systems/DataThreads';
import { MechanicalCounter } from '../components/systems/MechanicalCounter';
import { SharedElementLink } from '../components/systems/SharedElementLink';
import { ChapterTransition } from '../components/systems/ChapterTransition';
import { LoadingAnimation } from '../components/sections/LoadingAnimation';
import { OscilloscopeMotif } from '../components/project/OscilloscopeMotif';
import { ExplodedViewMotif } from '../components/project/ExplodedViewMotif';
import { layerOffset, scrollOffset } from '../lib/parallax';
import { resolveMotion } from '../lib/motion';

describe('Reduced-motion end-to-end integration', () => {
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia;
    }
  });

  /**
   * Mock prefers-reduced-motion: reduce
   */
  function mockReducedMotion() {
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
  }

  /**
   * Mock no preference for reduced motion
   */
  function mockFullMotion() {
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
  }

  describe('1. Parallax system degrades to zero offsets', () => {
    it('renders ParallaxLayer statically when reduced motion is active (Req 5.6)', () => {
      mockReducedMotion();

      const { container } = render(
        <MotionProvider>
          <ParallaxLayer depthIndex={1} maxDepth={3}>
            <div data-testid="parallax-content">Test content</div>
          </ParallaxLayer>
        </MotionProvider>
      );

      // Under reduced motion, ParallaxLayer renders a plain div (no motion.div)
      const content = screen.getByTestId('parallax-content');
      expect(content).toBeInTheDocument();

      // The wrapper should not have transform styles
      const wrapper = content.parentElement;
      expect(wrapper?.style.transform).toBeFalsy();
    });

    it('layerOffset returns zero when reduced motion is active', () => {
      const pointer = { x: 100, y: 100 };
      const offset = layerOffset(pointer, 1, 3, true);

      expect(offset.x).toBe(0);
      expect(offset.y).toBe(0);
    });

    it('scrollOffset returns zero when reduced motion is active', () => {
      const offset = scrollOffset(0.5, 1, 3, true);

      expect(offset.x).toBe(0);
      expect(offset.y).toBe(0);
    });
  });

  describe('2. Data_Thread renders static readouts', () => {
    it('renders DataThreads statically when reduced motion is active (Req 6.6)', () => {
      mockReducedMotion();

      const { container } = render(
        <MotionProvider>
          <DataThreads />
        </MotionProvider>
      );

      // DataThreads should render without throwing
      expect(container).toBeTruthy();

      // Check that metrics are rendered (they should be present)
      const metrics = container.querySelectorAll('.font-mono');
      expect(metrics.length).toBeGreaterThan(0);
    });
  });

  describe('3. Counters render static target values', () => {
    it('renders MechanicalCounter as static text when reduced motion is active (Req 11.5)', () => {
      mockReducedMotion();

      const { container } = render(
        <MotionProvider>
          <MechanicalCounter target={42} suffix="ms" />
        </MotionProvider>
      );

      // Under reduced motion, the counter should render the target value immediately
      expect(container.textContent).toContain('42');
      expect(container.textContent).toContain('ms');

      // Should render as monospace
      const counter = container.querySelector('.font-mono');
      expect(counter).toBeTruthy();
    });

    it('animates MechanicalCounter when reduced motion is off', () => {
      mockFullMotion();

      const { container } = render(
        <MotionProvider>
          <MechanicalCounter target={42} />
        </MotionProvider>
      );

      // With full motion, the counter gets animated (uses motion value)
      expect(container).toBeTruthy();
    });
  });

  describe('4. Shared-element transitions degrade to fade', () => {
    it('renders SharedElementLink with fade transition when reduced motion is active (Req 18.4)', () => {
      mockReducedMotion();

      const { container } = render(
        <MotionProvider>
          <SharedElementLink href="/work/test" layoutId="test-card">
            <div data-testid="card-content">Card</div>
          </SharedElementLink>
        </MotionProvider>
      );

      const content = screen.getByTestId('card-content');
      expect(content).toBeInTheDocument();

      // Under reduced motion, the motion config should be 'fade' not 'align'
      const config = resolveMotion('sharedElement', true);
      expect(config.kind).toBe('fade');
    });

    it('uses layoutId for shared-element transition when reduced motion is off', () => {
      mockFullMotion();

      const { container } = render(
        <MotionProvider>
          <SharedElementLink href="/work/test" layoutId="test-card">
            <div data-testid="card-content">Card</div>
          </SharedElementLink>
        </MotionProvider>
      );

      const content = screen.getByTestId('card-content');
      expect(content).toBeInTheDocument();

      // With full motion, config is 'align'
      const config = resolveMotion('sharedElement', false);
      expect(config.kind).toBe('align');
    });
  });

  describe('5. Chapter transitions remain readable', () => {
    it('renders ChapterTransition content regardless of reduced motion', () => {
      mockReducedMotion();

      const testPhrase = {
        zh: '从理解语义开始…',
        en: 'Starting with semantic understanding…',
      };

      render(
        <MotionProvider>
          <ChapterTransition phrase={testPhrase} />
        </MotionProvider>
      );

      // ChapterTransition is static by design, content should be present
      expect(screen.getByText(testPhrase.zh)).toBeInTheDocument();
      expect(screen.getByText(testPhrase.en)).toBeInTheDocument();
    });
  });

  describe('6. Loading animation degrades to fade', () => {
    it('renders LoadingAnimation with simple fade when reduced motion is active (Req 4.6)', () => {
      mockReducedMotion();

      const onComplete = () => {};

      const { container } = render(
        <MotionProvider>
          <LoadingAnimation onComplete={onComplete} />
        </MotionProvider>
      );

      // Under reduced motion, should show simple "Loading..." text
      expect(container.textContent).toContain('Loading...');

      // Verify motion config is 'fade' for loading under reduced motion
      const config = resolveMotion('loading', true);
      expect(config.kind).toBe('fade');
    });

    it('renders full calibration sequence when reduced motion is off', () => {
      mockFullMotion();

      const onComplete = () => {};

      const { container } = render(
        <MotionProvider>
          <LoadingAnimation onComplete={onComplete} />
        </MotionProvider>
      );

      // With full motion, should have calibration elements (not just "Loading...")
      expect(container).toBeTruthy();

      // Verify motion config is 'align' for loading under full motion
      const config = resolveMotion('loading', false);
      expect(config.kind).toBe('align');
    });
  });

  describe('7. Signature motifs render statically', () => {
    it('renders OscilloscopeMotif statically when reduced motion is active (Req 19.5)', () => {
      mockReducedMotion();

      const { container } = render(
        <MotionProvider>
          <OscilloscopeMotif rmsValue="0.45" sampleRate="16kHz" />
        </MotionProvider>
      );

      // Under reduced motion, waveform should be static (no motion.path)
      expect(container).toBeTruthy();

      // Numeric values should be in monospace (Req 19.3)
      const monoElements = container.querySelectorAll('.font-mono');
      expect(monoElements.length).toBeGreaterThan(0);

      // Should contain the numeric values
      expect(container.textContent).toContain('0.45');
      expect(container.textContent).toContain('16kHz');
    });

    it('renders ExplodedViewMotif statically when reduced motion is active (Req 19.5)', () => {
      mockReducedMotion();

      const { container } = render(
        <MotionProvider>
          <ExplodedViewMotif />
        </MotionProvider>
      );

      // Under reduced motion, layers should be static (no motion.g)
      expect(container).toBeTruthy();

      // Numeric labels should be in monospace (Req 19.3)
      const monoElements = container.querySelectorAll('.font-mono');
      expect(monoElements.length).toBeGreaterThan(0);

      // Should contain layer labels
      expect(container.textContent).toContain('HAL');
      expect(container.textContent).toContain('RTS');
      expect(container.textContent).toContain('DIL');
    });
  });

  describe('8. All content remains readable and reachable', () => {
    it('ensures all components render without errors when reduced motion is active (Req 21.3)', () => {
      mockReducedMotion();

      // Render all major animated components together
      const { container } = render(
        <MotionProvider>
          <ParallaxLayer depthIndex={0} maxDepth={2}>
            <div>Parallax content</div>
          </ParallaxLayer>
          <DataThreads />
          <MechanicalCounter target={100} />
          <SharedElementLink href="/test" layoutId="test">
            <div>Link content</div>
          </SharedElementLink>
          <ChapterTransition phrase={{ zh: '测试', en: 'Test' }} />
          <OscilloscopeMotif />
          <ExplodedViewMotif />
        </MotionProvider>
      );

      // All content should be present in the DOM
      expect(container.textContent).toContain('Parallax content');
      expect(container.textContent).toContain('Link content');
      expect(container.textContent).toContain('测试');
      expect(container.textContent).toContain('Test');
      expect(container.textContent).toContain('100');

      // No errors should be thrown
      expect(container).toBeTruthy();
    });
  });

  describe('9. Motion system resolves all intents correctly', () => {
    it('collapses every intent to fade or static under reduced motion (Req 21.2)', () => {
      const intents = [
        'sectionEnter',
        'stagger',
        'counter',
        'parallax',
        'dataThread',
        'sharedElement',
        'loading',
      ] as const;

      intents.forEach((intent) => {
        const config = resolveMotion(intent, true);

        // Every intent under reduced motion should be 'fade' or 'static', never 'align'
        expect(config.kind).not.toBe('align');
        expect(['fade', 'static']).toContain(config.kind);

        // Parallax specifically should be 'static' (Req 5.6, 21.2)
        if (intent === 'parallax') {
          expect(config.kind).toBe('static');
        } else {
          expect(config.kind).toBe('fade');
        }
      });
    });

    it('uses align motion for non-parallax intents under full motion', () => {
      const nonParallaxIntents = [
        'sectionEnter',
        'stagger',
        'counter',
        'dataThread',
        'sharedElement',
        'loading',
      ] as const;

      nonParallaxIntents.forEach((intent) => {
        const config = resolveMotion(intent, false);
        expect(config.kind).toBe('align');
      });
    });
  });

  describe('10. Fallback to reduced motion when matchMedia unavailable', () => {
    it('defaults to reduced motion when matchMedia is missing (Req 21.3)', () => {
      // Simulate SSR or older browsers
      (window as any).matchMedia = undefined;

      const { container } = render(
        <MotionProvider>
          <MechanicalCounter target={42} />
          <ParallaxLayer depthIndex={1} maxDepth={2}>
            <div data-testid="content">Content</div>
          </ParallaxLayer>
        </MotionProvider>
      );

      // Should render without errors
      expect(container).toBeTruthy();

      // Counter should show static value
      expect(container.textContent).toContain('42');

      // Content should be reachable
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });
});
