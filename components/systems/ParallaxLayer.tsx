'use client';

import { useEffect, useState, useRef, type ReactNode, type CSSProperties } from 'react';
import { useScroll, motion } from 'framer-motion';
import { layerOffset, scrollOffset, type Vec2 } from '@/lib/parallax';
import { useReducedMotion, useIsMobile } from '@/components/providers/MotionProvider';

/**
 * ParallaxLayer — a React component that applies 2.5D parallax depth effects.
 *
 * Organizes content into 3-4 depth layers with depth indices (background=0 →
 * foreground=max). Tracks pointer position (mouse/touch) and scroll progress,
 * calls `layerOffset` and `scrollOffset` from `lib/parallax.ts` with the
 * layer's depth index, and applies the combined offset via
 * `transform: translate3d(x, y, 0)` (CSS transforms only, no WebGL, Req 5.5).
 *
 * Consumes `useReducedMotion` and `useIsMobile` from `MotionProvider` — when
 * reduced motion is active, renders statically with no transforms (Req 5.6).
 * On mobile, parallax offsets are reduced by 50% for subtler effect (Req 23.2).
 * When no pointer is present (no mouse move events yet), resolves pointer offset
 * to zero (Req 5.1).
 *
 * Requirements: 5.1, 5.2, 5.4, 5.5, 5.6, 23.2
 *
 * Task 9.2: Implement ParallaxLayer consuming lib/parallax.ts
 * Task 16.2: Simplify motion on mobile
 */

export interface ParallaxLayerProps {
  /** Content to render within this parallax layer */
  children: ReactNode;
  
  /**
   * Depth index of this layer, where 0 = background (slowest) and
   * maxDepth = foreground (fastest, tracks pointer most).
   */
  depthIndex: number;
  
  /**
   * Maximum depth index across all layers (typically 2 or 3 for 3-4 layers).
   * Used to normalize depth calculations.
   */
  maxDepth: number;
  
  /** Optional className for styling */
  className?: string;
  
  /** Optional inline styles */
  style?: CSSProperties;
  
  /** Optional data attributes or other props */
  [key: string]: unknown;
}

/**
 * ParallaxLayer component applies pointer-driven and scroll-driven parallax
 * offsets to create a 2.5D depth effect.
 */
export function ParallaxLayer({
  children,
  depthIndex,
  maxDepth,
  className,
  style,
  ...rest
}: ParallaxLayerProps) {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  
  // Track pointer position, initialized to null (no pointer present)
  const [pointer, setPointer] = useState<Vec2 | null>(null);
  
  // Track scroll progress using Framer Motion's useScroll hook
  const { scrollYProgress } = useScroll();
  
  // Reference to track if pointer has ever moved
  const hasPointerMoved = useRef(false);

  useEffect(() => {
    // Skip pointer tracking if reduced motion is active
    if (reducedMotion) {
      return;
    }

    /**
     * Pointer move handler — tracks mouse/touch position relative to viewport center.
     * When no pointer is present (no move events yet), pointer offset resolves to zero.
     */
    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      hasPointerMoved.current = true;
      
      let clientX: number;
      let clientY: number;
      
      if ('touches' in event && event.touches.length > 0) {
        // Touch event
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if ('clientX' in event) {
        // Mouse event
        clientX = event.clientX;
        clientY = event.clientY;
      } else {
        return;
      }
      
      // Calculate pointer position relative to viewport center
      // This gives us a signed offset that the parallax logic can use for direction
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      setPointer({
        x: clientX - centerX,
        y: clientY - centerY,
      });
    };

    // Listen for mouse and touch move events
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [reducedMotion]);

  // Compute the combined offset
  // When reduced motion is active, both functions return zero (Req 5.6)
  // When no pointer is present, pointer resolves to zero (Req 5.1)
  // When mobile is true, offsets are reduced by 50% (Req 23.2)
  const pointerVec: Vec2 = pointer || { x: 0, y: 0 };
  const scrollProgress = scrollYProgress.get();
  
  const pointerOffsetVec = layerOffset(pointerVec, depthIndex, maxDepth, reducedMotion, isMobile);
  const scrollOffsetVec = scrollOffset(scrollProgress, depthIndex, maxDepth, reducedMotion, isMobile);
  
  // Combine offsets
  const totalX = pointerOffsetVec.x + scrollOffsetVec.x;
  const totalY = pointerOffsetVec.y + scrollOffsetVec.y;

  // Render statically (no transforms) when reduced motion is active
  if (reducedMotion) {
    return (
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    );
  }

  // Apply the combined offset via transform: translate3d(x, y, 0) only (Req 5.5)
  // Use Framer Motion's motion.div for smooth animation
  return (
    <motion.div
      className={className}
      style={{
        ...style,
        transform: `translate3d(${totalX}px, ${totalY}px, 0)`,
        willChange: 'transform',
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
