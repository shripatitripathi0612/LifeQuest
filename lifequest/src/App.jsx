import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useGameStore } from './store/gameStore';

import AppLayout from './components/layout/AppLayout';
import LoadingScreen from './components/common/LoadingScreen';
import ToastContainer from './components/common/ToastContainer';
import StandingUpModal from './components/common/StandingUpModal';
import StreakResetNotice from './components/common/StreakResetNotice';
import AchievementToastQueue from './components/common/AchievementToastQueue';

// Route-level code splitting: each page's JS is fetched only when its route
// is actually visited, instead of every page (Analytics' Recharts usage,
// Settings, Profile, etc.) being parsed and executed on first load regardless
// of whether the person ever goes there.
const Landing = React.lazy(() => import('./pages/Landing'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Habits = React.lazy(() => import('./pages/Habits'));
const Quests = React.lazy(() => import('./pages/Quests'));
const Achievements = React.lazy(() => import('./pages/Achievements'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Profile = React.lazy(() => import('./pages/Profile'));
const GuildMaster = React.lazy(() => import('./pages/GuildMaster'));

function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  if (!initialized) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  // Narrow, primitive selectors only — destructuring the whole store here
  // would re-render the entire router tree on every single store mutation
  // anywhere in the app (e.g. every habit completion), since App sits at
  // the top of the tree.
  const init = useAuthStore((s) => s.init);
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  const loadForUser = useGameStore((s) => s.loadForUser);
  const clear = useGameStore((s) => s.clear);
  const loaded = useGameStore((s) => s.loaded);

  useEffect(() => {
    let unsubscribe;
    let cancelled = false;
    init().then((fn) => {
      if (!cancelled) unsubscribe = fn;
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [init]);

  useEffect(() => {
    if (user) {
      loadForUser(user.id);
    } else if (initialized) {
      clear();
    }
  }, [user, initialized, clear, loadForUser]);

  useEffect(() => {
    if (loaded) {
      const theme = useGameStore.getState().settings.theme;
      document.documentElement.classList.toggle('dark', theme !== 'light');
      document.documentElement.classList.toggle('light', theme === 'light');
    }
  }, [loaded]);

  if (!initialized) {
    return <LoadingScreen label="Waking up your quest log..." />;
  }

  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/app" replace /> : <Landing />} />
          <Route path="/login" element={user ? <Navigate to="/app" replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/app" replace /> : <Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="habits" element={<Habits />} />
            <Route path="quests" element={<Quests />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="guild-master" element={<GuildMaster />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <ToastContainer />
      <StandingUpModal />
      <StreakResetNotice />
      <AchievementToastQueue />
    </>
  );
}
