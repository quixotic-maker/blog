// Example usage of ChapterTransition component
// Demonstrates how to use the component with chapter phrases from content

import { ChapterTransition } from './ChapterTransition';
import { chapters } from '@/content/chapters';
import { siteContent } from '@/content/site';

// Example 1: Using phrases from content/chapters.ts
export function ChapterTransitionFromChapters() {
  return (
    <div>
      {/* First chapter transition: Hero → Jarvis */}
      <ChapterTransition phrase={chapters[0]} />
      
      {/* Second chapter transition: Jarvis → My Heart */}
      <ChapterTransition phrase={chapters[1]} />
      
      {/* Third chapter transition: My Heart → ARF */}
      <ChapterTransition phrase={chapters[2]} />
      
      {/* Fourth chapter transition: ARF finale */}
      <ChapterTransition phrase={chapters[3]} />
    </div>
  );
}

// Example 2: Using phrases from content/site.ts
export function ChapterTransitionFromSite() {
  return (
    <div>
      {siteContent.chapters.map((phrase, index) => (
        <ChapterTransition key={index} phrase={phrase} />
      ))}
    </div>
  );
}

// Example 3: In Homepage assembly (task 12.1)
// This shows how ChapterTransition will be used in the actual Homepage
export function HomepageWithChapterTransitions() {
  return (
    <main>
      {/* Hero Section */}
      <section>{/* Hero content */}</section>
      
      {/* Chapter transition: Hero → Jarvis */}
      <ChapterTransition phrase={chapters[0]} />
      
      {/* Jarvis Project Card */}
      <section>{/* Jarvis project card */}</section>
      
      {/* Chapter transition: Jarvis → My Heart */}
      <ChapterTransition phrase={chapters[1]} />
      
      {/* My Heart Project Card */}
      <section>{/* My Heart project card */}</section>
      
      {/* Chapter transition: My Heart → ARF */}
      <ChapterTransition phrase={chapters[2]} />
      
      {/* ARF Project Card */}
      <section>{/* ARF project card */}</section>
      
      {/* Chapter transition: ARF finale */}
      <ChapterTransition phrase={chapters[3]} />
    </main>
  );
}

// Example 4: With custom styling
export function CustomStyledChapterTransition() {
  return (
    <ChapterTransition 
      phrase={chapters[0]} 
      className="bg-paper border-t border-b border-grid"
    />
  );
}
