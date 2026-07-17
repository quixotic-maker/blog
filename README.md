# quixoticmaker — Personal Brand Website

A bilingual (Chinese/English) personal brand and portfolio website with an "Engineering Editorial · Light" aesthetic. Built with Next.js, statically generated, and designed for deployment on Vercel.

## Overview

This website presents the **quixoticmaker** wordmark as the brand identity for Yiheng Liu (刘一恒), positioning as an AI Product Manager focused on hardware-AI integration and multi-agent coordination. The site features:

- **Hybrid structure**: Single long-scroll narrative homepage + dedicated project pages
- **Bilingual support**: Full content in both Chinese and English with seamless switching
- **Immersive systems**: 2.5D parallax depth, coordinate grid motif, real-metric data threads, and staggered motion
- **Engineering aesthetic**: Deliberately avoids generic AI visuals; focuses on precision typography, restrained color palette, and credible technical documentation
- **Fully static**: Zero runtime dependencies, CDN-optimized, accessible by default

## Tech Stack

- **Framework**: Next.js 15 (App Router with static export)
- **Content**: TypeScript content modules + MDX for project pages
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS with custom design tokens
- **Testing**: Vitest + React Testing Library + fast-check (property-based testing)
- **Deployment**: Vercel with automatic HTTPS and CDN

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
# Build static site
npm run build
```

Generates static HTML/CSS/JS in the `/out` directory.

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

The test suite includes:
- Unit tests for components and sections
- Property-based tests for pure logic (parallax, motion, counter, locale, data threads)
- Integration tests for the motion and locale systems
- Smoke tests for all routes

## Project Structure

```
/
├─ app/                          # Next.js App Router pages
│  ├─ layout.tsx                 # Root layout with providers
│  ├─ page.tsx                   # Homepage
│  └─ work/[project]/page.tsx    # Project pages (jarvis, my-heart, arf)
├─ components/
│  ├─ sections/                  # Homepage sections
│  ├─ project/                   # Project page components
│  ├─ systems/                   # Shared immersion systems (parallax, grid, data threads)
│  ├─ providers/                 # Context providers (motion, locale)
│  └─ ui/                        # UI primitives
├─ lib/                          # Pure logic (framework-free, testable)
│  ├─ parallax.ts                # Parallax offset calculations
│  ├─ motion.ts                  # Motion config resolution
│  ├─ counter.ts                 # Counter interpolation
│  ├─ dataThread.ts              # Section-to-metrics mapping
│  ├─ locale.ts                  # Locale switching and content resolution
│  └─ contentSchema.ts           # Content validation
├─ content/
│  ├─ site.ts                    # Homepage bilingual content
│  ├─ chapters.ts                # Chapter transition phrases
│  ├─ projectsMeta.ts            # Project metadata and previews
│  └─ projects/                  # MDX project content
├─ styles/tokens.css             # Design tokens (palette, typography, spacing)
├─ public/textures/              # Static assets (paper texture)
├─ tests/                        # Test suite
└─ DEPLOYMENT.md                 # Detailed deployment guide
```

## Deployment

The site is configured for deployment on **Vercel** with automatic HTTPS, CDN serving, and continuous deployment from GitHub.

### Quick Deploy

1. Push this repository to GitHub
2. Import the repository in Vercel (https://vercel.com)
3. Vercel auto-detects Next.js and deploys automatically
4. Site is live at `https://your-project.vercel.app` with automatic HTTPS

### Custom Domain

1. In Vercel dashboard: **Settings → Domains → Add Domain**
2. Enter your custom domain
3. Configure DNS as instructed by Vercel
4. Automatic HTTPS provisioned via Let's Encrypt

### Auto-Deploy on Push

Every push to the main branch triggers an automatic production deployment. Pull requests get preview deployments.

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.**

## Configuration Files

- **`vercel.json`**: Vercel build settings, security headers, cache optimization
- **`.vercelignore`**: Excludes test files and dev artifacts from deployment
- **`next.config.mjs`**: Next.js configuration with static export and MDX support
- **`tailwind.config.ts`**: Tailwind CSS configuration with custom design tokens

## Design System

The site implements an "Engineering Editorial · Light" visual system:

- **Color palette**: Warm off-white paper (#F5F3EE), ink black (#1C1C1C), amber accent (#D97706)
- **Typography**: Display grotesque/serif, monospace for technical annotations, Source Han for Chinese
- **Motion**: 400-600ms transitions, 50-100ms stagger, full reduced-motion support
- **Grid**: Visible baseline grid with coordinate marginalia
- **Parallax**: 2.5D depth layers (4-12px offsets, CSS transforms only)
- **Data Threads**: Real project metrics as margin readouts that switch per section

## Accessibility

- Fully keyboard navigable
- Semantic HTML structure
- ARIA labels where needed
- Respects `prefers-reduced-motion` (all animations degrade to fades/static)
- High contrast color palette
- Readable at all viewport sizes

## Browser Support

Modern browsers with ES2020+ support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

Private project. All rights reserved.

## Contact

**quixoticmaker — Yiheng Liu**

- GitHub: [https://github.com/quixotic-maker]
- Email: [quixoticmaker@163.com]
