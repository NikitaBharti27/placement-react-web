import { useState, useEffect, useCallback } from 'react';

export function useOtpTimer(initialSeconds = 60) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const resetTimer = useCallback(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  const canResend = secondsLeft === 0;

  return {
    secondsLeft,
    canResend,
    resetTimer,
  };
}
