import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Sparkles } from 'lucide-react';

export const AdaptiveTransitionBanner = ({ transition, isCorrect, nextDifficulty }) => {
  if (!transition) return null;

  const isLevelUp = transition.includes('easy -> medium') || transition.includes('medium -> hard');
  const isLevelDown = transition.includes('hard -> medium') || transition.includes('medium -> easy');

  return (
    <div
      className={`p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
        isCorrect
          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
          : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
            isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
          }`}
        >
          {isLevelUp ? (
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          ) : isLevelDown ? (
            <ArrowDownRight className="w-4 h-4 text-amber-400" />
          ) : (
            <Minus className="w-4 h-4" />
          )}
        </div>
        <div>
          <div className="font-semibold flex items-center gap-1.5">
            <span>Adaptive Engine Calibration</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase font-mono">
              {transition}
            </span>
          </div>
          <p className="text-xs opacity-90">
            {isLevelUp && 'Great job! Moving to higher difficulty questions for increased score potential.'}
            {isLevelDown && 'Difficulty recalibrated downwards after consecutive incorrect attempts.'}
            {!isLevelUp && !isLevelDown && isCorrect && 'Maximum challenge level maintained! Earn 3 marks per question.'}
            {!isLevelUp && !isLevelDown && !isCorrect && 'Level maintained. Answer next question correctly to prevent downgrade.'}
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1 font-mono text-xs uppercase px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700">
        Next: <span className="font-bold text-white">{nextDifficulty}</span>
      </div>
    </div>
  );
};
