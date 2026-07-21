import React, { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { useGameStore } from '../../store/gameStore';
import { lastNDays } from '../../utils/dateHelpers';

export default function WeekStrip() {
  const completions = useGameStore((s) => s.completions);
  const days = useMemo(() => lastNDays(7), []);

  const countsByDay = useMemo(() => {
    const map = {};
    completions.forEach((c) => {
      map[c.date] = (map[c.date] || 0) + 1;
    });
    return map;
  }, [completions]);

  const maxCount = Math.max(1, ...days.map((d) => countsByDay[d] || 0));

  return (
    <div className="flex items-end justify-between gap-2 h-24">
      {days.map((d) => {
        const count = countsByDay[d] || 0;
        const heightPct = count === 0 ? 6 : Math.max(20, (count / maxCount) * 100);
        const isToday = d === format(new Date(), 'yyyy-MM-dd');
        return (
          <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full h-16 flex items-end">
              <div
                className={`w-full rounded-md transition-all ${
                  count > 0 ? 'bg-gradient-to-t from-electric-500 to-cyan-400' : 'bg-white/5'
                } ${isToday ? 'ring-2 ring-cyan-400/60' : ''}`}
                style={{ height: `${heightPct}%` }}
              />
            </div>
            <span className={`text-[10px] font-medium ${isToday ? 'text-cyan-400' : 'text-slate-500'}`}>
              {format(parseISO(d), 'EEEEE')}
            </span>
          </div>
        );
      })}
    </div>
  );
}
