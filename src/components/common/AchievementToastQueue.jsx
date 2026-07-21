import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useConfetti } from '../../hooks/useConfetti';

const VISIBLE_MS = 5000;

export default function AchievementToastQueue() {
  const lastAchievements = useGameStore((s) => s.lastAchievements);
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const { fire } = useConfetti();
  const navigate = useNavigate();

  useEffect(() => {
    if (lastAchievements && lastAchievements.length > 0) {
      setQueue((q) => [...q, ...lastAchievements]);
    }
  }, [lastAchievements]);

  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue((q) => q.slice(1));
      fire({ particleCount: 80, spread: 70, origin: { y: 0.3 } });
      const t = setTimeout(() => setCurrent(null), VISIBLE_MS);
      return () => clearTimeout(t);
    }
  }, [queue, current, fire]);

  if (!current) return null;
  const Icon = Icons[current.icon] || Icons.Trophy;

  const handleClick = () => {
    setCurrent(null);
    navigate('/app/achievements');
  };

  return (
    <AnimatePresence>
      <motion.button
        key={current.id}
        onClick={handleClick}
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -60, transition: { duration: 0.5, ease: 'easeIn' } }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] glass-panel px-5 py-3.5 flex items-center gap-3 border-yellow-500/30 shadow-glow max-w-sm w-[90vw] text-left cursor-pointer"
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shrink-0 shadow-glow-sm animate-pulse-glow">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-yellow-400 font-semibold">Achievement Unlocked</p>
          <p className="text-sm font-bold text-white truncate">{current.title}</p>
          <p className="text-xs text-slate-400 truncate">{current.description}</p>
        </div>
      </motion.button>
    </AnimatePresence>
  );
}
