import {
  format,
  parseISO,
  isSameDay,
  subDays,
  addDays,
  startOfWeek,
  startOfMonth,
  differenceInCalendarDays,
  eachDayOfInterval,
} from 'date-fns';

export const todayKey = () => format(new Date(), 'yyyy-MM-dd');

export const dateKey = (date) => format(date, 'yyyy-MM-dd');

export const isToday = (isoDateStr) => isSameDay(parseISO(isoDateStr), new Date());

export const isYesterday = (isoDateStr) =>
  isSameDay(parseISO(isoDateStr), subDays(new Date(), 1));

export function isHabitDueOn(habit, date) {
  const recurrence = habit.recurrence || { type: 'daily', days: [] };

  if (recurrence.type === 'daily') return true;

  if (recurrence.type === 'weekly') {
    if (!recurrence.days || recurrence.days.length === 0) return true;
    return recurrence.days.includes(date.getDay());
  }

  if (recurrence.type === 'monthly') {
    if (!recurrence.dayOfMonth) return true;
    return date.getDate() === recurrence.dayOfMonth;
  }

  return true;
}

export function isHabitDueToday(habit) {
  return isHabitDueOn(habit, new Date());
}

/** Recalculate a streak given a sorted (desc) list of completion date strings (yyyy-MM-dd). */
export function calculateStreak(completionDates) {
  if (!completionDates || completionDates.length === 0) return 0;

  const sorted = [...new Set(completionDates)].sort((a, b) =>
    b.localeCompare(a)
  );

  const today = todayKey();
  const yesterday = dateKey(subDays(new Date(), 1));

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  let cursor = parseISO(sorted[0]);

  for (let i = 1; i < sorted.length; i++) {
    const expected = dateKey(subDays(cursor, 1));
    if (sorted[i] === expected) {
      streak += 1;
      cursor = subDays(cursor, 1);
    } else if (sorted[i] === dateKey(cursor)) {
      continue;
    } else {
      break;
    }
  }

  return streak;
}

export function lastNDays(n) {
  const end = new Date();
  const start = subDays(end, n - 1);
  return eachDayOfInterval({ start, end }).map(dateKey);
}

export function daysInYear(year = new Date().getFullYear()) {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  return eachDayOfInterval({ start, end }).map(dateKey);
}

export function startOfCurrentWeek() {
  return dateKey(startOfWeek(new Date(), { weekStartsOn: 1 }));
}

export function startOfCurrentMonth() {
  return dateKey(startOfMonth(new Date()));
}

export function daysBetween(a, b) {
  return differenceInCalendarDays(parseISO(b), parseISO(a));
}

export function formatFriendly(isoDateStr) {
  return format(parseISO(isoDateStr), 'MMM d, yyyy');
}

export function formatTime(isoTimeStr) {
  if (!isoTimeStr) return '';
  const [h, m] = isoTimeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

export { addDays, subDays };
