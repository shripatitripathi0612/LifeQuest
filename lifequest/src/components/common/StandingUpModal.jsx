import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useConfetti } from '../../hooks/useConfetti';
import { useSound } from '../../hooks/useSound';

export default function StandingUpModal() {
  const lastStandingUp = useGameStore((s) => s.lastStandingUp);
  const [visible, setVisible] = React.useState(null);
  const { fireBig } = useConfetti();
  const { playStandingUp } = useSound();

  useEffect(() => {
    if (lastStandingUp) {
      setVisible(lastStandingUp.standing);
      fireBig();
      playStandingUp();
      const t = setTimeout(() => setVisible(null), 3200);
      return () => clearTimeout(t);
    }
  }, [lastStandingUp, fireBig, playStandingUp]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setVisible(null)}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 14 }}
            className="glass-panel px-10 py-10 text-center border-electric-500/40 shadow-glow max-w-sm mx-4"
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-electric-500 flex items-center justify-center shadow-glow mb-4"
            >
              <Flame className="w-10 h-10 text-white" />
            </motion.div>
            <p className="text-sm font-semibold tracking-widest text-cyan-400 uppercase mb-1">New Standing</p>
            <p className="font-display text-4xl font-black text-gradient mb-2">{visible}</p>
            <p className="text-slate-400 text-sm">You showed up, one day at a time. This one was earned.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
