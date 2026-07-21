// Life attributes (Intelligence, Discipline, etc.) track raw completion
// points — no XP curve, no fake leveling. Progress is a simple linear scale
// toward a "mastery" target, described with a qualitative tier rather than
// a level number.

export const ATTRIBUTE_MASTERY_TARGET = 40;

const TIERS = [
  { min: 0, label: 'Emerging' },
  { min: 8, label: 'Developing' },
  { min: 20, label: 'Established' },
  { min: ATTRIBUTE_MASTERY_TARGET, label: 'Mastered' },
];

export function attributeProgress(points) {
  return Math.min(1, Math.max(0, (points || 0) / ATTRIBUTE_MASTERY_TARGET));
}

export function attributeTier(points) {
  let tier = TIERS[0];
  for (const t of TIERS) {
    if ((points || 0) >= t.min) tier = t;
  }
  return tier.label;
}
