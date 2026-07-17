# Project Page Building Blocks

This directory contains the shared building blocks for all three Project_Pages (Jarvis, My Heart, ARF).

**Task 14.1: Implement ProjectPage shell and building blocks**

## Components

### `ProjectPage`

Shared shell for all Project_Pages. Provides:
- Same Visual_System as Homepage (Req 18.3)
- Back-to-Homepage control (Req 2.5)
- Shared-element transition target (receives layoutId from SharedElementLink)
- MDX content wrapper

**Props:**
- `layoutId: string` — Unique identifier for shared-element transition
- `children: ReactNode` — MDX content or other project page content
- `className?: string` — Optional additional styling

**Example:**
```tsx
<ProjectPage layoutId="project-jarvis">
  <ProjectHeader index="01" name="Jarvis" tagline="Multi-agent coordination hub" />
  {/* MDX content */}
</ProjectPage>
```

### `ProjectHeader`

Renders project name, tagline, and index (e.g., "01 / Jarvis").

**Props:**
- `index: string` — Project index ("01", "02", "03")
- `name: ReactNode` — Project name (string or ReactNode for bilingual)
- `tagline: ReactNode` — Project tagline (string or ReactNode for bilingual)
- `className?: string` — Optional additional styling

**Example:**
```tsx
<ProjectHeader
  index="01"
  name="Jarvis"
  tagline="A multi-agent hub decoupling LLM semantics from task execution"
/>
```

### `MetricGrid`

Renders key metrics in a grid layout with labels.

**Props:**
- `metrics: Metric[]` — Array of metrics with value and label
- `columns?: 2 | 3 | 4` — Number of columns (default: 2)
- `className?: string` — Optional additional styling

**Example:**
```tsx
<MetricGrid
  metrics={[
    { value: 'P95<200ms', label: 'Latency target' },
    { value: '18 agents', label: 'Domain agents' },
  ]}
  columns={2}
/>
```

### `TechStackList`

Renders tech tags (e.g., "Python 3.11 asyncio", "FastAPI").

**Props:**
- `tags: string[]` — Array of technology tags
- `title?: string` — Optional section title (default: "Technology Stack")
- `className?: string` — Optional additional styling

**Example:**
```tsx
<TechStackList
  tags={['Python 3.11 asyncio', 'FastAPI', 'PostgreSQL']}
  title="Technology Stack"
/>
```

### `AnnotationStamp`

Renders annotations/stamps for credibility (Req 19.4).

**Props:**
- `children: ReactNode` — Annotation content
- `variant?: 'default' | 'accent' | 'inline'` — Style variant
- `className?: string` — Optional additional styling

**Variants:**
- `default` — Gray text with subtle border
- `accent` — Amber text with amber border (for emphasis)
- `inline` — Minimal inline annotation style without border

**Example:**
```tsx
<AnnotationStamp variant="accent">VERIFIED</AnnotationStamp>
<AnnotationStamp variant="inline">Real metrics</AnnotationStamp>
```

## Design System

All components follow the **Engineering Editorial · Light** Visual_System:

- **Colors:** Paper background (#F5F3EE), ink text (#1C1C1C), gray secondary (#6B6B6B), amber accent (#D97706)
- **Typography:** Display grotesque for headers, body sans for text, monospace for technical content
- **Spacing:** Generous whitespace, baseline grid alignment
- **Motion:** Shared-element transitions degrade to simple fade under reduced motion

## Requirements Coverage

- **Req 2.5:** Back-to-Homepage control (ProjectPage)
- **Req 18.2:** Present full project content (all components)
- **Req 18.3:** Apply same Visual_System as Homepage (all components)
- **Req 19.4:** Annotation and stamp styling for credibility (AnnotationStamp)

## Usage in Project Pages

These components will be used in the three Project_Pages at:
- `/work/jarvis` (Task 15.1)
- `/work/my-heart` (Task 15.2)
- `/work/arf` (Task 15.3)

Each Project_Page will use MDX content authored in `content/projects/*.mdx` with these components embedded for structure and styling.
