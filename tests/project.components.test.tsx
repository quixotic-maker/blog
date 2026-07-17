/**
 * Tests for Project_Page building blocks (Task 14.1).
 *
 * These tests verify that the project components render correctly with the
 * Visual_System styling and proper structure.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  ProjectPage,
  ProjectHeader,
  MetricGrid,
  TechStackList,
  AnnotationStamp,
} from '@/components/project';

// Mock MotionProvider and motion dependencies
vi.mock('@/components/providers/MotionProvider', () => ({
  useReducedMotion: () => false,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('ProjectPage', () => {
  it('renders with back-to-home control', () => {
    render(
      <ProjectPage layoutId="test-project">
        <div>Test content</div>
      </ProjectPage>
    );

    expect(screen.getByText('Back to Home')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies Visual_System background styling', () => {
    const { container } = render(
      <ProjectPage layoutId="test-project">
        <div>Test content</div>
      </ProjectPage>
    );

    const wrapper = container.querySelector('.bg-paper');
    expect(wrapper).toBeInTheDocument();
  });
});

describe('ProjectHeader', () => {
  it('renders project index, name, and tagline', () => {
    render(
      <ProjectHeader
        index="01"
        name="Test Project"
        tagline="A test project tagline"
      />
    );

    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project tagline')).toBeInTheDocument();
  });

  it('applies monospace amber styling to index', () => {
    const { container } = render(
      <ProjectHeader
        index="01"
        name="Test Project"
        tagline="A test project tagline"
      />
    );

    const index = screen.getByText('01');
    expect(index.className).toMatch(/font-mono/);
    expect(index.className).toMatch(/text-accent/);
  });
});

describe('MetricGrid', () => {
  const testMetrics = [
    { value: 'P95<200ms', label: 'Latency target' },
    { value: '18 agents', label: 'Domain agents' },
  ];

  it('renders all metrics', () => {
    render(<MetricGrid metrics={testMetrics} />);

    expect(screen.getByText('P95<200ms')).toBeInTheDocument();
    expect(screen.getByText('18 agents')).toBeInTheDocument();
    expect(screen.getByText('Latency target')).toBeInTheDocument();
    expect(screen.getByText('Domain agents')).toBeInTheDocument();
  });

  it('applies monospace amber styling to metric values', () => {
    render(<MetricGrid metrics={testMetrics} />);

    const metricValue = screen.getByText('P95<200ms');
    expect(metricValue.className).toMatch(/font-mono/);
    expect(metricValue.className).toMatch(/text-accent/);
  });

  it('renders in a grid layout', () => {
    const { container } = render(<MetricGrid metrics={testMetrics} />);

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });
});

describe('TechStackList', () => {
  const testTags = ['Python 3.11 asyncio', 'FastAPI', 'PostgreSQL'];

  it('renders all tech tags', () => {
    render(<TechStackList tags={testTags} />);

    expect(screen.getByText('Python 3.11 asyncio')).toBeInTheDocument();
    expect(screen.getByText('FastAPI')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
  });

  it('renders optional title', () => {
    render(<TechStackList tags={testTags} title="Tech Stack" />);

    expect(screen.getByText('Tech Stack')).toBeInTheDocument();
  });

  it('applies monospace styling to tech tags', () => {
    render(<TechStackList tags={testTags} />);

    const tag = screen.getByText('Python 3.11 asyncio');
    expect(tag.className).toMatch(/font-mono/);
  });
});

describe('AnnotationStamp', () => {
  it('renders annotation content', () => {
    render(<AnnotationStamp>VERIFIED</AnnotationStamp>);

    expect(screen.getByText('VERIFIED')).toBeInTheDocument();
  });

  it('applies default variant styling', () => {
    render(<AnnotationStamp variant="default">TEST</AnnotationStamp>);

    const stamp = screen.getByText('TEST');
    expect(stamp.className).toMatch(/font-mono/);
    expect(stamp.className).toMatch(/text-gray/);
  });

  it('applies accent variant styling', () => {
    render(<AnnotationStamp variant="accent">PRODUCTION</AnnotationStamp>);

    const stamp = screen.getByText('PRODUCTION');
    expect(stamp.className).toMatch(/text-accent/);
    expect(stamp.className).toMatch(/border-accent/);
  });

  it('applies inline variant styling without border', () => {
    render(<AnnotationStamp variant="inline">NOTE</AnnotationStamp>);

    const stamp = screen.getByText('NOTE');
    expect(stamp.className).toMatch(/border-0/);
  });

  it('matches structural snapshot for default variant', () => {
    const { container } = render(
      <AnnotationStamp variant="default">VERIFIED</AnnotationStamp>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches structural snapshot for accent variant', () => {
    const { container } = render(
      <AnnotationStamp variant="accent">PRODUCTION</AnnotationStamp>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches structural snapshot for inline variant', () => {
    const { container } = render(
      <AnnotationStamp variant="inline">NOTE</AnnotationStamp>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
