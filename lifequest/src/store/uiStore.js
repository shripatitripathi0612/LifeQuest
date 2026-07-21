import { create } from 'zustand';
import { newId } from '../utils/id';

export const useUIStore = create((set) => ({
  toasts: [],

  pushToast: (toast) => {
    const id = newId();
    set((s) => ({ toasts: [...s.toasts, { id, ...toast }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, toast.duration || 4000);
  },

  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
