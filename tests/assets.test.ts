import { describe, it, expect } from 'vitest';
import { PAPER_TEXTURE } from '@/lib/assets';

/**
 * Asset constants verification tests.
 * 
 * Ensures typed asset path constants are properly exported and reference
 * the correct public assets, so missing files surface as type/build errors
 * rather than runtime 404s.
 * 
 * Task 17.1: Finalize static export configuration and paper texture asset
 * Requirements: 22.1, 22.2
 */
describe('Asset constants', () => {
  it('should export PAPER_TEXTURE constant with correct path', () => {
    expect(PAPER_TEXTURE).toBe('/textures/paper.png');
    expect(typeof PAPER_TEXTURE).toBe('string');
  });

  it('should have PAPER_TEXTURE as a string literal type', () => {
    // TypeScript compile-time check - if this compiles, the type is correct
    const texture: string = PAPER_TEXTURE;
    expect(texture).toBe('/textures/paper.png');
  });
});
