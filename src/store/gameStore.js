import { create } from 'zustand';
import { newId } from '../utils/id';
import { freshState } from './defaultState';
import { todayKey, isHabitDueToday, calculateStreak, startOfCurrentWeek } from '../utils/dateHelpers';
import { computeStreakInfo, getStanding } from '../utils/standing';
import { ACHIEVEMENTS, THEMES, AVATARS } from '../utils/constants';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const STORAGE_PREFIX = 'lifequest.game.';

function loadFromLocal(userId) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + userId);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToLocal(userId, state) {
  try {
    localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(state));
  } catch {
    // storage full or unavailable — fail silently, in-memory state still works
  }
}

let syncTimeout = null;
async function syncToSupabase(userId, state) {
  if (!isSupabaseConfigured || !userId) return;
  clearTimeout(syncTimeout);
  syncTimeout = setTimeout(async () => {
    try {
      await supabase.from('user_data').upsert({
        user_id: userId,
        data: state,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // best-effort sync; local copy remains source of truth for the session
    }
  }, 1200);
}

async function loadFromSupabase(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('data')
      .eq('user_id', userId)
      .maybeSingle();
    if (error || !data) return null;
    return data.data;
  } catch {
    return null;
  }
}

export const useGameStore = create((set, get) => ({
  ...freshState(),
  userId: null,
  loaded: false,
  lastStandingUp: null,
  lastStreakBreak: null,
  lastAchievements: [],
  lastQuestComplete: null,

  loadForUser: async (userId) => {
    const remote = await loadFromSupabase(userId);
    const local = loadFromLocal(userId);
    const state = remote || local || freshState();
    set({ ...freshState(), ...state, userId, loaded: true });
    get()._ensureDailyQuests();
    get()._ensureWeeklyChallenges();
    // Recomputed on every load — this is the moment an overnight miss (a day
    // that ended with an incomplete habit) is actually detected and the
    // streak resets, since there's no server-side clock to do it for us.
    get()._recalculateStreak();
  },

  clear: () => set({ ...freshState(), userId: null, loaded: false }),

  _persist: () => {
    const { userId, ...rest } = get();
    if (!userId) return;
    const snapshot = {
      player: rest.player,
      habits: rest.habits,
      completions: rest.completions,
      lifeQuests: rest.lifeQuests,
      dailyQuestState: rest.dailyQuestState,
      weeklyChallengeState: rest.weeklyChallengeState,
      settings: rest.settings,
    };
    saveToLocal(userId, snapshot);
    syncToSupabase(userId, snapshot);
  },

  // ---------- STREAK / STANDING ----------
  // The single source of truth for progression. Never mutated incrementally —
  // always recomputed fresh from habits + completions (see utils/standing.js),
  // so it can never drift out of sync with what actually happened. Discipline
  // is binary: miss one due habit on a day and that day breaks the chain.

  _recalculateStreak: () => {
    const { habits, completions, player } = get();
    const info = computeStreakInfo(habits, completions);
    const previousStreak = player.streak;
    const brokenJustNow = previousStreak > 0 && info.currentStreak === 0;
    const standingBefore = getStanding(previousStreak).name;
    const standingAfter = getStanding(info.currentStreak).name;
    const standingUpJustNow = info.currentStreak > previousStreak && standingAfter !== standingBefore;

    set((s) => {
      const unlockedThemes = new Set(s.player.unlockedThemes);
      const unlockedAvatars = new Set(s.player.unlockedAvatars);
      THEMES.forEach((t) => t.unlockStreak && info.currentStreak >= t.unlockStreak && unlockedThemes.add(t.key));
      AVATARS.forEach((a) => a.unlockStreak && info.currentStreak >= a.unlockStreak && unlockedAvatars.add(a.key));

      return {
        player: {
          ...s.player,
          streak: info.currentStreak,
          longestStreak: Math.max(s.player.longestStreak, info.longestStreak),
          unlockedThemes: [...unlockedThemes],
          unlockedAvatars: [...unlockedAvatars],
        },
        lastStreakBreak: brokenJustNow ? { ts: Date.now() } : s.lastStreakBreak,
        lastStandingUp: standingUpJustNow ? { standing: standingAfter, ts: Date.now() } : s.lastStandingUp,
      };
    });
  },

  // ---------- HABITS ----------

  addHabit: (habit) => {
    const newHabit = {
      id: newId(),
      name: habit.name,
      description: habit.description || '',
      icon: habit.icon || 'Target',
      color: habit.color || '#22d3ee',
      category: habit.category || 'Other',
      attribute: habit.attribute || 'discipline',
      priority: habit.priority || 'medium',
      recurrence: habit.recurrence || { type: 'daily', days: [] },
      reminderTime: habit.reminderTime || null,
      status: 'active',
      streak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      lastCompletedDate: null,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ habits: [...s.habits, newHabit] }));
    get()._checkAchievements();
    get()._recalculateStreak();
    get()._persist();
    return newHabit;
  },

  updateHabit: (id, patch) => {
    set((s) => ({
      habits: s.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    }));
    get()._recalculateStreak();
    get()._persist();
  },

  deleteHabit: (id) => {
    set((s) => ({
      habits: s.habits.filter((h) => h.id !== id),
      completions: s.completions.filter((c) => c.habitId !== id),
    }));
    get()._recalculateStreak();
    get()._persist();
  },

  pauseHabit: (id) => get().updateHabit(id, { status: 'paused' }),
  resumeHabit: (id) => get().updateHabit(id, { status: 'active' }),
  archiveHabit: (id) => get().updateHabit(id, { status: 'archived' }),

  isCompletedToday: (habitId) => {
    const today = todayKey();
    return get().completions.some((c) => c.habitId === habitId && c.date === today);
  },

  completeHabit: (habitId) => {
    const state = get();
    const habit = state.habits.find((h) => h.id === habitId);
    if (!habit) return { success: false };
    if (get().isCompletedToday(habitId)) return { success: false, alreadyDone: true };

    const today = todayKey();
    const now = new Date();
    const completion = { id: newId(), habitId, date: today, time: now.toISOString() };

    // Per-habit streak — a secondary, informational stat shown on the habit
    // card itself (resets on a gap, same as before). The app's primary
    // progression metric is the binary, all-or-nothing global streak
    // recalculated below via computeStreakInfo.
    const habitCompletionDates = [
      ...state.completions.filter((c) => c.habitId === habitId).map((c) => c.date),
      today,
    ];
    const newHabitStreak = calculateStreak(habitCompletionDates);

    const updatedHabits = state.habits.map((h) =>
      h.id === habitId
        ? {
            ...h,
            streak: newHabitStreak,
            longestStreak: Math.max(h.longestStreak, newHabitStreak),
            totalCompletions: h.totalCompletions + 1,
            lastCompletedDate: today,
          }
        : h
    );

    const attrPoints = { ...state.player.attributes };
    attrPoints[habit.attribute] = (attrPoints[habit.attribute] || 0) + 1;

    // hidden achievement time-of-day checks
    const hour = now.getHours();
    const hiddenFlags = {};
    if (hour >= 23 || hour < 4) hiddenFlags.hidden_nightOwl = true;
    if (hour < 6) hiddenFlags.hidden_earlyBird = true;

    set((s) => ({
      player: { ...s.player, attributes: attrPoints },
      habits: updatedHabits,
      completions: [...s.completions, completion],
      _hiddenFlags: { ...(s._hiddenFlags || {}), ...hiddenFlags },
    }));

    get()._progressDailyQuests('habit_completed', { habit });
    get()._progressWeeklyChallenges('habit_completed', { habit });
    get()._progressLifeQuests(habitId);
    get()._recalculateStreak();

    const newAchievements = get()._checkAchievements();

    get()._persist();

    return { success: true, newAchievements };
  },

  uncompleteHabit: (habitId) => {
    const state = get();
    const today = todayKey();
    const habit = state.habits.find((h) => h.id === habitId);
    if (!habit) return;
    const completion = state.completions.find((c) => c.habitId === habitId && c.date === today);
    if (!completion) return;

    const remainingDates = state.completions
      .filter((c) => c.habitId === habitId && c.date !== today)
      .map((c) => c.date);
    const newHabitStreak = calculateStreak(remainingDates);

    set((s) => ({
      completions: s.completions.filter((c) => c.id !== completion.id),
      habits: s.habits.map((h) =>
        h.id === habitId
          ? { ...h, streak: newHabitStreak, totalCompletions: Math.max(0, h.totalCompletions - 1) }
          : h
      ),
    }));
    get()._recalculateStreak();
    get()._persist();
  },

  todaysHabits: () => {
    const { habits } = get();
    return habits.filter((h) => h.status === 'active' && isHabitDueToday(h));
  },

  // ---------- LIFE QUESTS ----------

  addLifeQuest: (quest) => {
    const newQuest = {
      id: newId(),
      title: quest.title,
      description: quest.description || '',
      icon: quest.icon || 'Compass',
      linkedHabitIds: quest.linkedHabitIds || [],
      target: quest.target || 100,
      progress: 0,
      unit: quest.unit || 'progress points',
      deadline: quest.deadline || null,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ lifeQuests: [...s.lifeQuests, newQuest] }));
    get()._checkAchievements();
    get()._persist();
    return newQuest;
  },

  updateLifeQuest: (id, patch) => {
    set((s) => ({ lifeQuests: s.lifeQuests.map((q) => (q.id === id ? { ...q, ...patch } : q)) }));
    get()._persist();
  },

  deleteLifeQuest: (id) => {
    set((s) => ({ lifeQuests: s.lifeQuests.filter((q) => q.id !== id) }));
    get()._persist();
  },

  addManualQuestProgress: (id, amount) => {
    set((s) => ({
      lifeQuests: s.lifeQuests.map((q) => {
        if (q.id !== id) return q;
        const progress = Math.min(q.target, Math.max(0, q.progress + amount));
        const status = progress >= q.target ? 'completed' : q.status;
        return { ...q, progress, status };
      }),
    }));
    get()._checkAchievements();
    get()._persist();
  },

  _progressLifeQuests: (habitId) => {
    set((s) => ({
      lifeQuests: s.lifeQuests.map((q) => {
        if (q.status !== 'active' || !q.linkedHabitIds.includes(habitId)) return q;
        const progress = Math.min(q.target, q.progress + 1);
        const status = progress >= q.target ? 'completed' : q.status;
        return { ...q, progress, status };
      }),
    }));
  },

  // ---------- DAILY QUESTS ----------
  // Bonus objectives for extra satisfaction — no currency, just the
  // completion itself. Unrelated to the binary streak calculation.

  _ensureDailyQuests: () => {
    const state = get();
    const today = todayKey();
    if (state.dailyQuestState && state.dailyQuestState.date === today) return;

    const habitCount = Math.max(3, Math.min(6, state.habits.filter((h) => h.status === 'active').length || 3));
    const quests = [
      {
        id: newId(),
        type: 'complete_n_habits',
        description: `Complete ${habitCount} habits today`,
        target: habitCount,
        progress: 0,
        completed: false,
      },
      {
        id: newId(),
        type: 'complete_high_priority',
        description: 'Complete a high-priority habit',
        target: 1,
        progress: 0,
        completed: false,
      },
      {
        id: newId(),
        type: 'maintain_streak',
        description: 'Keep your daily streak alive',
        target: 1,
        progress: 0,
        completed: false,
      },
    ];

    set({ dailyQuestState: { date: today, quests } });
    get()._persist();
  },

  _progressDailyQuests: (event, payload) => {
    set((s) => {
      if (!s.dailyQuestState) return s;
      const quests = s.dailyQuestState.quests.map((q) => {
        if (q.completed) return q;
        let progress = q.progress;
        if (q.type === 'complete_n_habits' && event === 'habit_completed') progress += 1;
        if (q.type === 'complete_high_priority' && event === 'habit_completed' && payload.habit.priority === 'high') progress += 1;
        if (q.type === 'maintain_streak' && event === 'habit_completed') progress = 1;
        const completed = progress >= q.target;
        return { ...q, progress: Math.min(q.target, progress), completed };
      });

      const justCompleted = quests.filter(
        (q, i) => q.completed && !s.dailyQuestState.quests[i].completed
      );

      return {
        dailyQuestState: { ...s.dailyQuestState, quests },
        lastQuestComplete: justCompleted.length > 0 ? { quests: justCompleted, ts: Date.now() } : s.lastQuestComplete,
      };
    });
  },

  // ---------- WEEKLY CHALLENGES ----------

  _ensureWeeklyChallenges: () => {
    const state = get();
    const weekStart = startOfCurrentWeek();
    if (state.weeklyChallengeState && state.weeklyChallengeState.weekStart === weekStart) return;

    const pool = [
      { type: 'complete_20', description: 'Complete 20 habits this week', target: 20 },
      { type: 'perfect_3_days', description: 'Have 3 fully-completed days this week', target: 3 },
      { type: 'streak_maintain', description: 'Maintain your streak all 7 days', target: 7 },
      { type: 'attribute_focus', description: 'Earn 15 points in a single attribute', target: 15 },
    ];
    const chosen = pool.sort(() => Math.random() - 0.5).slice(0, 2);
    const challenges = chosen.map((c) => ({ id: newId(), ...c, progress: 0, completed: false }));

    set({ weeklyChallengeState: { weekStart, challenges } });
    get()._persist();
  },

  _progressWeeklyChallenges: (event) => {
    set((s) => {
      if (!s.weeklyChallengeState) return s;
      const challenges = s.weeklyChallengeState.challenges.map((c) => {
        if (c.completed) return c;
        let progress = c.progress;
        if (c.type === 'complete_20' && event === 'habit_completed') progress += 1;
        const completed = progress >= c.target;
        return { ...c, progress: Math.min(c.target, progress), completed };
      });
      return { weeklyChallengeState: { ...s.weeklyChallengeState, challenges } };
    });
  },

  // ---------- ACHIEVEMENTS ----------
  // Pure badges of discipline — no XP, no coins, nothing to grind.

  _checkAchievements: () => {
    const state = get();
    const { player, habits, completions, lifeQuests } = state;
    const totalCompletions = completions.length;
    const maxAttributePoints = Math.max(0, ...Object.values(player.attributes));
    const hiddenFlags = state._hiddenFlags || {};

    const unlocked = [];

    ACHIEVEMENTS.forEach((ach) => {
      if (player.achievements[ach.id]) return;
      let met = false;
      switch (ach.condition.type) {
        case 'habitsCreated':
          met = habits.length >= ach.condition.value;
          break;
        case 'totalCompletions':
          met = totalCompletions >= ach.condition.value;
          break;
        case 'streak':
          met = player.streak >= ach.condition.value;
          break;
        case 'attributePoints':
          met = maxAttributePoints >= ach.condition.value;
          break;
        case 'lifeQuestsCreated':
          met = lifeQuests.length >= ach.condition.value;
          break;
        case 'lifeQuestsCompleted':
          met = lifeQuests.filter((q) => q.status === 'completed').length >= ach.condition.value;
          break;
        default:
          if (ach.condition.type.startsWith('hidden_')) {
            met = Boolean(hiddenFlags[ach.condition.type]);
          }
      }
      if (met) unlocked.push(ach);
    });

    if (unlocked.length > 0) {
      set((s) => {
        const achievements = { ...s.player.achievements };
        let titles = [...s.player.titles];
        unlocked.forEach((a) => {
          achievements[a.id] = new Date().toISOString();
          if (a.unlocksTitle && !titles.includes(a.unlocksTitle)) titles.push(a.unlocksTitle);
        });
        return {
          player: { ...s.player, achievements, titles },
          lastAchievements: unlocked,
        };
      });
    }

    return unlocked;
  },

  // ---------- COSMETICS ----------

  equipTitle: (key) => {
    set((s) => ({ player: { ...s.player, equippedTitle: key } }));
    get()._persist();
  },
  equipAvatar: (key) => {
    set((s) => ({ player: { ...s.player, avatar: key } }));
    get()._persist();
  },
  equipTheme: (key) => {
    set((s) => ({ player: { ...s.player, equippedTheme: key } }));
    get()._persist();
  },

  updateSettings: (patch) => {
    set((s) => ({ settings: { ...s.settings, ...patch } }));
    get()._persist();
  },

  // ---------- BACKUP / RESTORE ----------

  exportSnapshot: () => {
    const { player, habits, completions, lifeQuests, dailyQuestState, weeklyChallengeState, settings } = get();
    return JSON.stringify(
      { version: 2, exportedAt: new Date().toISOString(), player, habits, completions, lifeQuests, dailyQuestState, weeklyChallengeState, settings },
      null,
      2
    );
  },

  importSnapshot: (json) => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed.player || !Array.isArray(parsed.habits)) {
        return { success: false, error: 'This file does not look like a valid LifeQuest backup.' };
      }
      set((s) => ({
        player: parsed.player,
        habits: parsed.habits,
        completions: parsed.completions || [],
        lifeQuests: parsed.lifeQuests || [],
        dailyQuestState: parsed.dailyQuestState || null,
        weeklyChallengeState: parsed.weeklyChallengeState || null,
        settings: { ...s.settings, ...(parsed.settings || {}) },
      }));
      get()._recalculateStreak();
      get()._persist();
      return { success: true };
    } catch {
      return { success: false, error: 'Could not parse this file. Make sure it is an unmodified LifeQuest backup.' };
    }
  },

  resetAllProgress: () => {
    set((s) => ({ ...freshState(), userId: s.userId, loaded: true }));
    get()._persist();
  },
}));
