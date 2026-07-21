import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LogoMark from './LogoMark';

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-500 to-cyan-400 flex items-center justify-center shadow-glow-sm">
            <LogoMark className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">LifeQuest</span>
        </Link>

        <div className="glass-panel p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-white text-center mb-1">{title}</h2>
          {subtitle && <p className="text-sm text-slate-400 text-center mb-6">{subtitle}</p>}
          {children}
        </div>

        {footer && <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>}
      </motion.div>
    </div>
  );
}
