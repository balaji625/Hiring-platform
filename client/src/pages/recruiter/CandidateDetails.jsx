import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
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
  User,
  Mail,
  FileText,
  ExternalLink,
  Award,
  TrendingUp,
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
  Printer,
  ArrowRight,
  ShieldCheck,
  Check,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
  Briefcase,
  Phone,
  MapPin,
  Code2,
} from 'lucide-react';
import { DifficultyBadge, StatusBadge, RecommendationBadge } from '../../components/common/Badge';

export const CandidateDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/recruiters/candidates/${id}`);
      setData(res.data.data);
    } catch (err) {
      setError('Failed to fetch candidate details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      const activeApp = data?.applications?.[0];
      if (!activeApp) return;

      await api.patch(`/recruiters/applications/${activeApp._id}/status`, {
        status: newStatus,
        note: `Candidate advanced to ${newStatus} by recruiter`,
      });

      setActionSuccess(`Candidate successfully moved to ${newStatus}`);
      setTimeout(() => setActionSuccess(''), 3000);
      fetchDetails();
    } catch (err) {
      console.error('Failed to update application status:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-zelis-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-600">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center">
          <p className="text-rose-600 text-sm font-semibold mb-3">{error || 'Candidate not found.'}</p>
          <Link to="/recruiter/leaderboard" className="text-xs text-zelis-600 font-semibold underline">
            Back to Leaderboard
          </Link>
        </div>
      </div>
    );
  }

  const { candidate, profile, applications, latestAttempt, strengths, weaknesses } = data;
  const currentApp = applications?.[0];

  const difficultyMap = { easy: 1, medium: 2, hard: 3 };
  const progressionData = (latestAttempt?.difficultyHistory || []).map((h) => ({
    name: `Q${h.questionNumber}`,
    difficultyNumeric: difficultyMap[h.difficulty?.toLowerCase()] || 1,
    difficulty: h.difficulty?.toUpperCase(),
    result: h.result,
    topic: h.topic,
  }));

  const skillData = (latestAttempt?.skillAnalysis || []).map((s) => ({
    topic: s.topic,
    accuracy: s.accuracy,
    correct: s.correct,
    attempted: s.attempted,
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {actionSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Candidate Summary Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-900">{candidate.name}</h1>
                {currentApp?.status && <StatusBadge status={currentApp.status} />}
                {currentApp?.recommendation && <RecommendationBadge rec={currentApp.recommendation} />}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {profile?.headline || 'Software Engineer'}
                {profile?.location && <> • <MapPin className="inline w-3 h-3" /> {profile.location}</>}
              </p>

              {/* Contact + Social Links Row */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Mail className="w-3.5 h-3.5" />
                  {candidate.email}
                </span>
                {profile?.phone && (
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Phone className="w-3.5 h-3.5" />
                    {profile.phone}
                  </span>
                )}
              </div>

              {/* Social Profile Links */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {profile?.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    GitHub Profile
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    LinkedIn
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                )}
                {profile?.portfolioUrl && (
                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Portfolio
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                )}
                {profile?.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 border border-slate-200 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Resume / CV
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Assessment Score</span>
              <p className="font-mono text-xl font-bold text-slate-900 mt-0.5">
                {latestAttempt?.percentage || 0}%
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Accuracy</span>
              <p className="font-mono text-xl font-bold text-emerald-600 mt-0.5">
                {latestAttempt?.accuracy || 0}%
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Highest Level</span>
              <div className="mt-1">
                <DifficultyBadge difficulty={latestAttempt?.highestDifficulty || 'easy'} />
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Questions Completed</span>
              <p className="font-mono text-xl font-bold text-zelis-700 mt-0.5">
                {latestAttempt?.questionsAttemptedCount || 0} / {latestAttempt?.totalQuestions || 15}
              </p>
            </div>
          </div>

          {/* Education & Skills Info Row */}
          {(profile?.college || profile?.skills?.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 mt-5 border-t border-slate-100">
              {profile?.college && (
                <div className="flex items-start gap-2.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{profile.college}</p>
                    {profile.degree && <p className="text-[11px] text-slate-500">{profile.degree}</p>}
                    {profile.graduationYear && (
                      <p className="text-[10px] text-slate-400">Class of {profile.graduationYear}</p>
                    )}
                  </div>
                </div>
              )}
              {profile?.skills?.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-semibold text-slate-400 mb-2">Declared Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.slice(0, 12).map((sk, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pipeline Stage Movement Action Buttons */}
        {currentApp && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Move Candidate to Stage:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleUpdateStatus('Shortlisted')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors cursor-pointer"
              >
                Shortlist
              </button>
              <button
                onClick={() => handleUpdateStatus('L1 Interview')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 transition-colors cursor-pointer"
              >
                Move to L1
              </button>
              <button
                onClick={() => handleUpdateStatus('L2 Interview')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer"
              >
                Move to L2
              </button>
              <button
                onClick={() => handleUpdateStatus('Selected')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
              >
                Selected
              </button>
              <button
                onClick={() => handleUpdateStatus('Offer')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-bold transition-colors cursor-pointer"
              >
                Extend Offer
              </button>
              <button
                onClick={() => handleUpdateStatus('Rejected')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
              >
                Reject
              </button>
            </div>
          </div>
        )}

        {/* Charts & Diagnostic Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Difficulty Progression Curve */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-zelis-600" />
              <span>Adaptive Difficulty Curve</span>
            </h2>
            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <YAxis
                    domain={[1, 3]}
                    ticks={[1, 2, 3]}
                    tickFormatter={(v) => (v === 3 ? 'HARD' : v === 2 ? 'MED' : 'EASY')}
                    stroke="#94a3b8"
                    tick={{ fontSize: 9 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const it = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200 p-2 rounded-xl shadow-lg text-xs">
                            <span className="font-bold text-slate-900">{it.name} • {it.topic}</span>
                            <p className="text-zelis-700">Level: {it.difficulty}</p>
                            <p className={it.result === 'correct' ? 'text-emerald-600' : 'text-rose-600'}>
                              {it.result === 'correct' ? 'Correct' : 'Incorrect'}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="stepAfter"
                    dataKey="difficultyNumeric"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      return (
                        <circle
                          key={`pt-${payload.name}`}
                          cx={cx}
                          cy={cy}
                          r={4.5}
                          fill={payload.result === 'correct' ? '#10b981' : '#f43f5e'}
                          stroke="#fff"
                          strokeWidth={1.5}
                        />
                      );
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Mastery Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <span>Topic-Wise Mastery Breakdown</span>
            </h2>
            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="topic" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 9 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const s = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200 p-2 rounded-xl shadow-lg text-xs">
                            <span className="font-bold text-slate-900">{s.topic}</span>
                            <p className="text-emerald-600 font-semibold">Accuracy: {s.accuracy}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="accuracy" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-3">
              Identified Core Strengths
            </span>
            <div className="space-y-2">
              {strengths?.map((st, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-amber-200 rounded-2xl shadow-sm p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-3">
              Identified Growth Opportunities
            </span>
            <div className="space-y-2">
              {weaknesses?.map((wk, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{wk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
