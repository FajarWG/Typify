"use client";

import styles from "./SkipLink.module.css";

/**
 * SkipLink
 * Hidden until focused via keyboard Tab. Lets keyboard-only users jump
 * past the document chrome directly to the main content. The target
 * `<main>` element gets `tabindex="-1"` so it can receive programmatic
 * focus from the skip-link click.
 */
export function SkipLink({ targetId = "main" }: { targetId?: string }) {
  return (
    <a className={styles.skip} href={`#${targetId}`}>
      Skip to main content
    </a>
  );
}