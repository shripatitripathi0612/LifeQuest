import React, { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { useGameStore } from '../../store/gameStore';
import { lastNDays } from '../../utils/dateHelpers';

// A short, calm interpretation of the week's trend — purely a presentational
// read of data the component already has (completion counts per day), not a
// new calculation feeding back into streaks/standing/store state.
function interpretTrend(counts) {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) {
    return 'A quiet week so far. Today is a good place to start.';
  }

  const firstHalf = counts.slice(0, 3);
  const secondHalf = counts.slice(4);
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const early = avg(firstHalf);
  const late = avg(secondHalf);

  const allActive = counts.every((c) => c > 0);
  if (allActive) return 'Keep the chain alive.';
  if (late > early + 0.5) return 'Consistency is building.';
  if (late < early - 0.5) return "A slower stretch — today can turn it around.";
  return "You're showing up.";
}

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

  const counts = useMemo(() => days.map((d) => countsByDay[d] || 0), [days, countsByDay]);
  const maxCount = Math.max(1, ...counts);
  const trend = useMemo(() => interpretTrend(counts), [counts]);

  return (
    <div>
      <div className="flex items-end justify-between gap-2 h-24">
        {days.map((d, i) => {
          const count = counts[i];
          const heightPct = count === 0 ? 6 : Math.max(20, (count / maxCount) * 100);
          const isToday = d === format(new Date(), 'yyyy-MM-dd');
          return (
            <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full h-16 flex items-end">
                <div
                  className={`w-full rounded-md transition-all duration-300 ${
                    count > 0 ? 'bg-electric-500/70' : 'bg-white/5'
                  } ${isToday ? 'ring-1 ring-electric-400/50' : ''}`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className={`text-[10px] font-medium ${isToday ? 'text-electric-400' : 'text-slate-500'}`}>
                {format(parseISO(d), 'EEEEE')}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-500 mt-4">{trend}</p>
    </div>
  );
}
