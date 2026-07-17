/**
 * Typed asset path constants.
 * 
 * Centralizes references to public assets so missing files surface as
 * type/build errors rather than runtime 404s.
 */

/**
 * Paper texture asset path for parallax depth layering.
 * 
 * If the texture fails to load, the site falls back to the --color-paper
 * background color defined in styles/tokens.css, preserving legibility.
 * 
 * Requirements: 22.1, 22.2
 */
export const PAPER_TEXTURE = '/textures/paper.png';
