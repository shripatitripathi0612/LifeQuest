import React, { useMemo } from 'react';
import * as Icons from 'lucide-react';
import { Lock } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENTS, TITLES } from '../utils/constants';
import { formatFriendly } from '../utils/dateHelpers';

export default function Achievements() {
  const player = useGameStore((s) => s.player);

  const unlockedCount = Object.keys(player.achievements).length;
  const total = ACHIEVEMENTS.length;

  const visible = useMemo(
    () => ACHIEVEMENTS.filter((a) => !a.hidden || player.achievements[a.id]),
    [player.achievements]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Achievements</h2>
        <p className="text-sm text-slate-400">{unlockedCount} of {total} unlocked — some are hidden until discovered.</p>
      </div>

      <div className="glass-panel p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-300 font-medium">Collection Progress</span>
          <span className="text-sm text-electric-400 font-bold">{Math.round((unlockedCount / total) * 100)}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-navy-900 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-electric-500" style={{ width: `${(unlockedCount / total) * 100}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map((ach) => {
          const unlocked = Boolean(player.achievements[ach.id]);
          const Icon = Icons[ach.icon] || Icons.Award;
          return (
            <div key={ach.id} className={`glass-panel p-4 flex items-start gap-3 ${!unlocked ? 'opacity-50' : ''}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${unlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-white/5'}`}>
                {unlocked ? <Icon className="w-5 h-5 text-white" /> : <Lock className="w-5 h-5 text-slate-600" />}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-white text-sm">{ach.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{ach.description}</p>
                {unlocked && (
                  <p className="text-[10px] text-slate-600 mt-1.5">Unlocked {formatFriendly(player.achievements[ach.id].slice(0, 10))}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h3 className="font-display text-lg font-bold text-white mb-3">Titles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TITLES.map((t) => {
            const unlocked = player.titles.includes(t.key);
            return (
              <div key={t.key} className={`glass-panel p-4 ${!unlocked ? 'opacity-50' : ''}`}>
                <p className="font-semibold text-white text-sm">{t.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t.condition}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
