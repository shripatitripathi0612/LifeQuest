import React from 'react';
import { motion } from 'framer-motion';

export default function TodaysProgress({ completed, total, pct }) {
  return (
    <div className="glass-panel p-6 sm:p-8">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/35 mb-2">Today&rsquo;s Progress</p>
          <p className="text-sm text-white/50">
            <span className="text-white/85 font-semibold">{completed}</span> of{' '}
            <span className="text-white/85 font-semibold">{total}</span> habits complete
          </p>
        </div>
        <p className="text-3xl font-semibold text-white/90 tabular-nums shrink-0">{pct}%</p>
      </div>

      <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden mt-5">
        <motion.div
          className="h-full rounded-full bg-electric-500/80"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
