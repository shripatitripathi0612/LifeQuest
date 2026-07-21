import { lastNDays } from './dateHelpers';
import { ATTRIBUTES } from './constants';
import { completionPercentage, productivityScore } from './analytics';
import { getStanding, getNextStanding } from './standing';

function habitConsistency(habit, completions, days) {
  const window = lastNDays(days);
  const done = completions.filter((c) => c.habitId === habit.id && window.includes(c.date)).length;
  return done / days;
}

export function generateGuildReport({ habits, completions, player, period = 'weekly' }) {
  const days = period === 'weekly' ? 7 : 30;
  const activeHabits = habits.filter((h) => h.status === 'active');

  const ranked = activeHabits
    .map((h) => ({ habit: h, consistency: habitConsistency(h, completions, days) }))
    .sort((a, b) => b.consistency - a.consistency);

  const strengths = ranked.filter((r) => r.consistency >= 0.6).slice(0, 3);
  const weaknesses = ranked.filter((r) => r.consistency <= 0.3).slice(0, 3);

  const attrPoints = ATTRIBUTES.map((a) => ({
    ...a,
    points: player.attributes[a.key] || 0,
  })).sort((a, b) => b.points - a.points);

  const topAttribute = attrPoints[0];
  const laggingAttribute = attrPoints[attrPoints.length - 1];

  const score = productivityScore(habits, completions, player);
  const completionPct = completionPercentage(habits, completions, days);

  const suggestions = [];
  if (weaknesses.length > 0) {
    suggestions.push(
      `"${weaknesses[0].habit.name}" has fallen behind — try pairing it with a habit you already do consistently, or lower its difficulty temporarily to rebuild momentum.`
    );
  }
  if (player.streak < 3) {
    suggestions.push('Your streak is fragile right now. Protect it today by completing every habit before anything else on your list — discipline is binary, so one miss resets it.');
  }
  if (laggingAttribute && topAttribute && laggingAttribute.points < topAttribute.points - 8) {
    suggestions.push(`${laggingAttribute.label} is lagging behind your other life areas. Consider adding one small habit tied to it this week.`);
  }
  if (activeHabits.length > 8) {
    suggestions.push('You have a lot of active habits. Consider archiving or pausing lower-priority ones — with a binary streak, fewer well-kept habits beat many half-kept ones.');
  }
  if (activeHabits.length < 3) {
    suggestions.push('You have room to grow — consider adding 1-2 more habits in areas you want to develop.');
  }
  if (suggestions.length === 0) {
    suggestions.push('Your habits are well balanced. The next challenge is simply keeping the chain unbroken.');
  }

  const motivational = pickMotivation(score, player.streak);
  const prediction = predictFuture(score, player, activeHabits.length);

  return {
    period,
    score,
    completionPct,
    strengths: strengths.map((s) => s.habit.name),
    weaknesses: weaknesses.map((w) => w.habit.name),
    topAttribute: topAttribute?.label,
    laggingAttribute: laggingAttribute?.label,
    suggestions,
    motivational,
    prediction,
  };
}

function pickMotivation(score, streak) {
  if (streak >= 30) return "You've built something rare: discipline that runs on its own momentum. Legends are made of exactly this kind of consistency.";
  if (score >= 75) return "You're operating at a high level right now. This is the version of you that keeps promises to yourself — keep feeding it.";
  if (score >= 45) return "Solid, steady progress. Growth rarely looks dramatic day to day — it looks like showing up like you have been.";
  if (streak === 0) return 'Every streak starts at zero. The only habit that matters right now is the next one you complete — today, completely.';
  return "It's a quieter stretch, and that's alright. One fully-completed day is enough to start turning things back around.";
}

function predictFuture(score, player, habitCount) {
  const standing = getStanding(player.streak);
  const next = getNextStanding(player.streak);
  if (score >= 70 && player.streak >= 7 && next) {
    return `At your current pace, you're on track to reach ${next.name} in about ${next.day - player.streak} days if you keep this rhythm unbroken.`;
  }
  if (habitCount === 0) {
    return 'Add your first habit to unlock projections — the Guild Master needs a bit of data to read your trajectory.';
  }
  if (!next) {
    return `You've reached ${standing.name} — the top of the ladder. The only mission left is not letting it slip.`;
  }
  return `Stay unbroken and you'll reach ${next.name} in ${next.day - player.streak} days. One missed habit resets the count, so protect today above all.`;
}
