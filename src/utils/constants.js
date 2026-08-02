// Attribute colors are deliberately muted and desaturated — distinguishable
// from one another for the radar chart / bars, but restrained rather than
// neon, matching the app's broader move away from a bright gamified palette.
export const ATTRIBUTES = [
  { key: 'intelligence', label: 'Intelligence', color: '#8aa9c4', icon: 'Brain' },
  { key: 'strength', label: 'Strength', color: '#c47b6f', icon: 'Dumbbell' },
  { key: 'vitality', label: 'Vitality', color: '#7fb88a', icon: 'HeartPulse' },
  { key: 'wisdom', label: 'Wisdom', color: '#8b8fa3', icon: 'BookOpen' },
  { key: 'finance', label: 'Finance', color: '#c9a668', icon: 'PiggyBank' },
  { key: 'creativity', label: 'Creativity', color: '#c98f7c', icon: 'Palette' },
  { key: 'discipline', label: 'Discipline', color: '#7b95b8', icon: 'ShieldCheck' },
  { key: 'spiritual', label: 'Spiritual Growth', color: '#7fb8ab', icon: 'Sparkles' },
];

export const HABIT_CATEGORIES = [
  'Health',
  'Fitness',
  'Study',
  'Career',
  'Finance',
  'Mindfulness',
  'Creativity',
  'Social',
  'Chores',
  'Other',
];

export const HABIT_ICONS = [
  'Dumbbell', 'BookOpen', 'Brain', 'HeartPulse', 'PiggyBank', 'Palette',
  'ShieldCheck', 'Sparkles', 'Droplets', 'Moon', 'Sun', 'Code',
  'PenTool', 'Music', 'Utensils', 'Bike', 'Wallet', 'Leaf',
  'Target', 'Flame', 'Coffee', 'Phone', 'Users', 'Home',
];

export const HABIT_COLORS = [
  '#22d3ee', '#a855f7', '#f472e0', '#f87171', '#facc15',
  '#4ade80', '#60a5fa', '#fb923c', '#5eead4', '#e879f9',
];

export const RECURRENCE_TYPES = ['daily', 'weekly', 'monthly'];

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const PRIORITIES = [
  { key: 'low', label: 'Low', color: '#64748b' },
  { key: 'medium', label: 'Medium', color: '#60a5fa' },
  { key: 'high', label: 'High', color: '#f87171' },
];

// Cosmetics unlock by consecutive-day Standing, not by XP level — the same
// ladder that defines Standing itself (see utils/standing.js).
export const THEMES = [
  { key: 'default', label: 'Cyber Purple', unlocked: true, from: '#22d3ee', to: '#a855f7' },
  { key: 'inferno', label: 'Inferno', unlockStreak: 7, from: '#facc15', to: '#f87171' },
  { key: 'emerald', label: 'Emerald Circuit', unlockStreak: 30, from: '#4ade80', to: '#06b6d4' },
  { key: 'voidwalker', label: 'Voidwalker', unlockStreak: 100, from: '#818cf8', to: '#e879f9' },
  { key: 'solar', label: 'Solar Flare', unlockStreak: 365, from: '#fb923c', to: '#facc15' },
];

export const AVATARS = [
  { key: 'novice', label: 'Novice Adventurer', unlocked: true, emoji: '🧑‍🎓' },
  { key: 'warrior', label: 'Warrior', unlockStreak: 7, emoji: '⚔️' },
  { key: 'mage', label: 'Arcane Mage', unlockStreak: 30, emoji: '🧙' },
  { key: 'ranger', label: 'Shadow Ranger', unlockStreak: 100, emoji: '🏹' },
  { key: 'sage', label: 'Enlightened Sage', unlockStreak: 200, emoji: '🧘' },
  { key: 'legend', label: 'Living Legend', unlockStreak: 365, emoji: '👑' },
];

export const TITLES = [
  { key: 'newcomer', label: 'Newcomer', condition: 'Start your journey', unlocked: true },
  { key: 'consistent', label: 'The Consistent', condition: 'Reach a 7-day streak' },
  { key: 'unstoppable', label: 'Unstoppable', condition: 'Reach a 30-day streak' },
  { key: 'immortal', label: 'Immortal Will', condition: 'Reach a 100-day streak' },
  { key: 'scholar', label: 'The Scholar', condition: 'Build deep focus in Intelligence' },
  { key: 'iron', label: 'Iron-Willed', condition: 'Build deep focus in Discipline' },
  { key: 'renaissance', label: 'Renaissance Soul', condition: 'Build every life area in balance' },
];

// Achievements are badges of discipline, not currency dispensers — no XP,
// no coins. Streak thresholds mirror the Standing ladder directly.
export const ACHIEVEMENTS = [
  { id: 'first_habit', title: 'First Steps', description: 'Create your first habit', icon: 'Footprints', condition: { type: 'habitsCreated', value: 1 } },
  { id: 'five_habits', title: 'Habit Architect', description: 'Create 5 habits', icon: 'Blocks', condition: { type: 'habitsCreated', value: 5 } },
  { id: 'first_complete', title: 'Quest Complete', description: 'Complete your first habit', icon: 'CheckCircle2', condition: { type: 'totalCompletions', value: 1 } },
  { id: 'complete_50', title: 'Grinder', description: 'Complete habits 50 times total', icon: 'Swords', condition: { type: 'totalCompletions', value: 50 } },
  { id: 'complete_250', title: 'Veteran', description: 'Complete habits 250 times total', icon: 'Trophy', condition: { type: 'totalCompletions', value: 250 } },
  { id: 'streak_1', title: 'Awakened', description: 'Complete every habit for 1 full day', icon: 'Sunrise', condition: { type: 'streak', value: 1 } },
  { id: 'streak_7', title: 'Pathfinder', description: 'Reach a 7-day streak', icon: 'Flame', condition: { type: 'streak', value: 7 }, unlocksTitle: 'consistent' },
  { id: 'streak_30', title: 'Iron Will', description: 'Reach a 30-day streak', icon: 'Flame', condition: { type: 'streak', value: 30 }, unlocksTitle: 'unstoppable' },
  { id: 'streak_100', title: 'Ascendant', description: 'Reach a 100-day streak', icon: 'Flame', condition: { type: 'streak', value: 100 }, unlocksTitle: 'immortal' },
  { id: 'streak_365', title: 'Mythic', description: 'Reach a 365-day streak', icon: 'Crown', condition: { type: 'streak', value: 365 } },
  { id: 'attribute_focus', title: 'Specialist', description: 'Build deep focus in a single life attribute', icon: 'Zap', condition: { type: 'attributePoints', value: 40 } },
  { id: 'quest_first', title: 'Dream Chaser', description: 'Create your first Life Quest', icon: 'Compass', condition: { type: 'lifeQuestsCreated', value: 1 } },
  { id: 'quest_complete', title: 'Legend in the Making', description: 'Complete a Life Quest', icon: 'Crown', condition: { type: 'lifeQuestsCompleted', value: 1 } },
  { id: 'night_owl', title: 'Night Owl', description: 'Complete a habit after 11 PM', icon: 'Moon', condition: { type: 'hidden_nightOwl', value: 1 }, hidden: true },
  { id: 'early_bird', title: 'Early Bird', description: 'Complete a habit before 6 AM', icon: 'Sunrise', condition: { type: 'hidden_earlyBird', value: 1 }, hidden: true },
  { id: 'perfect_week', title: 'Flawless Week', description: 'Complete every scheduled habit for 7 straight days', icon: 'Gem', condition: { type: 'hidden_perfectWeek', value: 1 }, hidden: true },
];
