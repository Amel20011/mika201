import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/audio';

interface TypewriterTextProps {
  lines: string[];
  highlightLastLine?: boolean;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  lines,
  highlightLastLine = true,
  speed = 28,
  onComplete,
  className = '',
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const completedRef = useRef(false);

  // Reset when lines change
  useEffect(() => {
    setCurrentLineIndex(0);
    setDisplayedLines(lines.map(() => ''));
    setCurrentCharIndex(0);
    setIsFinished(false);
    completedRef.current = false;
  }, [lines]);

  useEffect(() => {
    if (isFinished) return;
    if (currentLineIndex >= lines.length) {
      setIsFinished(true);
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      return;
    }

    const currentTargetLine = lines[currentLineIndex];

    if (currentCharIndex < currentTargetLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[currentLineIndex] = currentTargetLine.slice(0, currentCharIndex + 1);
          return updated;
        });
        setCurrentCharIndex((c) => c + 1);

        // Sound effect tick on characters (skip space for more natural typing rhythm)
        if (currentTargetLine[currentCharIndex] !== ' ') {
          soundManager.playTypeTick();
        }
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      // Pause slightly between lines
      const linePause = setTimeout(() => {
        setCurrentLineIndex((l) => l + 1);
        setCurrentCharIndex(0);
      }, 200);

      return () => clearTimeout(linePause);
    }
  }, [currentLineIndex, currentCharIndex, lines, speed, isFinished, onComplete]);

  // Fast skip if user clicks text
  const handleSkip = () => {
    setDisplayedLines([...lines]);
    setIsFinished(true);
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  };

  return (
    <div
      onClick={handleSkip}
      title={!isFinished ? 'Klik untuk melewati animasi teks' : undefined}
      className={`relative cursor-pointer select-none space-y-1.5 ${className}`}
    >
      {displayedLines.map((line, idx) => {
        const isCurrentLine = idx === currentLineIndex;
        const isLastLine = idx === lines.length - 1;
        const isCompleted = idx < currentLineIndex || isFinished;

        if (idx > currentLineIndex && !isFinished) return null;

        return (
          <p
            key={idx}
            className={`transition-colors duration-150 ${
              isLastLine && highlightLastLine
                ? 'font-bold text-indigo-900 mt-2 text-base'
                : 'text-slate-800'
            }`}
          >
            {line}
            {isCurrentLine && !isFinished && (
              <span className="inline-block w-2 h-4 ml-0.5 bg-indigo-600 animate-pulse align-middle" />
            )}
          </p>
        );
      })}

      {!isFinished && (
        <span className="text-[10px] text-indigo-500/80 font-medium block pt-1 hover:underline">
          Klik teks untuk mempercepat...
        </span>
      )}
    </div>
  );
};
