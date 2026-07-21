import React from 'react';
import { motion } from 'framer-motion';
import { getStandingProgress } from '../../utils/standing';

export default function NextStandingCard({ streak }) {
  const { current, next, progress, daysRemaining } = getStandingProgress(streak);

  return (
    <div className="glass-panel p-5 sm:p-6 relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-electric-500/10 blur-3xl" />
      <div className="relative flex items-center justify-between mb-5">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-1">Current Standing</p>
          <p className="font-display text-2xl font-bold text-white">{current.name}</p>
        </div>
        {next && (
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-1">Next</p>
            <p className="font-display text-2xl font-bold text-gradient">{next.name}</p>
          </div>
        )}
      </div>

      <div className="relative">
        <div className="h-2.5 rounded-full bg-navy-900 border border-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 via-electric-500 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ boxShadow: '0 0 12px rgba(168,85,247,0.5)' }}
          />
        </div>
        <p className="text-center text-sm text-slate-400 mt-3">
          {next ? (
            <>
              <span className="text-white font-semibold">{daysRemaining} day{daysRemaining === 1 ? '' : 's'}</span> until{' '}
              <span className="text-electric-300 font-semibold">{next.name}</span>
            </>
          ) : (
            <span className="text-white font-semibold">You've reached the top of the ladder. Living Legend.</span>
          )}
        </p>
      </div>
    </div>
  );
}
