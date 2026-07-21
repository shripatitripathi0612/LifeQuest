import React from 'react';
import * as Icons from 'lucide-react';
import { attributeProgress, attributeTier } from '../../utils/attributes';

export default function AttributeBar({ attribute, points }) {
  const Icon = Icons[attribute.icon] || Icons.Star;
  const progress = attributeProgress(points);
  const tier = attributeTier(points);

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${attribute.color}20` }}
      >
        <Icon className="w-4 h-4" style={{ color: attribute.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-slate-300">{attribute.label}</span>
          <span className="text-xs font-bold text-slate-400">{tier}</span>
        </div>
        <div className="h-1.5 rounded-full bg-navy-900 border border-white/5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%`, backgroundColor: attribute.color }}
          />
        </div>
      </div>
    </div>
  );
}
