import React from 'react';
import { motion } from 'framer-motion';
import { getStandingProgress } from '../../utils/standing';
import { AVATARS } from '../../utils/constants';
import AnimatedNumber from '../common/AnimatedNumber';

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

function Stat({ label, value, delay, mono = false }) {
  return (
    <motion.div custom={delay} initial="hidden" animate="show" variants={fadeUp} className="flex-1 min-w-0">
      <p className="text-[11px] uppercase tracking-[0.16em] text-white/35 mb-2">{label}</p>
      <p className={`text-xl sm:text-[28px] font-semibold text-white/90 leading-none truncate ${mono ? 'font-display' : 'font-body'}`}>
        {value}
      </p>
    </motion.div>
  );
}

export default function DashboardHero({ streak, avatarKey, todaysCompletionPct }) {
  const { current, progress } = getStandingProgress(streak);
  const avatar = AVATARS.find((a) => a.key === avatarKey) || AVATARS[0];

  return (
    <div className="hero-surface px-5 py-9 sm:px-12 sm:py-14">
      {/* A single, slow, near-static highlight — the only ambient motion,
          restrained on purpose. No purple; a quiet warm-white glow instead. */}
      <motion.div
        aria-hidden
        className="absolute -top-24 left-1/3 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)' }}
        animate={{ x: [0, 24, 0], y: [0, 14, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Quiet profile indicator — present, but deliberately unobtrusive;
          this is an operating system greeting you, not a character sheet. */}
      <motion.span
        custom={0}
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="absolute top-7 right-5 sm:top-10 sm:right-10 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm"
        title={avatar.label}
      >
        {avatar.emoji}
      </motion.span>

      <div className="relative flex flex-col gap-9 sm:gap-10 max-w-2xl pr-12 sm:pr-0">
        {/* The message, first — this is the whole point of the hero */}
        <div>
          <motion.h1
            custom={0.05}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="font-display text-3xl sm:text-5xl font-bold text-white leading-[1.15] tracking-tight"
          >
            Show Up Today.
            <br />
            Become Unbreakable.
          </motion.h1>
          <motion.p
            custom={0.16}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-base text-white/45 mt-4 leading-relaxed"
          >
            Your future isn&rsquo;t built tomorrow. It&rsquo;s built today.
          </motion.p>
        </div>

        {/* Standing, streak, today's progress — the calm centerpiece */}
        <div className="flex items-end gap-4 sm:gap-10 pt-2 border-t border-white/[0.06]">
          <Stat label="Standing" value={current.name} delay={0.26} mono />
          <div className="w-px self-stretch bg-white/[0.06]" />
          <Stat
            label="Streak"
            value={<><AnimatedNumber value={streak} className="font-display" /> <span className="text-base text-white/40 font-body">day{streak === 1 ? '' : 's'}</span></>}
            delay={0.32}
            mono
          />
          <div className="w-px self-stretch bg-white/[0.06]" />
          <Stat label="Today" value={`${todaysCompletionPct}%`} delay={0.38} />
        </div>

        {/* Progress toward next standing — a quiet line, not a HUD bar */}
        <motion.div custom={0.44} initial="hidden" animate="show" variants={fadeUp}>
          <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden max-w-md">
            <motion.div
              className="hero-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
