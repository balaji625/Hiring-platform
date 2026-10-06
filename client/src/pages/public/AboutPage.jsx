import React from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  TrendingUp,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Code2,
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            <BrainCircuit className="w-3.5 h-3.5" />
            Platform Architecture & Core Innovation
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            About the Zelis Adaptive Hiring Ecosystem
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Instead of depending completely on third-party assessment vendors, Zelis designed this internal platform to dynamically align with real engineering hiring standards.
          </p>
        </div>

        {/* The Core Concept */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Product Differentiator: Personalized Adaptive Progression</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every candidate receives a personalized assessment journey rather than a fixed question set. The backend silently modulates difficulty based on verified demonstrated ability:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-emerald-700 block mb-1">Easy Level (1 Mark)</span>
              <p className="text-slate-600">Baseline diagnostic tier. All candidates start here to confirm foundational competency.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-amber-700 block mb-1">Medium Level (2 Marks)</span>
              <p className="text-slate-600">Core engineering level evaluating practical algorithmic efficiency and data modeling.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-rose-700 block mb-1">Hard Level (3 Marks)</span>
              <p className="text-slate-600">Principal-tier challenge testing advanced concurrency, edge cases, and optimization.</p>
            </div>
          </div>
        </div>

        {/* Transition Logic */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span>Deterministic Adaptive State Machine</span>
          </h2>

          <div className="font-mono text-xs bg-slate-900 p-4 rounded-xl text-slate-200 overflow-x-auto">
            <pre>{`currentDifficulty = EASY
failureCount = 0

on (answerSubmitted):
  if isCorrect:
    failureCount = 0
    if currentDifficulty == EASY:   nextDifficulty = MEDIUM
    if currentDifficulty == MEDIUM: nextDifficulty = HARD
    if currentDifficulty == HARD:   nextDifficulty = HARD

  else:
    failureCount += 1
    if failureCount >= 2:
      if currentDifficulty == HARD:   nextDifficulty = MEDIUM
      if currentDifficulty == MEDIUM: nextDifficulty = EASY
      failureCount = 0
    else:
      nextDifficulty = currentDifficulty`}</pre>
          </div>
        </div>

        {/* Monitored Proctoring */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Ethical Integrity Telemetry</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The platform enforces full-screen continuity checks, tab blur tracking, and camera/microphone status checks.
            Critically, anti-cheating signals generate <strong>flags for recruiter review</strong>, ensuring candidates are never unfairly auto-rejected based solely on heuristic models.
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <Link to="/" className="text-xs font-semibold text-slate-600 hover:text-slate-900">
            ← Back to Home
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
