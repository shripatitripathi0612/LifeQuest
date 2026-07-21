import React from 'react';
import { Flame } from 'lucide-react';
import LogoMark from '../common/LogoMark';
import { useGameStore } from '../../store/gameStore';
import { getStandingProgress } from '../../utils/standing';
import { useLocation } from 'react-router-dom';
import { NAV_ITEMS } from './navConfig';

export default function Topbar() {
  const player = useGameStore((s) => s.player);
  const { current, next, progress } = getStandingProgress(player.streak);
  const location = useLocation();
  const currentNav = NAV_ITEMS.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)));

  return (
    <header className="sticky top-0 z-30 bg-navy-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-4 px-4 sm:px-6 py-3">
        <div className="lg:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-electric-500 to-cyan-400 flex items-center justify-center shrink-0">
          <LogoMark className="w-4 h-4 text-white" />
        </div>

        <h1 className="hidden sm:block font-display font-bold text-white text-lg shrink-0">
          {currentNav?.label || 'LifeQuest'}
        </h1>

        <div className="flex-1 flex items-center gap-2 max-w-md">
          <span className="text-xs font-bold text-cyan-400 shrink-0">{current.name}</span>
          <div className="xp-bar-track flex-1">
            <div className="xp-bar-fill" style={{ width: `${progress * 100}%` }} />
          </div>
          {next && (
            <span className="hidden sm:block text-[11px] text-slate-500 shrink-0">
              {next.day - player.streak}d to {next.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 badge">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-orange-300">{player.streak}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
