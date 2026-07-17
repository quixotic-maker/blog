/**
 * Static Export Smoke Test (Task 17.3)
 *
 * Verifies:
 * - Req 22.1: The Website SHALL be produced through static generation
 * - Req 22.2: The Website SHALL serve statically generated pages for the Homepage and all Project_Pages
 * - Req 22.3: The Website SHALL author Project_Page content in MDX
 *
 * This test verifies that the static export (`npm run build`) produces all
 * required routes and that MDX files compile successfully into HTML pages.
 *
 * Prerequisites: `npm run build` must have been run to generate the `out/` directory.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Static Export Smoke Test', () => {
  const outDir = resolve(__dirname, '../out');

  it('produces the out/ directory after build (Req 22.1)', () => {
    expect(existsSync(outDir)).toBe(true);
  });

  it('exports the Homepage at index.html (Req 22.2)', () => {
    const homepagePath = resolve(outDir, 'index.html');
    expect(existsSync(homepagePath)).toBe(true);

    // Verify it's a valid HTML file with expected content
    const content = readFileSync(homepagePath, 'utf-8');
    expect(content).toContain('<!DOCTYPE html>');
    expect(content).toContain('<html');
    
    // Should contain the site wordmark in the title or content
    expect(content.toLowerCase()).toContain('quixoticmaker');
  });

  it('exports the Jarvis project page at work/jarvis.html (Req 22.2, 22.3)', () => {
    const jarvisPath = resolve(outDir, 'work/jarvis.html');
    expect(existsSync(jarvisPath)).toBe(true);

    // Verify MDX compiled successfully by checking HTML structure and content
    const content = readFileSync(jarvisPath, 'utf-8');
    expect(content).toContain('<!DOCTYPE html>');
    expect(content).toContain('<html');
    
    // Should contain project-specific content from jarvis.mdx (Req 12)
    // Check for key Jarvis technical details that should be in the MDX
    const hasJarvisContent = 
      content.includes('Jarvis') ||
      content.includes('multi-agent') ||
      content.includes('coordination');
    expect(hasJarvisContent).toBe(true);
  });

  it('exports the My Heart project page at work/my-heart.html (Req 22.2, 22.3)', () => {
    const myHeartPath = resolve(outDir, 'work/my-heart.html');
    expect(existsSync(myHeartPath)).toBe(true);

    // Verify MDX compiled successfully by checking HTML structure and content
    const content = readFileSync(myHeartPath, 'utf-8');
    expect(content).toContain('<!DOCTYPE html>');
    expect(content).toContain('<html');
    
    // Should contain project-specific content from my-heart.mdx (Req 13)
    const hasMyHeartContent = 
      content.includes('My Heart') ||
      content.includes('Mochi') ||
      content.includes('voice') ||
      content.includes('embodied');
    expect(hasMyHeartContent).toBe(true);
  });

  it('exports the ARF project page at work/arf.html (Req 22.2, 22.3)', () => {
    const arfPath = resolve(outDir, 'work/arf.html');
    expect(existsSync(arfPath)).toBe(true);

    // Verify MDX compiled successfully by checking HTML structure and content
    const content = readFileSync(arfPath, 'utf-8');
    expect(content).toContain('<!DOCTYPE html>');
    expect(content).toContain('<html');
    
    // Should contain project-specific content from arf.mdx (Req 14)
    const hasArfContent = 
      content.includes('ARF') ||
      content.includes('Ares Robotics Framework') ||
      content.includes('robot');
    expect(hasArfContent).toBe(true);
  });

  it('verifies all four routes are present (complete static export)', () => {
    const routes = [
      resolve(outDir, 'index.html'),           // Homepage
      resolve(outDir, 'work/jarvis.html'),     // Jarvis project
      resolve(outDir, 'work/my-heart.html'),   // My Heart project
      resolve(outDir, 'work/arf.html'),        // ARF project
    ];

    // All routes should exist
    routes.forEach((route) => {
      expect(existsSync(route)).toBe(true);
    });
  });

  it('verifies MDX project pages contain valid HTML structure', () => {
    const projectPages = [
      { path: resolve(outDir, 'work/jarvis.html'), name: 'Jarvis' },
      { path: resolve(outDir, 'work/my-heart.html'), name: 'My Heart' },
      { path: resolve(outDir, 'work/arf.html'), name: 'ARF' },
    ];

    projectPages.forEach(({ path, name }) => {
      const content = readFileSync(path, 'utf-8');
      
      // Each should be valid HTML
      expect(content).toContain('<!DOCTYPE html>');
      expect(content).toContain('<html');
      expect(content).toContain('</html>');
      
      // Each should have head and body sections
      expect(content).toContain('<head');
      expect(content).toContain('<body');
      
      // Should contain meta tags (indicates proper Next.js static generation)
      expect(content).toContain('<meta');
    });
  });

  it('verifies the export includes necessary assets', () => {
    // Check for the _next directory (contains JS bundles and other assets)
    const nextDir = resolve(outDir, '_next');
    expect(existsSync(nextDir)).toBe(true);

    // Check for texture assets directory
    const texturesDir = resolve(outDir, 'textures');
    expect(existsSync(texturesDir)).toBe(true);
  });
});
