import React, { useMemo, useState } from 'react';
import { Bot, TrendingUp, TrendingDown, Sparkles, Compass, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { generateGuildReport } from '../utils/guildMaster';
import EmptyState from '../components/common/EmptyState';

export default function GuildMaster() {
  const habits = useGameStore((s) => s.habits);
  const completions = useGameStore((s) => s.completions);
  const player = useGameStore((s) => s.player);
  const [period, setPeriod] = useState('weekly');

  const report = useMemo(
    () => generateGuildReport({ habits, completions, player, period }),
    [habits, completions, player, period]
  );

  if (habits.length === 0) {
    return (
      <EmptyState
        icon={Bot}
        title="The Guild Master awaits your first habit"
        description="Create a few habits and check back — your coach needs some activity to analyze."
      />
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-electric-400" /> Guild Master
          </h2>
          <p className="text-sm text-slate-500 mt-1">Your personal AI coach, reading the patterns in your quest log.</p>
        </div>
        <div className="flex gap-1">
          {['weekly', 'monthly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition-colors ${
                period === p ? 'bg-electric-500/20 text-electric-300 border border-electric-500/30' : 'text-slate-500 hover:text-slate-300 border border-transparent'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={period}
        className="glass-panel p-6 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-electric-500/10 blur-3xl" />
        <div className="flex items-start gap-4 relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-electric-500 to-cyan-400 flex items-center justify-center shrink-0 shadow-glow-sm">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-electric-400 font-semibold mb-1">{period} Report</p>
            <p className="text-slate-200 leading-relaxed">{report.motivational}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <div className="stat-card">
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-medium">
            <Gauge className="w-3.5 h-3.5" /> Productivity Score
          </div>
          <p className="text-3xl font-black text-white font-display mt-1">{report.score}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> Completion Rate
          </div>
          <p className="text-3xl font-black text-white font-display mt-1">{report.completionPct}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-3 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            <h3 className="font-semibold text-white text-sm">Strengths</h3>
          </div>
          {report.strengths.length === 0 ? (
            <p className="text-sm text-slate-500">Not enough consistent data yet — check back after a few more completions.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {report.strengths.map((s) => (
                <li key={s} className="text-sm text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-3 text-red-400">
            <TrendingDown className="w-4 h-4" />
            <h3 className="font-semibold text-white text-sm">Needs Attention</h3>
          </div>
          {report.weaknesses.length === 0 ? (
            <p className="text-sm text-slate-500">Nothing is falling behind right now — nicely balanced.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {report.weaknesses.map((w) => (
                <li key={w} className="text-sm text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> {w}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-white text-sm mb-3">Coach's Suggestions</h3>
        <ul className="flex flex-col gap-3">
          {report.suggestions.map((s, i) => (
            <li key={i} className="text-sm text-slate-300 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-electric-500/15 text-electric-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-3 text-cyan-400">
          <Compass className="w-4 h-4" />
          <h3 className="font-semibold text-white text-sm">Future Prediction</h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{report.prediction}</p>
      </div>

      <p className="text-xs text-slate-600 text-center">
        The Guild Master analyzes your local habit data with rule-based heuristics — no external AI calls, fully private.
      </p>
    </div>
  );
}
