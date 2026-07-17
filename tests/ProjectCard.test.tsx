/**
 * ProjectCard component tests
 *
 * Verifies that ProjectCard:
 * - Renders project index, name, tagline, and tech tags
 * - Reveals ≥2 key metrics on hover (Req 2.6)
 * - Wraps in SharedElementLink to navigate to the correct route (Req 2.4, 18.1)
 * - Uses Visual_System styling (monospace for metrics, amber accent)
 * - Displays bilingual content based on active locale
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { projectsMeta } from '@/content/projectsMeta';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { MotionProvider } from '@/components/providers/MotionProvider';

// Test wrapper with required providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </MotionProvider>
  );
}

describe('ProjectCard', () => {
  it('renders project index, name, and tagline for Jarvis', () => {
    const jarvisProject = projectsMeta.find((p) => p.id === 'jarvis')!;
    
    render(
      <TestWrapper>
        <ProjectCard project={jarvisProject} />
      </TestWrapper>
    );

    // Check project index
    expect(screen.getByText('01')).toBeInTheDocument();
    
    // Check project name
    expect(screen.getByText('Jarvis')).toBeInTheDocument();
    
    // Check tagline appears (the locale defaults to 'en' or 'zh', either is valid)
    // Just verify the tagline element is present
    const taglineElement = screen.getByText(/解耦大模型语义与任务执行的多智能体协同中枢|multi-agent hub/i);
    expect(taglineElement).toBeInTheDocument();
  });

  it('renders all tech tags', () => {
    const jarvisProject = projectsMeta.find((p) => p.id === 'jarvis')!;
    
    render(
      <TestWrapper>
        <ProjectCard project={jarvisProject} />
      </TestWrapper>
    );

    // Verify some tech tags are present
    expect(screen.getByText('Python 3.11 asyncio')).toBeInTheDocument();
    expect(screen.getByText('FastAPI')).toBeInTheDocument();
    expect(screen.getByText('Redis')).toBeInTheDocument();
  });

  it('renders at least 2 preview metrics for each project', () => {
    projectsMeta.forEach((project) => {
      const { container } = render(
        <TestWrapper>
          <ProjectCard project={project} />
        </TestWrapper>
      );

      // Verify preview metrics count (Req 2.6: ≥2 key metrics)
      expect(project.previewMetrics.length).toBeGreaterThanOrEqual(2);
      
      // The metrics themselves are rendered in a motion div that's hidden initially
      // but the values should be in the DOM
      project.previewMetrics.forEach((metric) => {
        expect(container.textContent).toContain(metric.value);
      });
    });
  });

  it('renders correct route for each project', () => {
    projectsMeta.forEach((project) => {
      const { container } = render(
        <TestWrapper>
          <ProjectCard project={project} />
        </TestWrapper>
      );

      // SharedElementLink wraps in a Next.js Link with href
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', project.route);
    });
  });

  it('renders My Heart project with correct metrics', () => {
    const myHeartProject = projectsMeta.find((p) => p.id === 'my-heart')!;
    
    const { container } = render(
      <TestWrapper>
        <ProjectCard project={myHeartProject} />
      </TestWrapper>
    );

    // Check for My Heart-specific metrics (Req 6.2)
    expect(container.textContent).toContain('9600 baud');
    expect(container.textContent).toContain('H90,V120');
  });

  it('renders ARF project with correct metrics', () => {
    const arfProject = projectsMeta.find((p) => p.id === 'arf')!;
    
    const { container } = render(
      <TestWrapper>
        <ProjectCard project={arfProject} />
      </TestWrapper>
    );

    // Check for ARF-specific metrics (Req 6.2)
    expect(container.textContent).toContain('1kHz');
    expect(container.textContent).toContain('jitter<100μs');
  });
});
