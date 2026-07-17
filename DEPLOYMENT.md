# Deployment Guide

This document describes how to deploy the quixoticmaker personal brand website to Vercel with automatic HTTPS, CDN serving, and continuous deployment from GitHub.

## Overview

The website is configured for static generation using Next.js with `output: 'export'`. Vercel will automatically detect the Next.js framework, run the build command, and serve the static output through its global CDN with automatic HTTPS.

## Prerequisites

- A GitHub account with this repository pushed
- A Vercel account (sign up at https://vercel.com)
- A custom domain (optional, can deploy to vercel.app subdomain first)

## Deployment Steps

### 1. Connect GitHub Repository to Vercel

1. Go to https://vercel.com and sign in (or sign up)
2. Click **"Add New Project"** or **"Import Project"**
3. Select **"Import Git Repository"**
4. Choose your GitHub account and select this repository
5. Vercel will automatically detect the Next.js framework

### 2. Configure Build Settings

Vercel will auto-detect the following settings (already configured in `vercel.json`):

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `out`
- **Install Command**: `npm install`

You don't need to modify these settings unless you have special requirements.

### 3. Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Install dependencies (`npm install`)
   - Run the build command (`npm run build`)
   - Execute Next.js static export (generates static HTML/CSS/JS in `/out`)
   - Deploy the static output to Vercel's global CDN
   - Provide automatic HTTPS via Let's Encrypt
3. Wait for the build to complete (usually 1-3 minutes)
4. Your site will be live at `https://your-project-name.vercel.app`

### 4. Configure Custom Domain

To serve the site on your custom domain:

1. In the Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Click **"Add Domain"**
4. Enter your custom domain (e.g., `quixoticmaker.com`)
5. Follow Vercel's DNS configuration instructions:
   - **Option A (Recommended)**: Point your domain's nameservers to Vercel
   - **Option B**: Add DNS records (A/CNAME) as instructed
6. Vercel will automatically provision an SSL certificate and enable HTTPS
7. Your site will be accessible via your custom domain with HTTPS

### 5. Automatic Deployment on Push

Vercel automatically sets up continuous deployment:

- **Main branch**: Any push to `main` (or your default branch) triggers an automatic production deployment
- **Other branches**: Pushes to other branches create preview deployments
- **Pull requests**: Each PR gets its own preview deployment URL

No additional configuration is needed. Every `git push` to the main branch will:

1. Trigger a new Vercel build
2. Run `npm run build`
3. Deploy the updated static site
4. Update both the vercel.app URL and your custom domain

## Configuration Files

### `vercel.json`

Configures Vercel-specific settings:

- **Build settings**: Specifies build command and output directory
- **Security headers**: Adds X-Content-Type-Options, X-Frame-Options, etc.
- **Cache headers**: Optimizes caching for static assets and textures
- **URL formatting**: Clean URLs without `.html` extensions

### `.vercelignore`

Excludes unnecessary files from deployment:

- Test files and coverage reports
- Development configuration (`.vscode`, `.kiro`)
- Documentation files
- Build artifacts and dependencies

These files reduce deployment size and speed up builds.

## CDN and Performance

Vercel automatically serves your site through its global Edge Network:

- **Automatic CDN**: Static assets served from edge locations worldwide
- **Smart caching**: Next.js static assets cached with `immutable` headers
- **Instant cache invalidation**: New deployments invalidate old cache automatically
- **HTTP/2 and HTTP/3**: Modern protocols for faster asset delivery
- **Brotli compression**: Automatic compression for smaller transfer sizes

## Environment and Build

The build process:

1. **Dependencies**: Installs from `package.json` using npm
2. **Build**: Runs `next build` which compiles React components, processes MDX, optimizes CSS with Tailwind
3. **Export**: Generates static HTML for all routes (`/`, `/work/jarvis`, `/work/my-heart`, `/work/arf`)
4. **Output**: Places static files in `/out` directory
5. **Deploy**: Uploads `/out` contents to Vercel CDN

Build logs are available in the Vercel dashboard under **"Deployments"**.

## Monitoring and Logs

After deployment:

- **Deployments**: View all deployments and their status in the Vercel dashboard
- **Analytics**: Vercel provides Web Analytics (Core Web Vitals, page views)
- **Logs**: Access build and function logs (though this site is fully static)
- **Preview URLs**: Every deployment gets a unique preview URL for testing

## Troubleshooting

### Build Fails

1. Check the build logs in the Vercel dashboard
2. Ensure `npm run build` succeeds locally
3. Verify all dependencies are listed in `package.json`
4. Check that TypeScript compilation passes (`tsc --noEmit`)

### Custom Domain Not Working

1. Verify DNS records are correctly configured
2. Wait for DNS propagation (can take up to 48 hours, usually minutes)
3. Check domain configuration in Vercel dashboard under **Settings → Domains**
4. Ensure SSL certificate is provisioned (automatic, but may take a few minutes)

### Assets Not Loading

1. Verify asset paths are relative (not absolute `/` paths that assume root)
2. Check that `public/` directory assets are correctly referenced
3. Ensure `next.config.mjs` has `output: 'export'` and `images.unoptimized: true`

## Additional Resources

- **Vercel Next.js Documentation**: https://vercel.com/docs/frameworks/nextjs
- **Static Exports Guide**: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- **Custom Domains**: https://vercel.com/docs/concepts/projects/domains
- **Vercel CLI**: https://vercel.com/docs/cli (optional, for command-line deployments)

## Requirements Validation

This deployment configuration satisfies Requirements 24.1-24.4:

- ✅ **24.1**: Website deploys to Vercel from GitHub repository
- ✅ **24.2**: Vercel serves the website over HTTPS on custom domain
- ✅ **24.3**: Auto-deploy on push to GitHub repository (main branch)
- ✅ **24.4**: Vercel Edge Network serves as the CDN

All configuration is code-based; actual platform connection and domain setup are manual steps performed in the Vercel dashboard.
