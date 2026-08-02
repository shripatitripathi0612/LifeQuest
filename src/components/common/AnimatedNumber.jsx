import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../store/gameStore';

/**
 * Animates a number counting up from 0 to `value` on mount/value-change.
 * Purely presentational — the value itself never changes, only how it's
 * revealed. Respects the existing Settings > Animations toggle, same as
 * every other animation in the app (confetti, page transitions, etc.).
 */
export default function AnimatedNumber({ value, duration = 900, className }) {
  const animationsOn = useGameStore((s) => s.settings.animations);
  const [display, setDisplay] = useState(animationsOn ? 0 : value);
  const frameRef = useRef();

  useEffect(() => {
    if (!animationsOn) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic — quick start, gentle settle
      setDisplay(Math.round(value * eased));
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration, animationsOn]);

  return <span className={className}>{display}</span>;
}
