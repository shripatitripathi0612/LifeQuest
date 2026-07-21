import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Compass, ListChecks } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { todaysCompletionPct } from '../utils/standing';
import HabitCard from '../components/habits/HabitCard';
import HabitForm from '../components/habits/HabitForm';
import AttributeBar from '../components/dashboard/AttributeBar';
import DailyQuestPanel from '../components/dashboard/DailyQuestPanel';
import YourJourney from '../components/dashboard/YourJourney';
import NextStandingCard from '../components/dashboard/NextStandingCard';
import WeekStrip from '../components/dashboard/WeekStrip';
import EmptyState from '../components/common/EmptyState';
import { ATTRIBUTES, AVATARS } from '../utils/constants';
import { isHabitDueToday } from '../utils/dateHelpers';

// Stable no-op so HabitCard's React.memo isn't defeated by a fresh function
// identity every render (Dashboard's habit cards don't show edit/delete).
const noop = () => {};

export default function Dashboard() {
  // Narrow selectors instead of subscribing to the whole store — Dashboard
  // is the landing page, so an unnecessary whole-store subscription here
  // would re-render the entire hero section, attribute bars, and journey
  // panel on every single store mutation, including ones with nothing to do
  // with what's visible (e.g. a weekly challenge ticking over).
  const player = useGameStore((s) => s.player);
  const habits = useGameStore((s) => s.habits);
  const completions = useGameStore((s) => s.completions);
  const lifeQuests = useGameStore((s) => s.lifeQuests);
  const addHabit = useGameStore((s) => s.addHabit);
  const [formOpen, setFormOpen] = useState(false);
  const avatar = AVATARS.find((a) => a.key === player.avatar) || AVATARS[0];

  // Same rule the store's todaysHabits() action uses internally — imported
  // directly so there's exactly one implementation of "is this due today",
  // and this stays cleanly memoized on the one dependency that matters.
  const habitsToday = useMemo(
    () => habits.filter((h) => h.status === 'active' && isHabitDueToday(h)),
    [habits]
  );

  const completedToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return completions.filter((c) => c.date === today).length;
  }, [completions]);

  const completionPct = useMemo(() => todaysCompletionPct(habits, completions), [habits, completions]);

  const activeQuests = useMemo(
    () => lifeQuests.filter((q) => q.status === 'active').slice(0, 3),
    [lifeQuests]
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Hero row */}
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 items-stretch">
        <div className="glass-panel p-5 sm:p-6 flex sm:flex-col items-center justify-center gap-3 sm:w-48">
          <span className="text-4xl">{avatar.emoji}</span>
          <h2 className="font-display text-base font-bold text-white text-center">{avatar.label}</h2>
        </div>
        <NextStandingCard streak={player.streak} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left / main column */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">Today's Habits</h3>
                <p className="text-xs text-slate-500">{completedToday} completed today · {completionPct}%</p>
              </div>
              <button onClick={() => setFormOpen(true)} className="btn-secondary text-xs px-3 py-1.5">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {habitsToday.length === 0 ? (
              <EmptyState
                icon={ListChecks}
                title="No habits scheduled today"
                description="Create a habit to begin building your streak."
                action={{ label: 'Create Habit', onClick: () => setFormOpen(true) }}
              />
            ) : (
              <div className="flex flex-col gap-2.5">
                {habitsToday.map((h) => (
                  <HabitCard key={h.id} habit={h} onEdit={noop} onDelete={noop} showActions={false} />
                ))}
              </div>
            )}
          </div>

          <div className="glass-panel p-5">
            <h3 className="font-semibold text-white mb-4">This Week</h3>
            <WeekStrip />
          </div>

          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Active Life Quests</h3>
              <Link to="/app/quests" className="text-xs text-electric-400 hover:text-electric-300 font-medium">View all</Link>
            </div>
            {activeQuests.length === 0 ? (
              <EmptyState icon={Compass} title="No active quests" description="Set a long-term goal to work toward." />
            ) : (
              <div className="flex flex-col gap-3">
                {activeQuests.map((q) => (
                  <div key={q.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300 font-medium">{q.title}</span>
                      <span className="text-xs text-slate-500">{q.progress}/{q.target}</span>
                    </div>
                    <div className="h-2 rounded-full bg-navy-900 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-magenta-500 to-electric-500"
                        style={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar column */}
        <div className="flex flex-col gap-5">
          <DailyQuestPanel />

          <div className="glass-panel p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-electric-400" />
              <h3 className="font-semibold text-white text-sm">Life Attributes</h3>
            </div>
            <div className="flex flex-col gap-3.5">
              {ATTRIBUTES.map((a) => (
                <AttributeBar key={a.key} attribute={a} points={player.attributes[a.key]} />
              ))}
            </div>
          </div>

          <YourJourney
            streak={player.streak}
            longestStreak={player.longestStreak}
            todaysCompletionPct={completionPct}
          />
        </div>
      </div>

      <HabitForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={(data) => { addHabit(data); setFormOpen(false); }} />
    </div>
  );
}
