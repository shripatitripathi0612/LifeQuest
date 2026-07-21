import React from 'react';
import { Lock, Check } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { getStanding, getStandingProgress } from '../utils/standing';
import { attributeProgress, attributeTier } from '../utils/attributes';
import { AVATARS, THEMES, TITLES, ATTRIBUTES } from '../utils/constants';
import ProgressRing from '../components/common/ProgressRing';
import * as Icons from 'lucide-react';

export default function Profile() {
  const player = useGameStore((s) => s.player);
  const equipAvatar = useGameStore((s) => s.equipAvatar);
  const equipTheme = useGameStore((s) => s.equipTheme);
  const equipTitle = useGameStore((s) => s.equipTitle);
  const standing = getStanding(player.streak);
  const { progress } = getStandingProgress(player.streak);

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-panel p-6 flex flex-col sm:flex-row items-center gap-6">
        <ProgressRing progress={progress} size={100} stroke={7}>
          <span className="text-5xl">{AVATARS.find((a) => a.key === player.avatar)?.emoji}</span>
        </ProgressRing>
        <div className="text-center sm:text-left">
          <h2 className="font-display text-2xl font-bold text-white">{standing.name}</h2>
          <p className="text-sm text-electric-400 font-medium mt-0.5">
            {TITLES.find((t) => t.key === player.equippedTitle)?.label || 'Newcomer'}
          </p>
          <p className="text-sm text-slate-500 mt-2">{player.streak}-day current streak · {player.longestStreak}-day best streak</p>
        </div>
      </div>

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-white mb-4">Life Attributes</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ATTRIBUTES.map((a) => {
            const Icon = Icons[a.icon];
            const points = player.attributes[a.key] || 0;
            return (
              <div key={a.key} className="flex flex-col items-center gap-2">
                <ProgressRing progress={attributeProgress(points)} size={56} stroke={5} colorFrom={a.color} colorTo={a.color}>
                  <Icon className="w-5 h-5" style={{ color: a.color }} />
                </ProgressRing>
                <p className="text-xs text-slate-400 font-medium">{a.label}</p>
                <p className="text-[11px] text-slate-600">{attributeTier(points)}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-white mb-4">Avatar</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {AVATARS.map((a) => {
            const unlocked = player.unlockedAvatars.includes(a.key);
            const equipped = player.avatar === a.key;
            return (
              <button
                key={a.key}
                disabled={!unlocked}
                onClick={() => equipAvatar(a.key)}
                className={`relative aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                  equipped ? 'border-electric-500 bg-electric-500/10 shadow-glow-sm' : 'border-white/10 bg-white/5'
                } ${!unlocked ? 'opacity-40 cursor-not-allowed' : 'hover:border-electric-500/50'}`}
              >
                {equipped && <Check className="absolute top-1 right-1 w-3.5 h-3.5 text-electric-400" />}
                {!unlocked && <Lock className="absolute top-1 right-1 w-3 h-3 text-slate-500" />}
                <span className="text-2xl">{a.emoji}</span>
                <span className="text-[10px] text-slate-400 text-center px-1">{unlocked ? a.label : `Day ${a.unlockStreak}`}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-white mb-4">Theme</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {THEMES.map((t) => {
            const unlocked = player.unlockedThemes.includes(t.key);
            const equipped = player.equippedTheme === t.key;
            return (
              <button
                key={t.key}
                disabled={!unlocked}
                onClick={() => equipTheme(t.key)}
                className={`relative rounded-xl p-3 border transition-all ${
                  equipped ? 'border-electric-500 shadow-glow-sm' : 'border-white/10'
                } ${!unlocked ? 'opacity-40 cursor-not-allowed' : 'hover:border-electric-500/50'}`}
              >
                <div className="h-8 rounded-lg mb-2" style={{ background: `linear-gradient(90deg, ${t.from}, ${t.to})` }} />
                <p className="text-[11px] text-slate-400 text-center">{unlocked ? t.label : `Day ${t.unlockStreak}`}</p>
                {equipped && <Check className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-electric-400" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-white mb-4">Titles</h3>
        <div className="flex flex-wrap gap-2">
          {TITLES.map((t) => {
            const unlocked = t.unlocked || player.titles.includes(t.key);
            const equipped = player.equippedTitle === t.key;
            return (
              <button
                key={t.key}
                disabled={!unlocked}
                onClick={() => equipTitle(t.key)}
                title={unlocked ? '' : t.condition}
                className={`badge transition-all ${equipped ? 'border-electric-500/50 bg-electric-500/15 text-electric-300' : ''} ${
                  !unlocked ? 'opacity-40 cursor-not-allowed' : 'hover:border-electric-500/40 cursor-pointer'
                }`}
              >
                {!unlocked && <Lock className="w-3 h-3" />}
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
