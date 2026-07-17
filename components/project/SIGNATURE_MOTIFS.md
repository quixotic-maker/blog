# Signature Motifs Implementation

This document describes the implementation of the signature motifs for the My Heart and ARF project pages.

## Task 14.2: Implement OscilloscopeMotif (My Heart) and ExplodedViewMotif (ARF)

### Overview

Two distinctive signature motifs have been implemented to give each Project_Page its unique character:

1. **OscilloscopeMotif** — A matte oscilloscope/waveform motif for the My Heart project
2. **ExplodedViewMotif** — An exploded-view assembly diagram for the ARF project

Both motifs follow the requirements:
- **Req 19.1**: Present matte oscilloscope/waveform motif representing VAD/RMS energy detection (My Heart)
- **Req 19.2**: Present exploded-view assembly diagram motif for ARF's layered architecture
- **Req 19.3**: Render numeric values in monospace typeface
- **Req 19.5**: Render as static graphics under reduced motion

---

## OscilloscopeMotif (My Heart)

### Location
`components/project/OscilloscopeMotif.tsx`

### Description
A matte oscilloscope/waveform graphic representing VAD/RMS energy detection from the My Heart voice-to-action project.

### Features
- **Visual Design**: Three overlapping waveforms with different frequencies and opacities
- **Grid Background**: Subtle grid pattern matching the site's Grid_Motif aesthetic
- **Numeric Readouts**: RMS energy level and sample rate displayed in monospace (Req 19.3)
- **Animation**: Smooth waveform oscillation under normal motion
- **Reduced Motion**: Static waveform rendering when reduced motion is active (Req 19.5)
- **Accessibility**: Proper ARIA labels for screen readers

### Props
```typescript
interface OscilloscopeMotifProps {
  rmsValue?: string;       // RMS energy level (default: "0.45")
  sampleRate?: string;     // Sampling rate (default: "16kHz")
  className?: string;      // Additional styling
  width?: number;          // Width in pixels (default: 600)
  height?: number;         // Height in pixels (default: 200)
}
```

### Usage Example
```tsx
import { OscilloscopeMotif } from '@/components/project';

<OscilloscopeMotif 
  rmsValue="0.72"
  sampleRate="16kHz"
  className="my-8"
/>
```

---

## ExplodedViewMotif (ARF)

### Location
`components/project/ExplodedViewMotif.tsx`

### Description
An exploded-view assembly diagram showing ARF's six-layer architecture stack from HAL to App layer.

### Features
- **Visual Design**: Six stacked layers representing ARF's architecture (HAL, RTS, DMS, ACR, DIL, App)
- **Layer Labels**: Each layer labeled with monospace text (Req 19.3)
- **Layer Indices**: Numeric indices (L0-L5) in monospace (Req 19.3)
- **Assembly Axis**: Vertical dashed line showing the assembly axis
- **Animation**: Subtle layer shifting under normal motion with staggered entry
- **Reduced Motion**: Static layer rendering when reduced motion is active (Req 19.5)
- **Legend**: Complete layer descriptions in monospace font
- **Accessibility**: Proper ARIA labels for screen readers

### Props
```typescript
interface ExplodedViewMotifProps {
  className?: string;      // Additional styling
  width?: number;          // Width in pixels (default: 600)
  height?: number;         // Height in pixels (default: 450)
}
```

### Usage Example
```tsx
import { ExplodedViewMotif } from '@/components/project';

<ExplodedViewMotif 
  width={700}
  height={500}
  className="my-8"
/>
```

---

## Architecture Layers (ARF)

The ExplodedViewMotif displays these six layers:

| Layer | Index | Description |
|-------|-------|-------------|
| HAL   | L0    | Hardware Abstraction Layer |
| RTS   | L1    | Real-Time Scheduling |
| DMS   | L2    | Data Management System |
| ACR   | L3    | Algorithm Container Runtime |
| DIL   | L4    | Decision Intelligence Layer |
| App   | L5    | Application Layer |

---

## Design System Compliance

Both motifs follow the "Engineering Editorial · Light" aesthetic:

- **Color Palette**: Uses only approved colors (paper, ink, gray, accent, grid)
- **Typography**: Monospace font for all numeric values and technical labels (Req 19.3)
- **Motion**: Respects `useReducedMotion` hook and degrades gracefully (Req 19.5)
- **Spacing**: Consistent with the site's Visual_System
- **Anti-AI-Aesthetic**: No purple/blue gradients, glowing orbs, or particle effects (Req 9)

---

## Testing

Both components have comprehensive test coverage:

### OscilloscopeMotif Tests
- ✓ Renders with default values
- ✓ Renders custom RMS and sample rate values in monospace
- ✓ Renders SVG with proper dimensions
- ✓ Has proper accessibility attributes

### ExplodedViewMotif Tests
- ✓ Renders the exploded view assembly diagram
- ✓ Renders all ARF architecture layers with labels in monospace
- ✓ Renders layer descriptions in the legend
- ✓ Renders SVG with proper dimensions
- ✓ Has proper accessibility attributes

**Test Results**: All 9 tests pass ✓

---

## Implementation Status

✅ **Task 14.2 Complete**

- [x] Implemented `OscilloscopeMotif` component for My Heart project
- [x] Implemented `ExplodedViewMotif` component for ARF project
- [x] Numeric values rendered in monospace (Req 19.3)
- [x] Static rendering under reduced motion (Req 19.5)
- [x] Created example usage files
- [x] Created comprehensive test coverage
- [x] TypeScript compilation passes (`tsc --noEmit`)
- [x] All tests pass
- [x] Exported from `components/project/index.ts`

---

## Files Created

1. `components/project/OscilloscopeMotif.tsx` - Main component
2. `components/project/OscilloscopeMotif.example.tsx` - Usage examples
3. `components/project/ExplodedViewMotif.tsx` - Main component
4. `components/project/ExplodedViewMotif.example.tsx` - Usage examples
5. `tests/OscilloscopeMotif.test.tsx` - Unit tests
6. `tests/ExplodedViewMotif.test.tsx` - Unit tests
7. `components/project/SIGNATURE_MOTIFS.md` - This documentation

## Files Modified

1. `components/project/index.ts` - Added exports for both motifs
