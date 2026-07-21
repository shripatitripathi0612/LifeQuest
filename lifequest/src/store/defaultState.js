import { ATTRIBUTES } from '../utils/constants';

export function freshPlayer() {
  const attributes = {};
  ATTRIBUTES.forEach((a) => {
    attributes[a.key] = 0;
  });

  return {
    attributes,
    titles: ['newcomer'],
    equippedTitle: 'newcomer',
    avatar: 'novice',
    unlockedAvatars: ['novice'],
    equippedTheme: 'default',
    unlockedThemes: ['default'],
    achievements: {},
    // streak/longestStreak are cached, always-recomputed reflections of
    // computeStreakInfo() (see utils/standing.js) — never mutated directly.
    streak: 0,
    longestStreak: 0,
  };
}

export function freshState() {
  return {
    player: freshPlayer(),
    habits: [],
    completions: [],
    lifeQuests: [],
    dailyQuestState: null,
    weeklyChallengeState: null,
    settings: {
      theme: 'dark',
      sound: true,
      animations: true,
    },
  };
}
