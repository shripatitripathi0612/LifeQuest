import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

const MESSAGES = [
  { line1: 'The streak ended.', line2: 'The journey didn\u2019t.' },
  { line1: 'Every legend has restarted.', line2: 'Begin again.' },
];

export default function StreakResetNotice() {
  const lastStreakBreak = useGameStore((s) => s.lastStreakBreak);
  const [visible, setVisible] = useState(null);

  useEffect(() => {
    if (lastStreakBreak) {
      setVisible(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
      const t = setTimeout(() => setVisible(null), 5000);
      return () => clearTimeout(t);
    }
  }, [lastStreakBreak]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
          onClick={() => setVisible(null)}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-sm"
          >
            <p className="font-display text-2xl sm:text-3xl text-white/95 leading-snug">{visible.line1}</p>
            <p className="font-display text-2xl sm:text-3xl text-white/60 leading-snug mt-1">{visible.line2}</p>
            <p className="text-xs tracking-[0.2em] uppercase text-slate-500 mt-8">Tap anywhere to continue</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
