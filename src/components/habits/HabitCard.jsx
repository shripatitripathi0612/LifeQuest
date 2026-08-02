import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Check, Flame, MoreVertical, Pencil, Trash2, PauseCircle, PlayCircle, Archive } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useSound } from '../../hooks/useSound';
import { useUIStore } from '../../store/uiStore';
import { PRIORITIES } from '../../utils/constants';

function HabitCardImpl({ habit, onEdit, onDelete, showActions = true }) {
  // Each of these is either a stable action reference (never changes, so
  // selecting it individually never triggers a re-render on its own) or a
  // primitive boolean (safe for Zustand's reference-equality check — unlike
  // an array/object, `true === true` is stable). This means completing a
  // *different* habit, or any unrelated store mutation, no longer re-renders
  // every HabitCard on screen — only the one whose own data actually changed.
  const done = useGameStore((s) => s.isCompletedToday(habit.id));
  const completeHabit = useGameStore((s) => s.completeHabit);
  const uncompleteHabit = useGameStore((s) => s.uncompleteHabit);
  const pauseHabit = useGameStore((s) => s.pauseHabit);
  const resumeHabit = useGameStore((s) => s.resumeHabit);
  const archiveHabit = useGameStore((s) => s.archiveHabit);
  const { playComplete, playClick } = useSound();
  const { pushToast } = useUIStore();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const Icon = Icons[habit.icon] || Icons.Target;
  const priority = PRIORITIES.find((p) => p.key === habit.priority);

  const handleToggle = () => {
    if (done) {
      uncompleteHabit(habit.id);
      playClick();
      return;
    }
    const result = completeHabit(habit.id);
    if (result.success) {
      playComplete();
      pushToast({ type: 'success', title: 'Showed up.', message: `${habit.name} — done.` });
    } else if (result.alreadyDone) {
      pushToast({ type: 'info', message: 'Already completed today.' });
    }
  };

  return (
    <motion.div
      layout
      className={`glass-panel-hover p-5 flex items-center gap-4 ${habit.status === 'paused' ? 'opacity-60' : ''}`}
    >
      <motion.button
        onClick={handleToggle}
        disabled={habit.status !== 'active'}
        aria-label={done ? `Mark ${habit.name} as not done` : `Mark ${habit.name} as done`}
        whileTap={{ scale: 0.96 }}
        animate={done ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-11 h-11 rounded-full flex items-center justify-center shrink-0 border transition-colors duration-300 ${
          done
            ? 'bg-success-500/15 border-success-400/50'
            : 'border-white/15 hover:border-white/30'
        }`}
        style={!done ? { backgroundColor: `${habit.color}18` } : {}}
      >
        {done ? <Check className="w-[18px] h-[18px] text-success-400" strokeWidth={2.5} /> : <Icon className="w-[18px] h-[18px]" style={{ color: habit.color }} />}
      </motion.button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-medium text-sm truncate transition-colors duration-300 ${done ? 'text-slate-500 line-through' : 'text-white'}`}>
            {habit.name}
          </p>
          {priority && priority.key === 'high' && (
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: priority.color }} />
          )}
        </div>
        <div className="flex items-center gap-2.5 mt-1">
          <span className="text-xs text-slate-500">{habit.category}</span>
          {habit.streak > 0 && (
            <span className="flex items-center gap-1 text-xs text-white/35 font-medium">
              <Flame className="w-3 h-3" /> {habit.streak}
            </span>
          )}
        </div>
      </div>

      {showActions && (
        <div className="relative shrink-0">
          <button onClick={() => setMenuOpen((v) => !v)} className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 z-20 w-40 glass-panel py-1.5">
                <button onClick={() => { onEdit(habit); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                {habit.status === 'active' ? (
                  <button onClick={() => { pauseHabit(habit.id); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                    <PauseCircle className="w-3.5 h-3.5" /> Pause
                  </button>
                ) : habit.status === 'paused' ? (
                  <button onClick={() => { resumeHabit(habit.id); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                    <PlayCircle className="w-3.5 h-3.5" /> Resume
                  </button>
                ) : null}
                <button onClick={() => { archiveHabit(habit.id); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                  <Archive className="w-3.5 h-3.5" /> Archive
                </button>
                <button onClick={() => { onDelete(habit); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-danger-400 hover:bg-danger-500/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Memoized: with stable `onEdit`/`onDelete` callbacks from the parent and
// Zustand preserving object identity for unchanged habits, completing one
// habit no longer re-renders every other card in the list.
const HabitCard = React.memo(HabitCardImpl);
export default HabitCard;
