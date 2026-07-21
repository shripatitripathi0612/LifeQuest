import React from 'react';

export default function StatSummaryCard({ icon: Icon, label, value, sub, accent = 'text-electric-400' }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">{label}</span>
        {Icon && <Icon className={`w-4 h-4 ${accent}`} />}
      </div>
      <p className="text-2xl font-black text-white font-display mt-1">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}
