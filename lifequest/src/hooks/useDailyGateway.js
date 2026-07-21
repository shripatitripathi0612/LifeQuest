import { useEffect, useState, useCallback } from 'react';
import { todayKey } from '../utils/dateHelpers';

const STORAGE_KEY = 'lifequest.gateway.lastShownDate';

/**
 * Shows the Gateway Screen once per calendar day. `ready` should only flip to
 * true once it's actually safe to reveal the dashboard underneath (i.e. the
 * game store has finished loading), so the fade-through never reveals a
 * half-loaded page.
 */
export function useDailyGateway(ready) {
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!ready || checked) return;
    let lastShown = null;
    try {
      lastShown = localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable — fail open and just skip the gateway
    }
    const today = todayKey();
    if (lastShown !== today) {
      setShow(true);
      try {
        localStorage.setItem(STORAGE_KEY, today);
      } catch {
        // best-effort persistence only
      }
    }
    setChecked(true);
  }, [ready, checked]);

  const dismiss = useCallback(() => setShow(false), []);

  return { show, dismiss };
}
