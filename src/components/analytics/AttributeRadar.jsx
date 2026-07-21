import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ATTRIBUTES } from '../../utils/constants';
import { ATTRIBUTE_MASTERY_TARGET } from '../../utils/attributes';

export default function AttributeRadar({ attributes }) {
  const data = ATTRIBUTES.map((a) => ({
    attribute: a.label,
    points: Math.min(ATTRIBUTE_MASTERY_TARGET, attributes[a.key] || 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis dataKey="attribute" tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, ATTRIBUTE_MASTERY_TARGET]} tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} />
        <Radar name="Focus" dataKey="points" stroke="#a855f7" fill="#a855f7" fillOpacity={0.35} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
