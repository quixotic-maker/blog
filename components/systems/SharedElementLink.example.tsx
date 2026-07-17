/**
 * Usage example for SharedElementLink component
 *
 * This example demonstrates how to use SharedElementLink to wrap a Project_Card
 * and create a shared-element transition to its Project_Page.
 */

import { motion } from 'framer-motion';
import { SharedElementLink } from './SharedElementLink';

/**
 * Example 1: Basic usage with a Project_Card
 *
 * On the Homepage, wrap each Project_Card with SharedElementLink:
 */
export function HomepageProjectCardExample() {
  return (
    <SharedElementLink href="/work/jarvis" layoutId="project-jarvis">
      <div className="project-card">
        <h3>Jarvis</h3>
        <p>Multi-agent coordination hub</p>
      </div>
    </SharedElementLink>
  );
}

/**
 * Example 2: Multiple project cards with unique layoutIds
 *
 * Each project needs a unique layoutId that matches between the card and its page.
 */
export function MultipleProjectCardsExample() {
  const projects = [
    { id: 'jarvis', href: '/work/jarvis', title: 'Jarvis' },
    { id: 'my-heart', href: '/work/my-heart', title: 'My Heart' },
    { id: 'arf', href: '/work/arf', title: 'ARF' },
  ];

  return (
    <div className="projects-grid">
      {projects.map((project) => (
        <SharedElementLink
          key={project.id}
          href={project.href}
          layoutId={`project-${project.id}`}
        >
          <div className="project-card">
            <h3>{project.title}</h3>
          </div>
        </SharedElementLink>
      ))}
    </div>
  );
}

/**
 * Example 3: With custom styling
 *
 * You can apply custom classes to the wrapper Link element.
 */
export function StyledProjectCardExample() {
  return (
    <SharedElementLink
      href="/work/jarvis"
      layoutId="project-jarvis"
      className="block hover:scale-105 transition-transform"
    >
      <div className="project-card">
        <h3>Jarvis</h3>
        <p>Multi-agent coordination hub</p>
      </div>
    </SharedElementLink>
  );
}

/**
 * Example 4: On the Project_Page side
 *
 * The Project_Page must have a matching layoutId element to complete the transition.
 * This is typically handled by the ProjectPage shell component.
 */
export function ProjectPageExample() {
  return (
    <motion.div layoutId="project-jarvis">
      <div className="project-page-header">
        <h1>Jarvis</h1>
        <p>Multi-agent coordination hub</p>
      </div>
      {/* Rest of the project page content */}
    </motion.div>
  );
}

/**
 * Notes:
 * 
 * 1. Reduced Motion: The component automatically detects prefers-reduced-motion
 *    and degrades to a simple fade transition (Req 18.4).
 * 
 * 2. layoutId Matching: The layoutId must be unique and must match between
 *    the source (Homepage card) and destination (Project_Page) for the
 *    shared-element transition to work.
 * 
 * 3. Next.js Navigation: Uses Next.js Link for client-side routing, so
 *    navigation is fast and the transition is smooth.
 * 
 * 4. Motion Config: Uses the motion resolver from lib/motion.ts to ensure
 *    consistent timing with the rest of the Motion_System (500ms duration).
 */
