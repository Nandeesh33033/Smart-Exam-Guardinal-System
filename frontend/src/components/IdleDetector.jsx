import { useEffect, useRef } from 'react';

export default function IdleDetector({ onViolation, thresholdMs = 60000 }) {
  const timeoutRef = useRef();

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => onViolation('IDLE_DETECTED'), thresholdMs);
    };

    ['mousemove', 'keydown', 'click'].forEach((eventName) => window.addEventListener(eventName, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutRef.current);
      ['mousemove', 'keydown', 'click'].forEach((eventName) => window.removeEventListener(eventName, resetTimer));
    };
  }, [onViolation, thresholdMs]);

  return null;
}
