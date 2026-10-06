import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BarChart3,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Users,
  Trophy,
  GitPullRequest,
  Code2,
  Lock,
  Camera,
  Check,
} from 'lucide-react';
import { DifficultyBadge } from '../../components/common/Badge';

export const LandingPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Interactive Adaptive Algorithm Simulator state
  const [simLevel, setSimLevel] = useState('easy');
  const [simFailures, setSimFailures] = useState(0);
  const [simScore, setSimScore] = useState(0);
  const [simHistory, setSimHistory] = useState([
    { q: 1, diff: 'easy', result: 'pending' },
  ]);

  const handleSimStep = (isCorrect) => {
    const currentQ = simHistory.length;
    let nextLevel = simLevel;
    let nextFailures = simFailures;
    let addedMarks = 0;

    if (isCorrect) {
      nextFailures = 0;
      if (simLevel === 'easy') {
        nextLevel = 'medium';
        addedMarks = 1;
      } else if (simLevel === 'medium') {
        nextLevel = 'hard';
        addedMarks = 2;
      } else {
        nextLevel = 'hard';
        addedMarks = 3;
      }
    } else {
      nextFailures = simFailures + 1;
      if (nextFailures >= 2) {
        if (simLevel === 'hard') nextLevel = 'medium';
        else if (simLevel === 'medium') nextLevel = 'easy';
        else nextLevel = 'easy';
        nextFailures = 0;
      }
    }

    const updatedHistory = simHistory.map((h, i) =>
      i === currentQ - 1 ? { ...h, result: isCorrect ? 'correct' : 'wrong' } : h
    );

    if (currentQ < 6) {
      updatedHistory.push({ q: currentQ + 1, diff: nextLevel, result: 'pending' });
    }

    setSimLevel(nextLevel);
    setSimFailures(nextFailures);
    setSimScore(simScore + addedMarks);
    setSimHistory(updatedHistory);
  };

  const resetSim = () => {
    setSimLevel('easy');
    setSimFailures(0);
    setSimScore(0);
    setSimHistory([{ q: 1, diff: 'easy', result: 'pending' }]);
  };

  const [quickLoginLoading, setQuickLoginLoading] = React.useState('');

  const handleQuickLogin = async (roleEmail, path) => {
    setQuickLoginLoading(roleEmail);
    try {
      await login(roleEmail, 'Password123!');
      navigate(path);
    } catch (err) {
      console.error('Demo login error:', err?.response?.data?.message || err.message);
      navigate('/login');
    } finally {
      setQuickLoginLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-14 lg:pt-24 lg:pb-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Enterprise Recruitment Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Intelligent Adaptive Hiring for{' '}
              <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">
                Zelis Engineering
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Replace rigid legacy quiz tools with a self-calibrating recruitment pipeline.
              Every candidate experiences a tailored journey that silently measures true technical mastery
              from initial assessment through L1/L2 interviews and formal offer.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => handleQuickLogin('candidate@example.com', '/candidate/dashboard')}
                disabled={!!quickLoginLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>Take Candidate Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleQuickLogin('recruiter@example.com', '/recruiter/dashboard')}
                disabled={!!quickLoginLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm border border-slate-300 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Users className="w-4 h-4 text-slate-600" />
                <span>Open Recruiter Portal</span>
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Dynamic Adaptive Difficulty
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Sandboxed Monaco Coding
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Full L1/L2 Interview Pipeline
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Recruitment Pipeline Process Stream */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700">Complete Hiring Pipeline</h2>
            <p className="text-xl font-bold text-slate-900 mt-1">From Candidate Application to Final Offer</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { step: '01', title: 'Application', desc: 'Profile & Resume' },
              { step: '02', title: 'System Check', desc: 'Cam, Mic & Screen' },
              { step: '03', title: 'Adaptive Exam', desc: 'Silent Difficulty' },
              { step: '04', title: 'Live Coding', desc: 'Multi-lang Sandbox' },
              { step: '05', title: 'Recruiter Review', desc: 'Telemetry & Score' },
              { step: '06', title: 'L1 Interview', desc: 'Technical Screening' },
              { step: '07', title: 'L2 Interview', desc: 'System Architecture' },
              { step: '08', title: 'Offer Letter', desc: 'Hiring Decision' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
                <div className="text-[10px] font-mono font-bold text-blue-600 mb-1">{item.step}</div>
                <div className="text-xs font-bold text-slate-900">{item.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Adaptive Algorithm Demo Simulator */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                <Cpu className="w-3.5 h-3.5" />
                <span>Proprietary Assessment Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Experience the Silent Adaptive Algorithm
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Test how the backend engine silently adjusts question levels based on correct answers and consecutive failures.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Current Internal Level
                  </div>
                  <div className="flex justify-center mt-2">
                    <DifficultyBadge difficulty={simLevel} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Consecutive Failures
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {simFailures} <span className="text-xs text-slate-400 font-normal">/ 2 to drop</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Accumulated Marks
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mt-1">{simScore} pts</div>
                </div>
              </div>

              {/* Step Sequence Visualization */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
                <div className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                  Live Question Progression Timeline:
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {simHistory.map((step, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                        step.result === 'correct'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : step.result === 'wrong'
                          ? 'bg-rose-50 border-rose-200 text-rose-800'
                          : 'bg-blue-50 border-blue-200 text-blue-800'
                      }`}
                    >
                      <span className="font-bold">Q{step.q}</span>
                      <span className="capitalize text-[11px] text-slate-600 font-semibold">({step.diff})</span>
                      {step.result === 'correct' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {step.result === 'wrong' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                      {step.result === 'pending' && <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleSimStep(true)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Candidate Answers Correctly
                  </button>
                  <button
                    onClick={() => handleSimStep(false)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Candidate Answers Incorrectly
                  </button>
                </div>

                <button
                  onClick={resetSim}
                  className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Demo
                </button>
              </div>

              <div className="mt-4 p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-[11px] text-blue-800 leading-relaxed">
                <strong>Important Principle:</strong> During the real assessment, candidates never see whether they are on Easy, Medium, or Hard. The transition happens silently on the backend, generating unbiased performance depth for recruiters.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Pillars */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700">Key Innovations</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Built for Serious Enterprise Hiring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Embedded Monaco Code Editor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full-featured developer environment supporting Python, Java, C, C++, and JavaScript. Runs real-time compilation and executes isolated sandboxed sample & hidden test cases.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Ethical Proctoring Telemetry</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict fullscreen mode, camera/microphone readiness check, and tab-switch telemetry. Anomalies are recorded as objective flags for recruiter review rather than unfair automated bans.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Recruiter Intelligence & Pipeline</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kanban recruitment pipeline (Applied to Offer), candidate comparison matrices, skill breakdowns, structured L1/L2 interview scheduling, and automated executive summary reports.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
