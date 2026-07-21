import { useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

// Generates small, pleasant blips with the WebAudio API so the app needs no
// external sound asset files while still providing real audio feedback.
export function useSound() {
  const soundOn = useGameStore((s) => s.settings.sound);
  const ctxRef = useRef(null);

  const getCtx = () => {
    if (!ctxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  };

  const blip = useCallback(
    (freq = 660, duration = 0.12, type = 'sine', gainVal = 0.05) => {
      if (!soundOn) return;
      try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(gainVal, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // audio not available in this environment — fail silently
      }
    },
    [soundOn]
  );

  const playComplete = useCallback(() => blip(880, 0.15, 'triangle', 0.06), [blip]);
  const playStandingUp = useCallback(() => {
    blip(523, 0.12, 'triangle', 0.07);
    setTimeout(() => blip(659, 0.12, 'triangle', 0.07), 120);
    setTimeout(() => blip(880, 0.25, 'triangle', 0.08), 240);
  }, [blip]);
  const playClick = useCallback(() => blip(440, 0.06, 'square', 0.03), [blip]);
  const playError = useCallback(() => blip(180, 0.18, 'sawtooth', 0.05), [blip]);

  return { playComplete, playStandingUp, playClick, playError };
}
