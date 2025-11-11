import { useState, useEffect, useCallback } from 'react';

/**
 * Auto-refresh hook that calls a callback function at regular intervals
 */
export function useAutoRefresh(
  callback: () => void,
  interval: number = 300000, // 5 minutes default
  enabled: boolean = true
) {
  const [countdown, setCountdown] = useState(interval / 1000);
  const [isPaused, setIsPaused] = useState(!enabled);

  const reset = useCallback(() => {
    setCountdown(interval / 1000);
  }, [interval]);

  useEffect(() => {
    if (isPaused || !enabled) return;

    // Refresh interval
    const refreshTimer = setInterval(() => {
      callback();
      reset();
    }, interval);

    // Countdown timer (every second)
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return interval / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(refreshTimer);
      clearInterval(countdownTimer);
    };
  }, [callback, interval, isPaused, enabled, reset]);

  return {
    countdown,
    isPaused,
    setIsPaused,
    reset
  };
}
