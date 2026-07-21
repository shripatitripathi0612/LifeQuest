import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Search, ListChecks } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import HabitCard from '../components/habits/HabitCard';
import HabitForm from '../components/habits/HabitForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import { HABIT_CATEGORIES } from '../utils/constants';

const STATUS_TABS = ['active', 'paused', 'archived'];

export default function Habits() {
  const habits = useGameStore((s) => s.habits);
  const addHabit = useGameStore((s) => s.addHabit);
  const updateHabit = useGameStore((s) => s.updateHabit);
  const deleteHabit = useGameStore((s) => s.deleteHabit);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [status, setStatus] = useState('active');
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return habits.filter((h) => {
      if (h.status !== status) return false;
      if (category !== 'All' && h.category !== category) return false;
      if (query && !h.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [habits, status, category, query]);

  const handleSubmit = (data) => {
    if (editing) {
      updateHabit(editing.id, data);
    } else {
      addHabit(data);
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleEdit = useCallback((h) => {
    setEditing(h);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((h) => setDeleting(h), []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Your Habits</h2>
          <p className="text-sm text-slate-400">Manage every quest line that builds your character.</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }} className="btn-primary">
          <Plus className="w-4 h-4" /> New Habit
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1.5 glass-panel p-1">
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                status === s ? 'bg-electric-500/25 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field w-auto py-1.5 text-sm">
          <option value="All">All Categories</option>
          {HABIT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search habits..."
            className="input-field pl-9 py-1.5 text-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title={habits.length === 0 ? 'No habits yet' : 'Nothing here'}
          description={habits.length === 0 ? 'Create your first habit to start building your streak.' : 'Try a different filter.'}
          action={habits.length === 0 ? { label: 'Create Habit', onClick: () => setFormOpen(true) } : null}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <HabitForm open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} onSubmit={handleSubmit} initial={editing} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleteHabit(deleting.id)}
        title="Delete Habit"
        description={`This will permanently delete "${deleting?.name}" and all its history. This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
