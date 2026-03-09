import { useState, useEffect } from 'react';

interface TimerState {
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isExpired: boolean;
  isWarning: boolean; // Less than 30 seconds
}

export function useTimer(initialMinutes: number = 2): TimerState {
  const totalInitialSeconds = initialMinutes * 60;
  const [totalSeconds, setTotalSeconds] = useState(totalInitialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || totalSeconds <= 0) {
      if (totalSeconds <= 0) {
        setIsRunning(false);
      }
      return;
    }

    const interval = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, totalSeconds]);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const isExpired = totalSeconds === 0;
  const isWarning = totalSeconds <= 30 && totalSeconds > 0;

  return {
    minutes,
    seconds,
    totalSeconds,
    isRunning,
    isExpired,
    isWarning,
  };
}
