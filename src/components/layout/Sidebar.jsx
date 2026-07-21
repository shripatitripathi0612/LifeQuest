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

export default function Sidebar() {
  const player = useGameStore((s) => s.player);
  const signOut = useAuthStore((s) => s.signOut);
  const user = useAuthStore((s) => s.user);
  const standing = getStanding(player.streak);
  const avatar = AVATARS.find((a) => a.key === player.avatar) || AVATARS[0];

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 h-screen sticky top-0 border-r border-white/5 bg-navy-900/60 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-electric-500 to-cyan-400 flex items-center justify-center shadow-glow-sm">
          <LogoMark className="w-5 h-5 text-white" />
        </div>
        <span className="font-display font-bold text-lg text-white">LifeQuest</span>
      </div>

      <div className="mx-4 mb-4 glass-panel p-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy-700 to-navy-600 flex items-center justify-center text-2xl border border-white/10 shrink-0">
          {avatar.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">{user?.email?.split('@')[0]}</p>
          <p className="text-xs text-electric-400 font-medium">{standing.name}</p>
        </div>
        <div className="flex items-center gap-1 text-orange-400 text-xs font-bold shrink-0">
          <Flame className="w-3.5 h-3.5" />
          {player.streak}
        </div>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto scrollbar-none">
        {NAV_ITEMS.map((item) => {
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
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-electric-500/20 to-magenta-500/10 border border-electric-500/30 shadow-glow-sm"
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
      </nav>

      <div className="px-4 py-4 border-t border-white/5">
        <button onClick={signOut} className="nav-link w-full text-red-400/80 hover:text-red-400 hover:bg-red-500/10">
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
