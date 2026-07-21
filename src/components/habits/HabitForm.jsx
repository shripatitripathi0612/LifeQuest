import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import Modal from '../common/Modal';
import {
  HABIT_CATEGORIES,
  HABIT_ICONS,
  HABIT_COLORS,
  PRIORITIES,
  ATTRIBUTES,
  WEEKDAYS,
} from '../../utils/constants';

const emptyForm = {
  name: '',
  description: '',
  icon: 'Target',
  color: HABIT_COLORS[0],
  category: 'Health',
  attribute: 'discipline',
  priority: 'medium',
  recurrence: { type: 'daily', days: [] },
  reminderTime: '',
};

export default function HabitForm({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              ...emptyForm,
              ...initial,
              recurrence: initial.recurrence || { type: 'daily', days: [] },
              reminderTime: initial.reminderTime || '',
            }
          : emptyForm
      );
    }
  }, [open, initial]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const toggleWeekday = (day) => {
    const days = form.recurrence.days || [];
    const next = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
    set({ recurrence: { ...form.recurrence, days: next } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Habit' : 'New Habit'} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Habit Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="e.g. Read for 30 minutes"
            className="input-field"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Description (optional)</label>
          <textarea
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="Add details or a why"
            rows={2}
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Icon</label>
          <div className="grid grid-cols-8 gap-2">
            {HABIT_ICONS.map((iconName) => {
              const IconComp = Icons[iconName];
              return (
                <button
                  type="button"
                  key={iconName}
                  onClick={() => set({ icon: iconName })}
                  className={`aspect-square rounded-lg flex items-center justify-center border transition-all ${
                    form.icon === iconName ? 'border-electric-500 bg-electric-500/15' : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  <IconComp className="w-4 h-4 text-slate-300" />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Color</label>
          <div className="flex flex-wrap gap-2">
            {HABIT_COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => set({ color: c })}
                className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Category</label>
            <select value={form.category} onChange={(e) => set({ category: e.target.value })} className="input-field">
              {HABIT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Life Attribute</label>
            <select value={form.attribute} onChange={(e) => set({ attribute: e.target.value })} className="input-field">
              {ATTRIBUTES.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Priority</label>
          <div className="flex gap-1.5">
            {PRIORITIES.map((p) => (
              <button
                type="button"
                key={p.key}
                onClick={() => set({ priority: p.key })}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  form.priority === p.key ? 'text-white' : 'text-slate-400 border-white/10'
                }`}
                style={form.priority === p.key ? { backgroundColor: `${p.color}30`, borderColor: p.color } : {}}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Recurrence</label>
          <div className="flex gap-1.5 mb-2">
            {['daily', 'weekly', 'monthly'].map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => set({ recurrence: { type, days: [] } })}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize border transition-all ${
                  form.recurrence.type === type ? 'bg-electric-500/20 border-electric-500 text-white' : 'text-slate-400 border-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {form.recurrence.type === 'weekly' && (
            <div className="flex gap-1.5 flex-wrap">
              {WEEKDAYS.map((d, i) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => toggleWeekday(i)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold border transition-all ${
                    (form.recurrence.days || []).includes(i) ? 'bg-cyan-500/20 border-cyan-500 text-white' : 'text-slate-400 border-white/10'
                  }`}
                >
                  {d[0]}
                </button>
              ))}
            </div>
          )}
          {form.recurrence.type === 'monthly' && (
            <input
              type="number"
              min={1}
              max={28}
              placeholder="Day of month (1-28)"
              value={form.recurrence.dayOfMonth || ''}
              onChange={(e) => set({ recurrence: { ...form.recurrence, dayOfMonth: Number(e.target.value) } })}
              className="input-field"
            />
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Reminder Time (optional)</label>
          <input
            type="time"
            value={form.reminderTime}
            onChange={(e) => set({ reminderTime: e.target.value })}
            className="input-field"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">{initial ? 'Save Changes' : 'Create Habit'}</button>
        </div>
      </form>
    </Modal>
  );
}
