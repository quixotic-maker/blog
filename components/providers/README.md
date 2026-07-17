# Providers

This directory contains React context providers for the quixoticmaker site.

## MotionProvider

The `MotionProvider` reads `prefers-reduced-motion` once on mount and exposes the reduced-motion state via React context. This is the single top-level provider that every animated component asks for its resolved motion config, so reduced-motion is enforced in one place.

### Requirements

- **Req 21.1**: Read `prefers-reduced-motion` when the visitor's environment requests it
- **Req 21.3**: Default to reduced motion when `matchMedia` is unavailable (SSR, older browsers)

### Usage

1. **Wrap your app in the root layout:**

```tsx
import { MotionProvider } from '@/components/providers/MotionProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
```

2. **Consume in animated components:**

```tsx
import { useReducedMotion } from '@/components/providers/MotionProvider';
import { resolveMotion } from '@/lib/motion';

function AnimatedSection() {
  const reduced = useReducedMotion();
  const config = resolveMotion('sectionEnter', reduced);
  
  // Use config.kind, config.durationMs, config.staggerMs
  // to drive your animations
}
```

### Implementation Details

- Reads `window.matchMedia('(prefers-reduced-motion: reduce)')` once on mount
- Defaults to `true` (reduced motion) when `matchMedia` is unavailable
- Does not listen for changes during the session (read-once behavior)
- Throws an error if `useReducedMotion()` is called outside the provider

### Testing

See `tests/MotionProvider.test.tsx` for unit tests and `tests/MotionProvider.integration.test.tsx` for integration tests with `lib/motion.ts`.
