import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import LogoMark from './LogoMark';
import { getRandomGatewayQuote } from '../../utils/quotes';

const ORB_TRANSITION = (duration, delay = 0) => ({
  duration,
  delay,
  repeat: Infinity,
  repeatType: 'mirror',
  ease: 'easeInOut',
});

export default function GatewayScreen({ onDismiss }) {
  const quote = useMemo(() => getRandomGatewayQuote(), []);
  const [dismissing, setDismissing] = useState(false);
  const dismissTimer = useRef(null);

  // Subtle cursor-driven parallax on desktop — a barely-there depth cue, not
  // a gimmick. Touch devices simply never fire pointermove, so this quietly
  // does nothing there and the autonomous drift carries the whole effect.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(pointerY, { stiffness: 40, damping: 20 });
  const parallax1X = useTransform(smoothX, [-1, 1], [-14, 14]);
  const parallax1Y = useTransform(smoothY, [-1, 1], [-10, 10]);
  const parallax2X = useTransform(smoothX, [-1, 1], [10, -10]);
  const parallax2Y = useTransform(smoothY, [-1, 1], [8, -8]);

  useEffect(() => () => clearTimeout(dismissTimer.current), []);

  const handlePointerMove = (e) => {
    const { innerWidth, innerHeight } = window;
    pointerX.set((e.clientX / innerWidth) * 2 - 1);
    pointerY.set((e.clientY / innerHeight) * 2 - 1);
  };

  const handleDismiss = () => {
    if (dismissing) return;
    setDismissing(true);
    // Let the exit animation actually play before unmounting from the parent.
    dismissTimer.current = setTimeout(onDismiss, 700);
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label="Continue to LifeQuest"
      onClick={handleDismiss}
      onPointerMove={handlePointerMove}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleDismiss();
      }}
      initial={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
      animate={
        dismissing
          ? { opacity: 0, scale: 1.06, filter: 'blur(16px)' }
          : { opacity: 1, scale: 1, filter: 'blur(0px)' }
      }
      transition={
        dismissing
          ? { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
          : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
      }
      className="fixed inset-0 z-[300] bg-[#020203] overflow-hidden cursor-pointer select-none flex items-center justify-center"
    >
      {/* Cinematic background: slow-drifting, low-opacity gradient orbs with subtle pointer parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[60vw] h-[60vw] max-w-[640px] max-h-[640px] rounded-full"
          style={{
            top: '-10%',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(88,60,180,0.20), transparent 70%)',
            filter: 'blur(60px)',
            x: parallax1X,
            y: parallax1Y,
          }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={ORB_TRANSITION(14)}
        />
        <motion.div
          className="absolute w-[55vw] h-[55vw] max-w-[560px] max-h-[560px] rounded-full"
          style={{
            bottom: '-15%',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(34,140,180,0.16), transparent 70%)',
            filter: 'blur(70px)',
            x: parallax2X,
            y: parallax2Y,
          }}
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={ORB_TRANSITION(18, 1)}
        />
        <motion.div
          className="absolute w-[40vw] h-[40vw] max-w-[420px] max-h-[420px] rounded-full"
          style={{
            top: '35%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(120,80,200,0.10), transparent 75%)',
            filter: 'blur(80px)',
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={ORB_TRANSITION(10, 0.5)}
        />

        {/* Film grain — a whisper of texture so the gradients read as
            cinematic light rather than a flat digital glow. */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-overlay pointer-events-none">
          <filter id="gatewayGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#gatewayGrain)" />
        </svg>

        {/* Vignette for cinematic depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, transparent 30%, rgba(0,0,0,0.55) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center text-center px-6 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative flex items-center gap-2.5 mb-10"
        >
          <motion.div
            className="absolute left-0 w-8 h-8 rounded-lg"
            style={{ background: 'radial-gradient(circle, rgba(168,130,255,0.35), transparent 70%)', filter: 'blur(10px)' }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center">
            <LogoMark className="w-4 h-4 text-white/80" />
          </div>
          <span className="font-display text-base tracking-[0.2em] text-white/70 uppercase">LifeQuest</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="font-display font-normal text-2xl sm:text-3xl text-white/95 leading-relaxed tracking-normal mb-6 text-balance"
        >
          &ldquo;{quote}&rdquo;
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="text-xs tracking-[0.25em] uppercase text-white/35 mb-16"
        >
          Become the Hero of Your Own Story
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1 }}
          className="flex items-center gap-2"
        >
          <motion.span
            className="w-1 h-1 rounded-full bg-white/40"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.p
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-[11px] tracking-[0.2em] uppercase text-white/40"
          >
            Tap anywhere to continue
          </motion.p>
          <motion.span
            className="w-1 h-1 rounded-full bg-white/40"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
