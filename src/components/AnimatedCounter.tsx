import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/audio';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  playSound?: boolean;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 800,
  prefix = '',
  suffix = '',
  playSound = true,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;
    const targetValue = value;
    let lastPlayedValue = -1;

    if (targetValue === 0) {
      setDisplayValue(0);
      return;
    }

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad
      const current = Math.floor(progress * (targetValue - startValue) + startValue);

      setDisplayValue(current);

      if (playSound && current !== lastPlayedValue) {
        lastPlayedValue = current;
        const pitch = 0.9 + (current / (targetValue || 1)) * 0.4;
        soundManager.playCounterTick(pitch);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration, playSound]);

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString('id-ID')}
      {suffix}
    </span>
  );
};
