import React, { useMemo } from 'react';
import { TrendingUp, Flame, Percent, Gauge, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useGameStore } from '../store/gameStore';
import YearHeatmap from '../components/analytics/YearHeatmap';
import CompletionTrendChart from '../components/analytics/CompletionTrendChart';
import AttributeRadar from '../components/analytics/AttributeRadar';
import StatSummaryCard from '../components/analytics/StatSummaryCard';
import {
  completionPercentage,
  longestStreakOverall,
  productivityScore,
  categoryBreakdown,
} from '../utils/analytics';

const PIE_COLORS = ['#22d3ee', '#a855f7', '#f472e0', '#facc15', '#4ade80', '#60a5fa', '#fb923c', '#5eead4', '#e879f9', '#94a3b8'];

export default function Analytics() {
  const habits = useGameStore((s) => s.habits);
  const completions = useGameStore((s) => s.completions);
  const player = useGameStore((s) => s.player);

  const stats = useMemo(
    () => ({
      completionPct: completionPercentage(habits, completions, 30),
      longestStreak: Math.max(longestStreakOverall(habits), player.longestStreak),
      score: productivityScore(habits, completions, player),
      categories: categoryBreakdown(habits, completions),
    }),
    [habits, completions, player]
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">Your growth, quantified.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatSummaryCard icon={Gauge} label="Productivity Score" value={stats.score} sub="out of 100" accent="text-electric-400" />
        <StatSummaryCard icon={Percent} label="Completion Rate" value={`${stats.completionPct}%`} sub="last 30 days" accent="text-cyan-400" />
        <StatSummaryCard icon={Flame} label="Longest Streak" value={stats.longestStreak} sub="days" accent="text-orange-400" />
        <StatSummaryCard icon={TrendingUp} label="Total Completions" value={completions.length} sub="all time" accent="text-magenta-400" />
      </div>

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-white mb-4">Yearly Activity</h3>
        <YearHeatmap completions={completions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-panel p-5">
          <h3 className="font-semibold text-white mb-2">Completion Trends</h3>
          <CompletionTrendChart completions={completions} />
        </div>

        <div className="glass-panel p-5">
          <h3 className="font-semibold text-white mb-2">Life Attributes</h3>
          <AttributeRadar attributes={player.attributes} />
        </div>
      </div>

      <div className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <PieIcon className="w-4 h-4 text-electric-400" />
          <h3 className="font-semibold text-white">Habits by Category</h3>
        </div>
        {stats.categories.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">Complete some habits to see your category breakdown.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={stats.categories} dataKey="count" nameKey="category" innerRadius={60} outerRadius={95} paddingAngle={2}>
                {stats.categories.map((entry, i) => (
                  <Cell key={entry.category} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#10142b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
