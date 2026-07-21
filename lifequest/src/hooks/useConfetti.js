import { useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/gameStore';

export function useConfetti() {
  const animationsOn = useGameStore((s) => s.settings.animations);

  const fire = useCallback(
    (opts = {}) => {
      if (!animationsOn) return;
      confetti({
        particleCount: opts.particleCount || 120,
        spread: opts.spread || 80,
        origin: opts.origin || { y: 0.6 },
        colors: opts.colors || ['#22d3ee', '#a855f7', '#f472e0', '#facc15'],
        zIndex: 9999,
        ...opts,
      });
    },
    [animationsOn]
  );

  const fireBig = useCallback(() => {
    if (!animationsOn) return;
    const duration = 1500;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0 }, colors: ['#22d3ee', '#a855f7', '#f472e0'], zIndex: 9999 });
      confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1 }, colors: ['#22d3ee', '#a855f7', '#f472e0'], zIndex: 9999 });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, [animationsOn]);

  return { fire, fireBig };
}
