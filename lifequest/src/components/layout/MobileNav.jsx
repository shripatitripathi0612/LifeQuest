import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { MOBILE_NAV_ITEMS } from './navConfig';

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-navy-900/90 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 py-2">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = Icons[item.icon];
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-colors"
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-electric-400' : 'text-slate-500'}`} />
                  <span className={`transition-colors duration-200 ${isActive ? 'text-electric-400' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="mobile-nav-active-dot"
                      className="absolute -top-0.5 w-1 h-1 rounded-full bg-electric-400 shadow-glow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
