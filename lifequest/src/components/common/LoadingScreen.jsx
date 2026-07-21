import React from 'react';
import { motion } from 'framer-motion';
import LogoMark from './LogoMark';

export default function LoadingScreen({ label = 'Loading LifeQuest...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-electric-500 to-cyan-400 flex items-center justify-center shadow-glow"
      >
        <LogoMark className="w-7 h-7 text-white" />
      </motion.div>
      <p className="text-slate-400 text-sm font-medium tracking-wide">{label}</p>
    </div>
  );
}
