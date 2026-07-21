import { dateKey, subDays, todayKey, isHabitDueOn } from './dateHelpers';

/**
 * The Standing Ladder. Standing is earned purely by consecutive days where
 * every single due habit was completed — no partial credit, no protection.
 * Miss one habit, the streak (and your Standing) resets to zero.
 */
export const STANDING_LADDER = [
  { day: 1, name: 'Awakened' },
  { day: 7, name: 'Pathfinder' },
  { day: 30, name: 'Iron Will' },
  { day: 50, name: 'Vanguard' },
  { day: 100, name: 'Ascendant' },
  { day: 200, name: 'Warden' },
  { day: 365, name: 'Mythic' },
  { day: 500, name: 'Titan' },
  { day: 1000, name: 'Living Legend' },
];

export const UNRANKED = { day: 0, name: 'Unranked' };

/** The highest Standing tier reached by a given streak length. */
export function getStanding(streak) {
  let current = UNRANKED;
  for (const tier of STANDING_LADDER) {
    if (streak >= tier.day) current = tier;
    else break;
  }
  return current;
}

/** The next Standing tier still ahead, or null if every tier has been reached. */
export function getNextStanding(streak) {
  return STANDING_LADDER.find((t) => t.day > streak) || null;
}

/** Days remaining until the next Standing tier is reached. */
export function daysUntilNextStanding(streak) {
  const next = getNextStanding(streak);
  return next ? next.day - streak : 0;
}

/** Full progress picture toward the next Standing tier: current tier, next
 *  tier, 0-1 progress between them, and days remaining. */
export function getStandingProgress(streak) {
  const current = getStanding(streak);
  const next = getNextStanding(streak);
  if (!next) return { current, next: null, progress: 1, daysRemaining: 0 };
  const span = next.day - current.day;
  const into = streak - current.day;
  const progress = span > 0 ? Math.min(1, Math.max(0, into / span)) : 0;
  return { current, next, progress, daysRemaining: next.day - streak };
}

const MAX_LOOKBACK_DAYS = 1000; // matches the highest ladder tier — a sane hard cap

/**
 * Whether every habit due on `dateStr` was actually completed that day.
 * Returns null (a "neutral" day, neither breaking nor extending a streak)
 * when no habit was due at all — e.g. a weekly habit's off-days, or a date
 * before any habit existed yet.
 */
function isDayFullyComplete(dateStr, activeHabits, completionsByDate) {
  const date = new Date(`${dateStr}T00:00:00`);
  const dueHabits = activeHabits.filter((h) => {
    const createdAt = h.createdAt ? new Date(h.createdAt) : null;
    if (createdAt && date < new Date(createdAt.toDateString())) return false;
    return isHabitDueOn(h, date);
  });
  if (dueHabits.length === 0) return null;
  const completedIds = completionsByDate.get(dateStr) || new Set();
  return dueHabits.every((h) => completedIds.has(h.id));
}

function groupCompletionsByDate(completions) {
  const map = new Map();
  completions.forEach((c) => {
    if (!map.has(c.date)) map.set(c.date, new Set());
    map.get(c.date).add(c.habitId);
  });
  return map;
}

/**
 * Computes the live, always-derived streak state from source data
 * (habits + completions) — never stored as an independently-mutated
 * counter, so it can never drift out of sync with what actually happened.
 *
 * Discipline is binary: a day only extends the streak if EVERY due habit
 * was completed. One miss breaks the chain back to zero.
 */
export function computeStreakInfo(habits, completions) {
  const activeHabits = habits.filter((h) => h.status === 'active');
  const completionsByDate = groupCompletionsByDate(completions);

  // Current streak: walk backward from yesterday until the first broken day.
  let currentStreak = 0;
  let cursor = subDays(new Date(), 1);
  for (let i = 0; i < MAX_LOOKBACK_DAYS; i++) {
    const result = isDayFullyComplete(dateKey(cursor), activeHabits, completionsByDate);
    if (result === true) {
      currentStreak += 1;
      cursor = subDays(cursor, 1);
    } else if (result === null) {
      cursor = subDays(cursor, 1); // neutral day — skip without breaking
    } else {
      break; // a real, missed day — the chain stops here
    }
  }

  // Today counts too, the moment every due habit is actually done.
  const todayResult = isDayFullyComplete(todayKey(), activeHabits, completionsByDate);
  const todayComplete = todayResult === true;
  if (todayComplete) currentStreak += 1;

  // Longest streak ever: scan forward across all known history.
  let longestStreak = currentStreak;
  let running = 0;
  const allDates = [...completionsByDate.keys()].sort();
  if (allDates.length > 0) {
    let scan = new Date(`${allDates[0]}T00:00:00`);
    const end = new Date();
    while (scan <= end) {
      const result = isDayFullyComplete(dateKey(scan), activeHabits, completionsByDate);
      if (result === true) {
        running += 1;
        longestStreak = Math.max(longestStreak, running);
      } else if (result === false) {
        running = 0;
      }
      scan = new Date(scan.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  return { currentStreak, longestStreak, todayComplete };
}

/** Today's completion percentage across currently-due habits (0-100). */
export function todaysCompletionPct(habits, completions) {
  const today = todayKey();
  const activeHabits = habits.filter((h) => h.status === 'active');
  const dueToday = activeHabits.filter((h) => isHabitDueOn(h, new Date()));
  if (dueToday.length === 0) return 100;
  const completedToday = new Set(
    completions.filter((c) => c.date === today).map((c) => c.habitId)
  );
  const done = dueToday.filter((h) => completedToday.has(h.id)).length;
  return Math.round((done / dueToday.length) * 100);
}
