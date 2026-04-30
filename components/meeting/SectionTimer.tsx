'use client';
import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeetingStore } from '@/lib/store';
import { playWarningChime } from '@/lib/audio';

interface SectionTimerProps {
  sectionId: string;
  size?: 'sm' | 'lg';
}

export default function SectionTimer({ sectionId, size = 'sm' }: SectionTimerProps) {
  const timer = useMeetingStore((s) => s.sectionTimers[sectionId]);
  const tickTimer = useMeetingStore((s) => s.tickTimer);
  const setPaused = useMeetingStore((s) => s.setPaused);
  const addTime = useMeetingStore((s) => s.addTime);
  const chimePlayedRef = useRef(false);

  const dim = size === 'sm' ? 64 : 160;
  const stroke = size === 'sm' ? 4 : 5;
  const r = (dim - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;

  const progress = timer ? timer.remainingSeconds / timer.totalSeconds : 1;
  const dashOffset = circ * (1 - progress);

  const isWarning = timer && timer.remainingSeconds > 0 && timer.remainingSeconds <= 20;
  const isExpired = timer?.isExpired;

  const strokeColor = isExpired
    ? 'var(--danger)'
    : isWarning
      ? 'var(--orange)'
      : 'url(#timerGrad)';

  const tick = useCallback(() => tickTimer(sectionId), [tickTimer, sectionId]);

  useEffect(() => {
    if (!timer?.isRunning || timer.isPaused) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timer?.isRunning, timer?.isPaused, tick]);

  useEffect(() => {
    if (isWarning && !chimePlayedRef.current) {
      chimePlayedRef.current = true;
      playWarningChime();
    }
    if (!isWarning) chimePlayedRef.current = false;
  }, [isWarning]);

  if (!timer) return null;

  const mins = Math.floor(timer.remainingSeconds / 60);
  const secs = timer.remainingSeconds % 60;
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <div style={{ position: 'relative', width: dim, height: dim }}>
        <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--teal)" />
              <stop offset="100%" stopColor="var(--purple)" />
            </linearGradient>
          </defs>
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            fill="none"
            stroke="var(--line)"
            strokeWidth={stroke}
            opacity={0.3}
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isWarning ? 'warning' : 'normal'}
              animate={isWarning ? { opacity: [1, 0.7, 1] } : { opacity: 1 }}
              transition={isWarning ? { duration: 1, repeat: Infinity } : {}}
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: size === 'sm' ? '0.8rem' : '1.8rem',
                color: isExpired ? 'var(--danger)' : isWarning ? 'var(--orange)' : 'var(--text-primary)',
                fontWeight: 500,
                letterSpacing: '-0.02em',
              }}
            >
              {display}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {size === 'lg' && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {timer.isPaused ? (
            <button
              onClick={() => setPaused(sectionId, false)}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--line)', borderRadius: '8px', color: 'var(--teal)', padding: '6px 14px', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Resume
            </button>
          ) : (
            <button
              onClick={() => setPaused(sectionId, true)}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--line)', borderRadius: '8px', color: 'var(--text-muted)', padding: '6px 14px', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              {timer.isRunning ? 'Pause' : 'Paused'}
            </button>
          )}
          <button
            onClick={() => addTime(sectionId, 120)}
            style={{ background: 'transparent', border: '1px solid var(--line)', borderRadius: '8px', color: 'var(--text-muted)', padding: '6px 14px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            +2 min
          </button>
        </div>
      )}

      {timer.isPaused && (
        <span style={{ fontSize: '0.7rem', color: 'var(--orange)', fontWeight: 600, letterSpacing: '0.1em' }}>PAUSED</span>
      )}
    </div>
  );
}
