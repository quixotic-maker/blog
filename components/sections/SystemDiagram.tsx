'use client';

import { useReducedMotion } from '@/components/providers/MotionProvider';

/**
 * SystemDiagram renders a minimal system diagram representing the semantic →
 * decoupling → action flow (Req 10.2).
 *
 * Requirements:
 * - Req 10.2: represent the semantic-to-physical-execution flow
 * - Req 10.3: use boxes, connectors, and monospace protocol annotations
 *   (restrained engineering style, NOT illustrative artwork)
 * - Optional: animated data dot moving along the flow path
 * - Reduced motion: render as a static graphic (Req 19.5)
 *
 * The diagram uses SVG with boxes connected by lines, with monospace labels
 * for each stage. A small data dot animates along the path to show the flow.
 */
export function SystemDiagram() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="w-full max-w-3xl mx-auto my-12">
      <svg
        viewBox="0 0 800 200"
        className="w-full h-auto"
        role="img"
        aria-label="System flow diagram: semantic understanding to decoupling to physical action"
      >
        {/* Background grid pattern (subtle) */}
        <defs>
          <pattern
            id="diagram-grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="var(--color-grid)"
              strokeWidth="0.5"
            />
          </pattern>

          {/* Arrow marker for connectors */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M0,0 L0,6 L9,3 z"
              fill="var(--color-gray)"
            />
          </marker>
        </defs>

        {/* Grid background */}
        <rect width="800" height="200" fill="url(#diagram-grid)" opacity="0.3" />

        {/* Stage 1: Semantic Understanding */}
        <g id="stage-1">
          <rect
            x="50"
            y="60"
            width="180"
            height="80"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="2"
            rx="2"
          />
          <text
            x="140"
            y="95"
            textAnchor="middle"
            className="font-mono text-sm"
            fill="var(--color-ink)"
          >
            Semantic
          </text>
          <text
            x="140"
            y="115"
            textAnchor="middle"
            className="font-mono text-xs"
            fill="var(--color-gray)"
          >
            LLM / Intent
          </text>
        </g>

        {/* Connector 1 → 2 */}
        <line
          x1="230"
          y1="100"
          x2="290"
          y2="100"
          stroke="var(--color-gray)"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        <text
          x="260"
          y="90"
          textAnchor="middle"
          className="font-mono text-xs"
          fill="var(--color-accent)"
        >
          parse
        </text>

        {/* Stage 2: Decoupling Layer */}
        <g id="stage-2">
          <rect
            x="310"
            y="60"
            width="180"
            height="80"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="2"
            rx="2"
          />
          <text
            x="400"
            y="95"
            textAnchor="middle"
            className="font-mono text-sm"
            fill="var(--color-ink)"
          >
            Decoupling
          </text>
          <text
            x="400"
            y="115"
            textAnchor="middle"
            className="font-mono text-xs"
            fill="var(--color-gray)"
          >
            AgentRegistry
          </text>
        </g>

        {/* Connector 2 → 3 */}
        <line
          x1="490"
          y1="100"
          x2="550"
          y2="100"
          stroke="var(--color-gray)"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        <text
          x="520"
          y="90"
          textAnchor="middle"
          className="font-mono text-xs"
          fill="var(--color-accent)"
        >
          dispatch
        </text>

        {/* Stage 3: Physical Action */}
        <g id="stage-3">
          <rect
            x="570"
            y="60"
            width="180"
            height="80"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="2"
            rx="2"
          />
          <text
            x="660"
            y="95"
            textAnchor="middle"
            className="font-mono text-sm"
            fill="var(--color-ink)"
          >
            Action
          </text>
          <text
            x="660"
            y="115"
            textAnchor="middle"
            className="font-mono text-xs"
            fill="var(--color-gray)"
          >
            HW / Servo / Agent
          </text>
        </g>

        {/* Animated data dot — travels along the connector line (y=100),
            through the three stage boxes from left to right. */}
        {!prefersReducedMotion && (
          <circle r="4" fill="var(--color-accent)">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path="M 50 100 L 750 100"
            />
          </circle>
        )}

        {/* Protocol annotations below the flow */}
        <text
          x="140"
          y="175"
          textAnchor="middle"
          className="font-mono text-xs"
          fill="var(--color-gray)"
        >
          {"<user_input>"}
        </text>
        <text
          x="400"
          y="175"
          textAnchor="middle"
          className="font-mono text-xs"
          fill="var(--color-gray)"
        >
          {"<task_queue>"}
        </text>
        <text
          x="660"
          y="175"
          textAnchor="middle"
          className="font-mono text-xs"
          fill="var(--color-gray)"
        >
          {"<execution>"}
        </text>
      </svg>
    </div>
  );
}
