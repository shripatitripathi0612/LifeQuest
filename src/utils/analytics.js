import { lastNDays } from './dateHelpers';

/** Percentage of due habit-days actually completed over the last N days (approximation using active habits count). */
export function completionPercentage(habits, completions, days = 30) {
  const activeHabits = habits.filter((h) => h.status === 'active');
  if (activeHabits.length === 0) return 0;
  const window = lastNDays(days);
  const possible = activeHabits.length * window.length;
  const actual = completions.filter((c) => window.includes(c.date)).length;
  return Math.min(100, Math.round((actual / possible) * 100));
}

export function longestStreakOverall(habits) {
  return habits.reduce((max, h) => Math.max(max, h.longestStreak || 0), 0);
}

/** A composite 0-100 "productivity score" blending consistency, volume, and streak health. */
export function productivityScore(habits, completions, player) {
  const consistency = completionPercentage(habits, completions, 30);
  const recentVolume = Math.min(
    100,
    (completions.filter((c) => lastNDays(7).includes(c.date)).length / Math.max(1, habits.length * 7)) * 100
  );
  const streakHealth = Math.min(100, (player.streak / 14) * 100);
  return Math.round(consistency * 0.45 + recentVolume * 0.35 + streakHealth * 0.2);
}

export function categoryBreakdown(habits, completions) {
  const map = {};
  completions.forEach((c) => {
    const habit = habits.find((h) => h.id === c.habitId);
    if (!habit) return;
    map[habit.category] = (map[habit.category] || 0) + 1;
  });
  return Object.entries(map)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}
