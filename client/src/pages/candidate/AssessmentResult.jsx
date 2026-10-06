import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Lock,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { DifficultyBadge } from '../../components/common/Badge';

export const AssessmentResult = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const isCandidate = user?.role === 'candidate';

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/attempts/${id}/result`);
        setData(res.data.data);

        // Friendly celebration confetti on successful submission
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 },
        });
      } catch (err) {
        setError('Failed to fetch assessment results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-zelis-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading submission data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl max-w-sm text-center shadow-sm">
          <p className="text-rose-600 text-sm font-semibold mb-3">{error || 'Submission not found.'}</p>
          <Link
            to={isCandidate ? '/candidate/dashboard' : '/recruiter/leaderboard'}
            className="text-xs font-semibold text-zelis-600 underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { attempt, reviewQuestions } = data;

  // =========================================================================
  // CANDIDATE VIEW: STRICT SCORE SECRECY ENFORCEMENT
  // Candidates NEVER see score %, marks, difficulty labels, or answers.
  // =========================================================================
  if (isCandidate) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Submission Confirmed
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Assessment Submitted Successfully
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Thank you for completing <strong className="text-slate-800">{attempt.assessment?.title || 'the assessment'}</strong>.
              Your answers, code solutions, and proctoring telemetry have been securely received and recorded.
            </p>
          </div>

          {/* Secure Evaluation Notice */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Lock className="w-4 h-4 text-zelis-600" />
              <span>Confidential Evaluation Protocol</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              In accordance with Zelis evaluation guidelines, detailed scoring analytics, question-level marks, and difficulty tiers are reviewed directly by the hiring panel. You will receive updates on your application status via email and in your candidate portal.
            </p>
          </div>

          {/* Submission Metadata */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Submitted At</span>
              <span className="text-xs font-semibold text-slate-700 mt-0.5 block">
                {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Proctoring Telemetry</span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Integrity Logged
              </span>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              to="/candidate/applications"
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-zelis-600 hover:bg-zelis-700 text-white transition-colors text-center shadow-sm"
            >
              View Application Status
            </Link>
            <Link
              to="/candidate/dashboard"
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors text-center"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RECRUITER / ADMIN VIEW: COMPLETE PERFORMANCE ANALYTICS & CHARTS
  // =========================================================================
  const difficultyMap = { easy: 1, medium: 2, hard: 3 };
  const chartData = (attempt.difficultyHistory || []).map((h) => ({
    name: `Q${h.questionNumber}`,
    difficultyNumeric: difficultyMap[h.difficulty?.toLowerCase()] || 1,
    difficulty: h.difficulty?.toUpperCase(),
    result: h.result,
    score: h.score,
    topic: h.topic,
  }));

  const skillChartData = (attempt.skillAnalysis || []).map((s) => ({
    topic: s.topic,
    accuracy: s.accuracy,
    correct: s.correct,
    attempted: s.attempted,
  }));

  const passed = attempt.percentage >= (attempt.assessment?.passingScore || 60);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            to={`/recruiter/assessment/${attempt.assessment?._id || ''}/leaderboard`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-zelis-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Assessment Leaderboard
          </Link>
          <Link
            to={`/recruiter/candidates/${attempt.candidate?._id || ''}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zelis-600 text-white text-xs font-semibold hover:bg-zelis-700"
          >
            <span>Candidate Full Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Recruiter Evaluation Banner */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zelis-50 text-zelis-700 border border-zelis-200 mb-2">
                <Award className="w-3.5 h-3.5" />
                Recruiter Evaluation Analytics
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {attempt.assessment?.title || 'Technical Assessment'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Candidate: <strong className="text-slate-800">{attempt.candidate?.name}</strong> ({attempt.candidate?.email}) • Submitted{' '}
                {new Date(attempt.submittedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`p-4 rounded-xl border flex flex-col items-center justify-center min-w-[130px] ${
                  passed
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}
              >
                <span className="text-3xl font-black font-mono leading-none">{attempt.percentage}%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
                  {passed ? 'Passed Benchmark' : 'Below Cutoff'}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Total Score</span>
              <p className="font-mono text-base font-bold text-slate-900 mt-0.5">
                {attempt.totalScore} / {attempt.maxPossibleScore} pts
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Accuracy</span>
              <p className="font-mono text-base font-bold text-emerald-600 mt-0.5">
                {attempt.accuracy}%
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Highest Level</span>
              <div className="mt-1">
                <DifficultyBadge difficulty={attempt.highestDifficulty} />
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Proctoring Telemetry</span>
              <p className="font-mono text-xs font-semibold text-slate-700 mt-1">
                {attempt.tabSwitchCount === 0 ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 0 Flags (Clean)
                  </span>
                ) : (
                  <span className="text-amber-700">{attempt.tabSwitchCount} Tab Switches</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Difficulty Progression Curve */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-zelis-600" />
                <span>Difficulty Progression Curve</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Adaptive level trajectory (1 = Easy, 2 = Medium, 3 = Hard)
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[1, 3]}
                    ticks={[1, 2, 3]}
                    tickFormatter={(val) => (val === 1 ? 'EASY' : val === 2 ? 'MED' : 'HARD')}
                    stroke="#64748b"
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-md text-xs">
                            <span className="font-bold text-slate-900">{d.name} • {d.topic}</span>
                            <div className="mt-1 space-y-0.5 text-slate-600">
                              <p>Tier: <strong className="text-slate-900">{d.difficulty}</strong></p>
                              <p>Result: <strong className={d.result ? 'text-emerald-600' : 'text-rose-600'}>{d.result ? 'Correct' : 'Incorrect'}</strong></p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="stepAfter"
                    dataKey="difficultyNumeric"
                    stroke="#0066cc"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#0066cc' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Performance by Topic */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-600" />
                <span>Skill Mastery by Topic</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Accuracy breakdown across assessment domains</p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="topic" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-md text-xs">
                            <span className="font-bold text-slate-900">{d.topic}</span>
                            <p className="text-slate-600 mt-1 font-mono">
                              Accuracy: <strong className="text-emerald-600">{d.accuracy}%</strong> ({d.correct}/{d.attempted} correct)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="accuracy" fill="#0066cc" radius={[6, 6, 0, 0]}>
                    {skillChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.accuracy >= 70 ? '#10b981' : entry.accuracy >= 40 ? '#f59e0b' : '#ef4444'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Question-by-Question Review</h2>
            <span className="text-xs text-slate-500">
              {reviewQuestions?.length || 0} questions evaluated
            </span>
          </div>

          <div className="space-y-3">
            {(reviewQuestions || []).map((q, idx) => {
              const isExpanded = expandedQuestion === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50"
                >
                  <div
                    onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-500 w-6">
                        #{idx + 1}
                      </span>
                      {q.isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-800 line-clamp-1">{q.title}</p>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {q.topic} • {q.difficulty?.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-700">
                        {q.awardedScore}/{q.maxScore} pts
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 pt-2 border-t border-slate-200 bg-white space-y-3 text-xs">
                      <div>
                        <span className="font-semibold text-slate-600 block mb-1">Question Prompt:</span>
                        <p className="text-slate-800">{q.description}</p>
                      </div>

                      {q.type === 'mcq' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">Candidate Answer</span>
                            <span className={`font-semibold ${q.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {q.userAnswer !== null && q.userAnswer !== undefined
                                ? q.options?.[q.userAnswer]?.text || `Option #${q.userAnswer + 1}`
                                : 'No answer selected'}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                            <span className="text-[10px] font-bold uppercase text-emerald-600 block">Correct Answer</span>
                            <span className="font-semibold text-emerald-800">
                              {q.options?.find((o) => o.isCorrect)?.text || 'Option marked as correct'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Submitted Code</span>
                          <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                            {q.userCode || '// No code submitted'}
                          </pre>
                        </div>
                      )}

                      {q.explanation && (
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                          <strong className="text-slate-800">Explanation: </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResult;
