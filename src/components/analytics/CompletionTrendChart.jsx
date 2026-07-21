import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { lastNDays } from '../../utils/dateHelpers';

const RANGE_OPTIONS = [
  { key: 7, label: '7D' },
  { key: 30, label: '30D' },
  { key: 90, label: '90D' },
];

export default function CompletionTrendChart({ completions }) {
  const [range, setRange] = useState(30);

  const data = useMemo(() => {
    const days = lastNDays(range);
    const counts = {};
    completions.forEach((c) => {
      counts[c.date] = (counts[c.date] || 0) + 1;
    });
    return days.map((d) => ({
      date: format(parseISO(d), range > 30 ? 'MMM d' : 'EEE d'),
      completions: counts[d] || 0,
    }));
  }, [completions, range]);

  return (
    <div>
      <div className="flex items-center justify-end gap-1 mb-2">
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setRange(opt.key)}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
              range === opt.key ? 'bg-electric-500/20 text-electric-300 border border-electric-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} interval={Math.floor(data.length / 8)} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} allowDecimals={false} axisLine={false} tickLine={false} width={24} />
          <Tooltip
            contentStyle={{ background: '#10142b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
            labelStyle={{ color: '#e2e8f0' }}
            cursor={{ fill: 'rgba(168,85,247,0.08)' }}
          />
          <Bar dataKey="completions" radius={[4, 4, 0, 0]} fill="#a855f7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
