import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Trophy, TrendingUp, Target, Sparkles, ArrowRight } from 'lucide-react';
import LogoMark from '../components/common/LogoMark';

const FEATURES = [
  { icon: Zap, title: 'Standing System', desc: 'Earn Standing through consistency — from Awakened to Living Legend — as your streak compounds into real change.' },
  { icon: Target, title: 'Daily & Weekly Quests', desc: 'Fresh objectives every day and rotating weekly challenges keep momentum high.' },
  { icon: Trophy, title: 'Achievements & Titles', desc: 'Unlock badges, titles, and hidden achievements as you push your limits.' },
  { icon: TrendingUp, title: 'Deep Analytics', desc: 'Yearly heatmaps, streak tracking, and a life-attribute radar chart show your growth.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-electric-500 to-cyan-400 flex items-center justify-center shadow-glow-sm">
            <LogoMark className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">LifeQuest</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost">Sign In</Link>
          <Link to="/signup" className="btn-primary">Get Started</Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 badge mb-6">
            <Sparkles className="w-3.5 h-3.5 text-electric-400" />
            Discipline, forged daily
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-white leading-tight mb-5">
            Show Up Today.
            <br />
            <span className="text-gradient">Become Unbreakable.</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Build habits, complete quests, and earn your Standing — one unbroken day at a time. No partial
            credit. No grinding for XP. Just you, showing up.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/signup" className="btn-primary text-base px-7 py-3">
              Start Your Quest <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-7 py-3">
              I have an account
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="glass-panel-hover p-5"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-500/20 to-cyan-400/20 border border-white/10 flex items-center justify-center mb-3">
              <f.icon className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">{f.title}</h3>
            <p className="text-sm text-slate-400">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-white/5 text-center text-xs text-slate-500">
        LifeQuest — Discipline, forged one day at a time.
      </footer>
    </div>
  );
}
