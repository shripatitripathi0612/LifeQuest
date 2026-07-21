import React, { useState, useMemo } from 'react';
import { Plus, Compass, CalendarClock } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import LifeQuestForm from '../components/quests/LifeQuestForm';
import LifeQuestCard from '../components/quests/LifeQuestCard';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import DailyQuestPanel from '../components/dashboard/DailyQuestPanel';

export default function Quests() {
  const lifeQuests = useGameStore((s) => s.lifeQuests);
  const addLifeQuest = useGameStore((s) => s.addLifeQuest);
  const deleteLifeQuest = useGameStore((s) => s.deleteLifeQuest);
  const weeklyChallengeState = useGameStore((s) => s.weeklyChallengeState);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [tab, setTab] = useState('active');

  const filtered = useMemo(
    () => lifeQuests.filter((q) => (tab === 'active' ? q.status === 'active' : q.status === 'completed')),
    [lifeQuests, tab]
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Quests</h2>
          <p className="text-sm text-slate-400">Long-term missions and rotating challenges.</p>
        </div>
        <button onClick={() => setFormOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> New Life Quest
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex gap-1.5 glass-panel p-1 w-fit">
            {['active', 'completed'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  tab === t ? 'bg-electric-500/25 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={Compass}
              title={tab === 'active' ? 'No active quests' : 'No completed quests yet'}
              description={tab === 'active' ? 'Set a long-term life goal like "Learn Machine Learning" or "Run a Marathon."' : 'Complete a quest to see it here.'}
              action={tab === 'active' ? { label: 'Create Life Quest', onClick: () => setFormOpen(true) } : null}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((q) => (
                <LifeQuestCard key={q.id} quest={q} onDelete={setDeleting} />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <DailyQuestPanel />

          <div className="glass-panel p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="w-4 h-4 text-magenta-400" />
              <h3 className="font-semibold text-white text-sm">Weekly Challenges</h3>
            </div>
            {!weeklyChallengeState ? (
              <p className="text-xs text-slate-500">No challenges yet — check back soon.</p>
            ) : (
              <div className="flex flex-col gap-3.5">
                {weeklyChallengeState.challenges.map((c) => (
                  <div key={c.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${c.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{c.description}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{c.progress}/{c.target}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-navy-900 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-magenta-500 to-electric-500"
                        style={{ width: `${Math.min(100, (c.progress / c.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <LifeQuestForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={(data) => { addLifeQuest(data); setFormOpen(false); }} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleteLifeQuest(deleting.id)}
        title="Delete Quest"
        description={`Delete "${deleting?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
