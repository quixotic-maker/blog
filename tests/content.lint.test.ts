// Content lint test — verify the authored content passes validation and
// excludes hype terms (Req 1.3, 1.5, 6.5).

import { describe, it, expect } from 'vitest';
import { validateContent } from '../lib/contentSchema';
import { siteContent } from '../content/site';
import { projectsMeta } from '../content/projectsMeta';

describe('Content lint', () => {
  it('should pass schema validation', () => {
    const issues = validateContent(siteContent, projectsMeta);
    expect(issues).toEqual([]);
  });

  it('should exclude OPC (One Person Company) content', () => {
    const contentStr = JSON.stringify(siteContent);
    // No explicit OPC framing (the requirements forbid emphasis on OPC concept).
    expect(contentStr.toLowerCase()).not.toContain('one person company');
    expect(contentStr.toLowerCase()).not.toContain('opc');
    expect(contentStr).not.toContain('一人公司');
  });

  it('should exclude hype terms', () => {
    const contentStr = JSON.stringify(siteContent);
    // Req 1.5: exclude "颠覆", "革命性", "最", "唯一".
    expect(contentStr).not.toContain('颠覆');
    expect(contentStr).not.toContain('革命性');
    // "最" and "唯一" are common characters; check them in hype contexts.
    expect(contentStr).not.toMatch(/最[^\s]{0,2}(强|好|优|快|新)/);
    expect(contentStr).not.toContain('唯一');
  });

  it('should have exactly 5 data anchors', () => {
    expect(siteContent.dataAnchors.length).toBe(5);
  });

  it('should have 2 experience entries (parallel peer items)', () => {
    expect(siteContent.experience.length).toBe(2);
  });

  it('should have 4 chapter phrases in sequence', () => {
    expect(siteContent.chapters.length).toBe(4);
    // Verify the fixed ordered sequence (Req 6.5).
    expect(siteContent.chapters[0].zh).toContain('从理解语义开始');
    expect(siteContent.chapters[1].zh).toContain('到调度智能体');
    expect(siteContent.chapters[2].zh).toContain('再到驱动物理世界');
    expect(siteContent.chapters[3].zh).toContain('最终，统一所有机器人');
  });

  it('should have 3 footer contact links (GitHub, LinkedIn, Email)', () => {
    expect(siteContent.footer.links.length).toBe(3);
    const kinds = siteContent.footer.links.map((link) => link.kind);
    expect(kinds).toContain('github');
    expect(kinds).toContain('linkedin');
    expect(kinds).toContain('email');
  });
});
