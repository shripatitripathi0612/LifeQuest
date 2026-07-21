import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Check, Flame, MoreVertical, Pencil, Trash2, PauseCircle, PlayCircle, Archive } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useConfetti } from '../../hooks/useConfetti';
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
  const { fire } = useConfetti();
  const { playComplete, playClick } = useSound();
  const { pushToast } = useUIStore();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [justCompleted, setJustCompleted] = React.useState(false);

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
      fire({ origin: { y: 0.7 }, particleCount: 60 });
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 900);
      pushToast({ type: 'success', title: 'Showed up.', message: `${habit.name} — done.` });
    } else if (result.alreadyDone) {
      pushToast({ type: 'info', message: 'Already completed today.' });
    }
  };

  return (
    <motion.div
      layout
      className={`glass-panel-hover p-4 flex items-center gap-3.5 ${habit.status === 'paused' ? 'opacity-60' : ''}`}
    >
      <div className="relative shrink-0">
        <AnimatePresence>
          {justCompleted && (
            <motion.span
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ opacity: 1, y: -26, scale: 1 }}
              exit={{ opacity: 0, y: -38 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute -top-1 left-1/2 -translate-x-1/2 pointer-events-none z-10"
            >
              <Check className="w-4 h-4 text-emerald-400" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleToggle}
          disabled={habit.status !== 'active'}
          className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 border-2 ${
            done
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-400 border-emerald-400 shadow-glow-cyan'
              : 'border-white/15 hover:border-white/30'
          }`}
          style={!done ? { backgroundColor: `${habit.color}18` } : {}}
        >
          {done ? <Check className="w-5 h-5 text-white" /> : <Icon className="w-5 h-5" style={{ color: habit.color }} />}
        </motion.button>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-semibold text-sm truncate ${done ? 'text-slate-400 line-through' : 'text-white'}`}>
            {habit.name}
          </p>
          {priority && priority.key === 'high' && (
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: priority.color }} />
          )}
        </div>
        <div className="flex items-center gap-2.5 mt-0.5">
          <span className="text-xs text-slate-500">{habit.category}</span>
          {habit.streak > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-orange-400 font-medium">
              <Flame className="w-3 h-3" /> {habit.streak}
            </span>
          )}
        </div>
      </div>

      {showActions && (
        <div className="relative shrink-0">
          <button onClick={() => setMenuOpen((v) => !v)} className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-white/5">
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 z-20 w-40 glass-panel py-1.5 border-white/10">
                <button onClick={() => { onEdit(habit); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                {habit.status === 'active' ? (
                  <button onClick={() => { pauseHabit(habit.id); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white">
                    <PauseCircle className="w-3.5 h-3.5" /> Pause
                  </button>
                ) : habit.status === 'paused' ? (
                  <button onClick={() => { resumeHabit(habit.id); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white">
                    <PlayCircle className="w-3.5 h-3.5" /> Resume
                  </button>
                ) : null}
                <button onClick={() => { archiveHabit(habit.id); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white">
                  <Archive className="w-3.5 h-3.5" /> Archive
                </button>
                <button onClick={() => { onDelete(habit); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10">
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
