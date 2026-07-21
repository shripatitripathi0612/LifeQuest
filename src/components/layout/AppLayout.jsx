import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';
import { useGameStore } from '../../store/gameStore';
import { useDailyGateway } from '../../hooks/useDailyGateway';
import LoadingScreen from '../common/LoadingScreen';
import GatewayScreen from '../common/GatewayScreen';

export default function AppLayout() {
  const loaded = useGameStore((s) => s.loaded);
  const location = useLocation();
  const { show: showGateway, dismiss: dismissGateway } = useDailyGateway(loaded);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 px-4 sm:px-6 py-6 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          {loaded ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          ) : (
            <LoadingScreen label="Loading your quest log..." />
          )}
        </main>
      </div>
      <MobileNav />

      <AnimatePresence>
        {showGateway && <GatewayScreen key="gateway" onDismiss={dismissGateway} />}
      </AnimatePresence>
    </div>
  );
}
