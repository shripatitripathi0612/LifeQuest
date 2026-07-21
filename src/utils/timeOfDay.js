/**
 * LifeQuest's atmosphere responds to the actual local time of day. Each
 * period gets its own greeting, palette, and (for the Gateway Screen) its
 * own background treatment. After 10pm the tone deliberately shifts from
 * "keep going" to "go rest" — the app should care about the person more
 * than it cares about productivity.
 */

export const PERIODS = {
  MORNING: 'morning', // 5am–12pm
  AFTERNOON: 'afternoon', // 12pm–5pm
  EVENING: 'evening', // 5pm–10pm
  NIGHT: 'night', // 10pm–5am
};

export function getPeriod(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return PERIODS.MORNING;
  if (hour >= 12 && hour < 17) return PERIODS.AFTERNOON;
  if (hour >= 17 && hour < 22) return PERIODS.EVENING;
  return PERIODS.NIGHT;
}

export function isRestHours(date = new Date()) {
  const hour = date.getHours();
  return hour >= 22 || hour < 5;
}

const GREETINGS = {
  [PERIODS.MORNING]: [
    "Good morning. Let's build something you're proud of today.",
    'Morning. The day is unwritten — start the first line.',
  ],
  [PERIODS.AFTERNOON]: [
    'Good afternoon. Keep the momentum you started with.',
    "Midday check-in — you're closer than you think.",
  ],
  [PERIODS.EVENING]: [
    'Good evening. A strong finish is still a finish.',
    "Evening. There's still time to keep your word to yourself.",
  ],
  [PERIODS.NIGHT]: [
    'You\u2019ve earned your rest. Tomorrow needs you more than tonight.',
    'Rest now. Tomorrow has work waiting for you.',
  ],
};

export function getGreeting(date = new Date()) {
  const period = getPeriod(date);
  const options = GREETINGS[period];
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Palette tokens per period — used to subtly tint ambient backgrounds
 * (Dashboard hero, Gateway Screen) without breaking the app's overall
 * dark, premium foundation. Kept restrained on purpose.
 */
export const PERIOD_THEME = {
  [PERIODS.MORNING]: {
    label: 'Morning',
    glowFrom: 'rgba(251,191,36,0.16)', // soft gold
    glowTo: 'rgba(96,165,250,0.12)', // light blue
    accent: '#fbbf24',
    gatewayFrom: '#2a1a0f',
    gatewayVia: '#3d2416',
    gatewayTo: '#0a0a0d',
  },
  [PERIODS.AFTERNOON]: {
    label: 'Afternoon',
    glowFrom: 'rgba(56,189,248,0.14)', // clean bright blue
    glowTo: 'rgba(168,85,247,0.10)',
    accent: '#38bdf8',
    gatewayFrom: '#0d1b2a',
    gatewayVia: '#12233a',
    gatewayTo: '#05070a',
  },
  [PERIODS.EVENING]: {
    label: 'Evening',
    glowFrom: 'rgba(251,146,60,0.15)', // orange
    glowTo: 'rgba(168,85,247,0.16)', // purple
    accent: '#fb923c',
    gatewayFrom: '#241129',
    gatewayVia: '#1a0f2e',
    gatewayTo: '#05030a',
  },
  [PERIODS.NIGHT]: {
    label: 'Night',
    glowFrom: 'rgba(59,130,246,0.10)', // dark blue
    glowTo: 'rgba(147,51,234,0.08)',
    accent: '#60a5fa',
    gatewayFrom: '#050510',
    gatewayVia: '#03030a',
    gatewayTo: '#000000',
  },
};

export function getPeriodTheme(date = new Date()) {
  return PERIOD_THEME[getPeriod(date)];
}
