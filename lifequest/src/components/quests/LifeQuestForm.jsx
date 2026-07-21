import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../common/Modal';
import { useGameStore } from '../../store/gameStore';

const ICONS = ['Compass', 'GraduationCap', 'Dumbbell', 'BookOpen', 'Briefcase', 'Plane', 'PiggyBank', 'Code', 'Heart', 'Mountain'];

const emptyForm = { title: '', description: '', icon: 'Compass', target: 30, unit: 'sessions', linkedHabitIds: [], deadline: '' };

export default function LifeQuestForm({ open, onClose, onSubmit }) {
  // IMPORTANT: select the raw, stable array from the store and derive with
  // useMemo — never call .filter()/.map()/.sort() *inside* a zustand selector.
  // Zustand compares selector output by reference; .filter() returns a new
  // array on every single call, so the store looks "changed" on every render,
  // which triggers another render, which calls the selector again — an
  // infinite render loop ("Maximum update depth exceeded"). This form was
  // mounted unconditionally by its parent page (the Modal only hides it
  // visually), so the loop fired the instant the page mounted.
  const allHabits = useGameStore((s) => s.habits);
  const habits = useMemo(() => allHabits.filter((h) => h.status === 'active'), [allHabits]);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) setForm(emptyForm);
  }, [open]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const toggleHabit = (id) => {
    const linked = form.linkedHabitIds.includes(id)
      ? form.linkedHabitIds.filter((h) => h !== id)
      : [...form.linkedHabitIds, id];
    set({ linkedHabitIds: linked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit({ ...form, target: Number(form.target) || 1 });
  };

  return (
    <Modal open={open} onClose={onClose} title="New Life Quest" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Quest Title</label>
          <input required value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Become a Biochemist" className="input-field" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Description</label>
          <textarea value={form.description} onChange={(e) => set({ description: e.target.value })} rows={2} placeholder="What does success look like?" className="input-field resize-none" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Icon</label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map((i) => (
              <button
                type="button"
                key={i}
                onClick={() => set({ icon: i })}
                className={`px-3 py-1.5 rounded-lg text-xs border ${form.icon === i ? 'border-electric-500 bg-electric-500/15 text-white' : 'border-white/10 text-slate-400'}`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Target</label>
            <input type="number" min={1} value={form.target} onChange={(e) => set({ target: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Unit</label>
            <input value={form.unit} onChange={(e) => set({ unit: e.target.value })} placeholder="books, sessions, km..." className="input-field" />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Deadline (optional)</label>
          <input type="date" value={form.deadline} onChange={(e) => set({ deadline: e.target.value })} className="input-field" />
        </div>
        {habits.length > 0 && (
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
              Link habits (each completion adds 1 progress point)
            </label>
            <div className="flex flex-wrap gap-2">
              {habits.map((h) => (
                <button
                  type="button"
                  key={h.id}
                  onClick={() => toggleHabit(h.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs border ${form.linkedHabitIds.includes(h.id) ? 'border-cyan-500 bg-cyan-500/15 text-white' : 'border-white/10 text-slate-400'}`}
                >
                  {h.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">Create Quest</button>
        </div>
      </form>
    </Modal>
  );
}
