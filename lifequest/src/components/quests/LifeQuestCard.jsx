import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Plus, Minus, Trash2, Link2 } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useConfetti } from '../../hooks/useConfetti';

function LifeQuestCardImpl({ quest, onDelete }) {
  const addManualQuestProgress = useGameStore((s) => s.addManualQuestProgress);
  const { fire } = useConfetti();
  const Icon = Icons[quest.icon] || Icons.Compass;
  const pct = Math.min(100, (quest.progress / quest.target) * 100);
  const completed = quest.status === 'completed';

  const wasCompleted = useRef(completed);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    if (completed && !wasCompleted.current) {
      setJustCompleted(true);
      fire({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
      const t = setTimeout(() => setJustCompleted(false), 1200);
      wasCompleted.current = true;
      return () => clearTimeout(t);
    }
    wasCompleted.current = completed;
  }, [completed, fire]);

  return (
    <motion.div
      animate={justCompleted ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`glass-panel-hover p-4 transition-colors duration-500 ${completed ? 'border-emerald-500/30' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-magenta-500/15 text-magenta-400'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-white text-sm truncate">{quest.title}</h4>
            {completed && <span className="badge text-emerald-400 border-emerald-500/30">Complete</span>}
          </div>
          {quest.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{quest.description}</p>}

          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400">{quest.progress} / {quest.target} {quest.unit}</span>
              <span className="text-xs text-slate-500">{Math.round(pct)}%</span>
            </div>
            <div className="h-2 rounded-full bg-navy-900 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-magenta-500 to-electric-500"
                style={{ width: `${pct}%`, transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            {quest.linkedHabitIds?.length > 0 ? (
              <span className="flex items-center gap-1 text-[11px] text-cyan-400">
                <Link2 className="w-3 h-3" /> {quest.linkedHabitIds.length} linked habit{quest.linkedHabitIds.length > 1 ? 's' : ''}
              </span>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-1.5">
              {!completed && (
                <>
                  <button onClick={() => addManualQuestProgress(quest.id, -1)} className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 active:scale-90 transition-all flex items-center justify-center text-slate-400">
                    <Minus className="w-3 h-3" />
                  </button>
                  <button onClick={() => addManualQuestProgress(quest.id, 1)} className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 active:scale-90 transition-all flex items-center justify-center text-slate-400">
                    <Plus className="w-3 h-3" />
                  </button>
                </>
              )}
              <button onClick={() => onDelete(quest)} className="w-6 h-6 rounded-md bg-white/5 hover:bg-red-500/15 active:scale-90 transition-all flex items-center justify-center text-slate-400 hover:text-red-400">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const LifeQuestCard = React.memo(LifeQuestCardImpl);
export default LifeQuestCard;
