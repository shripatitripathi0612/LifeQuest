import React from 'react';

/**
 * LifeQuest's brand mark — "The Ascent."
 *
 * A single asymmetric, architecturally-tapered form: mostly straight edges
 * in tension, softened only at the tip and base with a consistent radius,
 * plus one controlled curve on the right edge. It reads as an inner flame
 * and an ascending line at once, without needing either to be literal.
 *
 * Deliberately NOT decorated further — no gradient, no inner cutouts, no
 * second motif layered in. See brand documentation for the full rationale.
 *
 * Inherits `currentColor` so it can be placed on any background/color
 * context (sidebar, gateway screen, favicon wrapper, etc.) via className.
 */
export default function LogoMark({ className = 'w-5 h-5', ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M7.20 20.47 L8.82 22.13 L15.05 21.37 L18.52 12.49 L18.27 11.17 L17.87 9.96 L17.37 8.85 L16.79 7.82 L16.17 6.85 L15.54 5.91 L14.94 4.98 L14.39 4.05 L13.94 3.09 L13.60 2.08 L10.61 1.68 L6.21 8.00 L5.48 10.84 L7.53 22.32 Z" />
    </svg>
  );
}
