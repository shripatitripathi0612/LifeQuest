import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, Star, X } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
  xp: Star,
};

const COLORS = {
  success: 'text-emerald-400 border-emerald-500/30',
  error: 'text-red-400 border-red-500/30',
  info: 'text-cyan-400 border-cyan-500/30',
  xp: 'text-electric-400 border-electric-500/30',
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useUIStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[90vw] max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || Info;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              className={`glass-panel p-3.5 flex items-start gap-3 border ${COLORS[toast.type] || COLORS.info}`}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                {toast.title && <p className="text-sm font-semibold text-white">{toast.title}</p>}
                {toast.message && <p className="text-xs text-slate-400 mt-0.5">{toast.message}</p>}
              </div>
              <button onClick={() => dismissToast(toast.id)} className="text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
