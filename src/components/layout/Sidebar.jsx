import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { LogOut, Flame } from 'lucide-react';
import LogoMark from '../common/LogoMark';
import { NAV_ITEMS } from './navConfig';
import { useGameStore } from '../../store/gameStore';
import { useAuthStore } from '../../store/authStore';
import { getStanding } from '../../utils/standing';
import { AVATARS } from '../../utils/constants';

// Presentation-only grouping of the existing nav items — navConfig.js stays
// untouched (still a flat list, still exactly what MobileNav consumes), this
// just organizes how Sidebar *displays* the same items, into calmer,
// labeled clusters instead of one long flat list. No item removed.
const NAV_GROUPS = [
  { label: 'Overview', items: ['/app', '/app/habits', '/app/quests'] },
  { label: 'Insights', items: ['/app/achievements', '/app/analytics', '/app/guild-master'] },
  { label: 'Account', items: ['/app/profile', '/app/settings'] },
];

export default function Sidebar() {
  const player = useGameStore((s) => s.player);
  const signOut = useAuthStore((s) => s.signOut);
  const user = useAuthStore((s) => s.user);
  const standing = getStanding(player.streak);
  const avatar = AVATARS.find((a) => a.key === player.avatar) || AVATARS[0];

  const byPath = Object.fromEntries(NAV_ITEMS.map((item) => [item.to, item]));

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 h-screen sticky top-0 border-r border-white/5 bg-navy-900/60 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 px-6 py-7">
        <div className="w-9 h-9 rounded-xl bg-electric-500/90 flex items-center justify-center">
          <LogoMark className="w-5 h-5 text-white" />
        </div>
        <span className="font-display font-bold text-lg text-white">LifeQuest</span>
      </div>

      <div className="mx-4 mb-6 glass-panel p-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-navy-700 flex items-center justify-center text-2xl border border-white/[0.06] shrink-0">
          {avatar.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">{user?.email?.split('@')[0]}</p>
          <p className="text-xs text-electric-400 font-medium">{standing.name}</p>
        </div>
        <div className="flex items-center gap-1 text-white/40 text-xs font-medium shrink-0">
          <Flame className="w-3.5 h-3.5" />
          {player.streak}
        </div>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-6 overflow-y-auto scrollbar-none">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.14em] text-white/30 font-medium">
              {group.label}
            </p>
            <div className="flex flex-col gap-1">
              {group.items.map((path) => {
                const item = byPath[path];
                if (!item) return null;
                const Icon = Icons[item.icon];
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `relative nav-link ${isActive ? 'text-white' : ''}`}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="sidebar-active-pill"
                            className="absolute inset-0 rounded-xl bg-electric-500/[0.12] border border-electric-500/25"
                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-3">
                          <Icon className="w-[18px] h-[18px]" />
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-4 py-5 border-t border-white/5">
        <button onClick={signOut} className="nav-link w-full text-danger-400/80 hover:text-danger-400 hover:bg-danger-500/10">
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
