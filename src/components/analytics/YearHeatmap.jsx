import React, { useMemo, useState } from 'react';
import { daysInYear } from '../../utils/dateHelpers';
import { parseISO, getDay } from 'date-fns';

export default function YearHeatmap({ completions }) {
  const [year, setYear] = useState(new Date().getFullYear());

  const countsByDate = useMemo(() => {
    const map = {};
    completions.forEach((c) => {
      map[c.date] = (map[c.date] || 0) + 1;
    });
    return map;
  }, [completions]);

  const days = useMemo(() => daysInYear(year), [year]);

  // Build week columns starting from the first Sunday on/before Jan 1
  const weeks = useMemo(() => {
    const first = parseISO(days[0]);
    const padStart = getDay(first);
    const padded = [...Array(padStart).fill(null), ...days];
    const cols = [];
    for (let i = 0; i < padded.length; i += 7) {
      cols.push(padded.slice(i, i + 7));
    }
    return cols;
  }, [days]);

  const maxCount = Math.max(1, ...Object.values(countsByDate));

  const colorFor = (count) => {
    if (!count) return 'bg-white/5';
    const ratio = count / maxCount;
    if (ratio > 0.75) return 'bg-electric-500';
    if (ratio > 0.5) return 'bg-electric-500/70';
    if (ratio > 0.25) return 'bg-electric-500/45';
    return 'bg-electric-500/25';
  };

  const totalCompletions = days.reduce((sum, d) => sum + (countsByDate[d] || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-500">{totalCompletions} completions in {year}</p>
        <div className="flex items-center gap-2">
          <button onClick={() => setYear((y) => y - 1)} className="btn-ghost text-xs px-2 py-1">←</button>
          <span className="text-xs text-slate-400 font-medium w-12 text-center">{year}</span>
          <button
            onClick={() => setYear((y) => Math.min(new Date().getFullYear(), y + 1))}
            className="btn-ghost text-xs px-2 py-1"
            disabled={year >= new Date().getFullYear()}
          >
            →
          </button>
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-none pb-2">
        <div className="flex gap-[3px]" style={{ minWidth: weeks.length * 13 }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  title={day ? `${day}: ${countsByDate[day] || 0} completions` : ''}
                  className={`w-[10px] h-[10px] rounded-sm ${day ? colorFor(countsByDate[day]) : 'bg-transparent'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-[10px] text-slate-500">Less</span>
        {['bg-white/5', 'bg-electric-500/25', 'bg-electric-500/45', 'bg-electric-500/70', 'bg-electric-500'].map((c) => (
          <div key={c} className={`w-[10px] h-[10px] rounded-sm ${c}`} />
        ))}
        <span className="text-[10px] text-slate-500">More</span>
      </div>
    </div>
  );
}
