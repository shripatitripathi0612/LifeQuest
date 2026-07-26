import React from 'react';

/**
 * LifeQuest's brand mark — "The Ascent Line."
 *
 * A single tapered stroke following one gentle, continuous arc — thick and
 * grounded at the lower-left, thinning as it rises to the upper-right. It's
 * a segment of one large, quiet curve (not a tight hook or a checkmark),
 * so it reads as a path, a horizon curving away, and a compass bearing all
 * at once — without any of them being literal.
 *
 * Deliberately one gesture, not a combination of parts: no separate sun
 * shape, no second element layered in. See brand documentation for the
 * full rationale and the concepts explored and rejected before this one.
 *
 * Inherits `currentColor` so it can be placed on any background/color
 * context (sidebar, gateway screen, favicon wrapper, etc.) via className.
 */
export default function LogoMark({ className = 'w-5 h-5', ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M21.49 19.28 L20.62 16.26 L19.37 13.42 L17.76 10.80 L15.83 8.44 L13.41 6.22 L10.96 4.53 L8.33 3.20 L5.57 2.25 L2.74 1.68 L2.49 2.82 L5.02 3.78 L7.36 5.05 L9.49 6.61 L11.37 8.42 L13.09 10.64 L14.36 12.85 L15.30 15.18 L15.91 17.59 L16.19 20.02 L16.31 20.53 L16.53 21.01 L16.84 21.43 L17.23 21.79 L17.67 22.06 L18.17 22.24 L18.68 22.32 L19.21 22.30 L19.72 22.17 L20.19 21.95 L20.62 21.64 L20.97 21.26 L21.25 20.81 L21.43 20.32 L21.51 19.80 Z" />
    </svg>
  );
}
