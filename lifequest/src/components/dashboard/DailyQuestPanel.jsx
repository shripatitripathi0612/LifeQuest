import React from 'react';
import { CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export default function DailyQuestPanel() {
  const dailyQuestState = useGameStore((s) => s.dailyQuestState);

  if (!dailyQuestState) return null;

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <h3 className="font-semibold text-white text-sm">Daily Quests</h3>
      </div>
      <div className="flex flex-col gap-2.5">
        {dailyQuestState.quests.map((q) => (
          <div key={q.id} className="flex items-center gap-3">
            {q.completed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-slate-600 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium truncate ${q.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                {q.description}
              </p>
              <div className="h-1 rounded-full bg-navy-900 mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-electric-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-semibold shrink-0">{q.progress}/{q.target}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
