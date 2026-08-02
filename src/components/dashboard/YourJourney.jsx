import React from 'react';
import { Flame, Trophy, Target, ArrowUpRight } from 'lucide-react';
import { getStanding, getNextStanding } from '../../utils/standing';

function Row({ icon: Icon, label, value, accent = 'text-white/85' }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
      <div className="flex items-center gap-2.5 text-slate-400">
        <Icon className="w-4 h-4" />
        <span className="text-sm">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${accent}`}>{value}</span>
    </div>
  );
}

export default function YourJourney({ streak, longestStreak, todaysCompletionPct }) {
  const standing = getStanding(streak);
  const next = getNextStanding(streak);

  return (
    <div className="glass-panel p-6 sm:p-8">
      <h3 className="text-[15px] font-semibold text-white tracking-tight mb-1.5">Your Journey</h3>
      <p className="text-xs text-slate-500 mb-5">A quiet record of showing up.</p>

      <Row icon={Flame} label="Current Streak" value={`${streak} day${streak === 1 ? '' : 's'}`} />
      <Row icon={Trophy} label="Longest Streak" value={`${longestStreak} day${longestStreak === 1 ? '' : 's'}`} />
      <Row icon={ArrowUpRight} label="Standing" value={standing.name} accent="text-electric-400" />
      <Row icon={Target} label="Today's Completion" value={`${todaysCompletionPct}%`} />
      {next && (
        <>
          <Row icon={Flame} label="Next Standing" value={next.name} />
          <Row icon={Target} label="Days Remaining" value={`${next.day - streak}`} />
        </>
      )}
    </div>
  );
}
