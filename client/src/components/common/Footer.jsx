import React from 'react';
import { BrainCircuit, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 tracking-tight text-sm">Zelis Hiring Platform</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Conceptual enterprise adaptive recruitment ecosystem for Zelis. Dynamically calibrates question difficulty and powers full-lifecycle candidate hiring.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider mb-2.5">Pipeline Stages</h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>Candidate Application</li>
              <li>Secure Monitored Assessment</li>
              <li>Silent Adaptive Difficulty Engine</li>
              <li>Live Sandboxed Code Evaluation</li>
              <li>L1 & L2 Structured Interviews</li>
              <li>Final Selection & Offer</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider mb-2.5">Integrity & Proctoring</h4>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Fullscreen Secure Mode
              </li>
              <li>Webcam & Mic Permissions Check</li>
              <li>Tab Visibility Switch Telemetry</li>
              <li>AI Event Anomaly Flagging</li>
              <li>Server-Side Isolated Scoring</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider mb-2.5">Supported Languages</h4>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['Python', 'Java', 'C', 'C++', 'JavaScript'].map((lang) => (
                <span
                  key={lang}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-100 border border-slate-200 text-slate-700 font-medium"
                >
                  {lang}
                </span>
              ))}
            </div>
            <div className="text-[11px] text-slate-500">
              Monaco Editor embedded code sandbox
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Zelis Healthcare Assessment Engineering. Enterprise Internal Recruitment Ecosystem.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-600 font-medium">Adaptive Engine: Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
