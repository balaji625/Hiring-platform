import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export const AntiCheatingModal = ({ isOpen, onClose, violationCount, reason }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-6 shadow-2xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-sm">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">Integrity Telemetry Recorded</h3>
        <p className="text-xs font-semibold text-rose-700 bg-rose-50 py-1.5 px-3 rounded-lg border border-rose-100 inline-block mb-3">
          Event #{violationCount}: {reason || 'Leaving the assessment window was recorded.'}
        </p>

        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          The Zelis Hiring Platform actively monitors tab focus, fullscreen continuity, and window switches. This telemetry is attached to your submission report and reviewed by the recruitment committee.
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer"
        >
          I Understand & Resume Assessment
        </button>
      </div>
    </div>
  );
};
