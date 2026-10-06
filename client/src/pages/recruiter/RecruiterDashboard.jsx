import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Users,
  FileQuestion,
  CheckCircle,
  Trophy,
  TrendingUp,
  Award,
  GitPullRequest,
  PlusCircle,
  ArrowRight,
  BrainCircuit,
  BarChart3,
  Clock,
  Sparkles,
} from 'lucide-react';

export const RecruiterDashboard = () => {
  const [stats, setStats] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, assessRes] = await Promise.allSettled([
          api.get('/recruiters/dashboard'),
          api.get('/assessments'),
        ]);

        if (dashRes.status === 'fulfilled') {
          setStats(dashRes.value.data.data);
        } else {
          setError('Failed to load recruiter analytics.');
        }

        if (assessRes.status === 'fulfilled') {
          setAssessments(assessRes.value.data.data || []);
        }
      } catch (err) {
        setError('Failed to load recruiter analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-zelis-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading recruiter intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-sm text-center shadow-sm">
          <p className="text-rose-600 text-sm font-semibold mb-3">{error || 'Could not load data.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs font-semibold text-zelis-600 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zelis-50 text-zelis-700 border border-zelis-200 mb-2">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Zelis Intelligence Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Recruiter Analytics & Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time insights across candidates, adaptive assessments, score distributions, and topic benchmarks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/recruiter/create-assessment"
              className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2 shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-zelis-600" />
              <span>Create Assessment</span>
            </Link>
            <Link
              to="/recruiter/leaderboard"
              className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-zelis-600 hover:bg-zelis-700 text-white flex items-center gap-2 shadow-sm transition-colors"
            >
              <Trophy className="w-4 h-4" />
              <span>Global Leaderboard</span>
            </Link>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Candidates</span>
              <Users className="w-4 h-4 text-zelis-600" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalCandidates}</span>
            <p className="text-[11px] text-slate-400 mt-1">Registered applicants</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Assessments</span>
              <FileQuestion className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.assessmentsCreated}</span>
            <p className="text-[11px] text-slate-400 mt-1">Published benchmarks</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Completed Tests</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {stats.completedAssessments}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Rate: {stats.completionRate}%</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Average Score</span>
              <Award className="w-4 h-4 text-cyan-600" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.averageScore}%</span>
            <p className="text-[11px] text-slate-400 mt-1">Acc: {stats.averageAccuracy}%</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Shortlisted</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">
              {stats.shortlistedCandidates}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Advanced to interview</p>
          </div>
        </div>

        {/* Separate Assessment Leaderboards Section (User Request Highlight) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-bold text-slate-900">Per-Assessment Leaderboards</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                View individual ranked candidate standings, pass/fail status, GitHub/LinkedIn links, and skill breakdowns for each assessment separately.
              </p>
            </div>
            <Link
              to="/recruiter/leaderboard"
              className="text-xs font-semibold text-zelis-600 hover:text-zelis-700 flex items-center gap-1 shrink-0"
            >
              <span>Global Multi-Factor Leaderboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {assessments.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No assessments created yet.{' '}
              <Link to="/recruiter/create-assessment" className="text-zelis-600 font-semibold underline">
                Create one now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {assessments.map((a) => (
                <div
                  key={a._id}
                  className="p-5 rounded-xl border border-slate-200 hover:border-zelis-300 hover:shadow-md transition-all bg-slate-50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zelis-100 text-zelis-800">
                        {a.category || 'Engineering'}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {a.timeLimitMinutes || a.durationMinutes || 60}m
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{a.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {a.description || 'Full-stack software engineering assessment with adaptive questions.'}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-200/60 font-mono">
                      <span>Cutoff: <strong className="text-slate-800">{a.passingScore || 60}%</strong></span>
                      <span>Total Qs: <strong className="text-slate-800">{a.totalQuestions || 15}</strong></span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Separate Ranking</span>
                    <Link
                      to={`/recruiter/assessment/${a._id}/leaderboard`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zelis-600 hover:bg-zelis-700 text-white shadow-sm transition-colors"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-300" />
                      <span>View Leaderboard</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Candidate Score Distribution */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-zelis-600" />
                <span>Candidate Score Distribution</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Proportion of candidates grouped by final percentage bracket
              </p>
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.scoreDistribution}
                    dataKey="count"
                    nameKey="bracket"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={4}
                  >
                    {(stats.scoreDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200 shadow-md p-2.5 rounded-xl text-xs">
                            <span className="font-bold text-slate-900">{d.bracket}</span>
                            <p className="text-slate-600 font-mono mt-0.5">{d.count} candidates</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {(stats.scoreDistribution || []).map((item) => (
                <div key={item.bracket} className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.bracket}</span>
                  <span className="font-mono font-semibold text-slate-900">({item.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Highest Difficulty Level Achieved */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-600" />
                <span>Peak Difficulty Level Reached</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Maximum challenge tier achieved during adaptive sessions
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.difficultyDist} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200 shadow-md p-2.5 rounded-xl text-xs">
                            <span className="font-bold text-slate-900">{d.name} Difficulty</span>
                            <p className="text-slate-600 font-mono mt-0.5">{d.count} candidates reached</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {(stats.difficultyDist || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Topic Mastery Benchmark */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Topic Mastery Benchmark Across All Candidates</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Average accuracy percentage in DSA, SQL, OOP, and DBMS
                </p>
              </div>

              <Link
                to="/recruiter/pipeline"
                className="text-xs font-semibold text-zelis-600 hover:text-zelis-700 flex items-center gap-1"
              >
                <span>View Recruitment Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {(stats.topicPerformance || []).map((tp) => (
                <div key={tp.topic} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    {tp.topic}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold font-mono text-slate-900">{tp.averageAccuracy}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 mt-2 overflow-hidden">
                    <div
                      className="h-full bg-zelis-600 rounded-full"
                      style={{ width: `${tp.averageAccuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
