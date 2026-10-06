import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export const Timer = ({ startedAt, durationMinutes = 45, onTimeExpire }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    const calculateRemaining = () => {
      const startTime = new Date(startedAt).getTime();
      const totalAllowedMs = durationMinutes * 60 * 1000;
      const elapsedMs = Date.now() - startTime;
      const remainingMs = totalAllowedMs - elapsedMs;

      if (remainingMs <= 0) {
        setSecondsRemaining(0);
        if (onTimeExpire) onTimeExpire();
      } else {
        setSecondsRemaining(Math.floor(remainingMs / 1000));
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);

    return () => clearInterval(interval);
  }, [startedAt, durationMinutes, onTimeExpire]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isUrgent = secondsRemaining < 300; // less than 5 minutes

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-semibold transition-colors ${
        isUrgent
          ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse'
          : 'bg-slate-800/80 border-slate-700 text-slate-200'
      }`}
    >
      {isUrgent ? (
        <AlertTriangle className="w-4 h-4 text-rose-400" />
      ) : (
        <Clock className="w-4 h-4 text-zelis-400" />
      )}
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};
