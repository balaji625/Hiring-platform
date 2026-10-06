import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  Trophy,
  Search,
  ArrowRight,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Medal,
  Users,
  BarChart3,
  Code2,
  Percent,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import { DifficultyBadge, StatusBadge } from '../../components/common/Badge';

const DIFF_COLORS = {
  hard: 'text-rose-700 bg-rose-50 border-rose-200',
  medium: 'text-amber-700 bg-amber-50 border-amber-200',
  easy: 'text-emerald-700 bg-emerald-50 border-emerald-200',
};

const RankMedal = ({ rank }) => {
  if (rank === 1) return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-white font-black text-sm shadow">
      1
    </span>
  );
  if (rank === 2) return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-400 text-white font-black text-sm">
      2
    </span>
  );
  if (rank === 3) return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-black text-sm">
      3
    </span>
  );
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200">
      {rank}
    </span>
  );
};

export const AssessmentLeaderboard = () => {
  const { id } = useParams();  // assessment ID
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortBy, setSortBy] = useState('rank'); // rank | percentage | accuracy | tabSwitchCount

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/recruiters/assessments/${id}/leaderboard`, {
        params: { search },
      });
      setAssessment(res.data.assessment);
      setCandidates(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assessment leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [id]);

  // Client-side search filter + sort
  const filtered = candidates
    .filter((c) => {
      const q = search.toLowerCase();
      return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'percentage') return b.percentage - a.percentage;
      if (sortBy === 'accuracy') return b.accuracy - a.accuracy;
      if (sortBy === 'tabSwitchCount') return a.tabSwitchCount - b.tabSwitchCount;
      return a.rank - b.rank; // default rank
    });

  const passingScore = assessment?.passingScore || 60;
  const passCount = candidates.filter((c) => c.percentage >= passingScore).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-zelis-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-600 font-medium">Loading assessment leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center max-w-sm">
          <p className="text-rose-600 font-semibold mb-4">{error}</p>
          <button
            onClick={() => navigate('/recruiter/leaderboard')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-zelis-600 text-white hover:bg-zelis-700 transition-colors cursor-pointer"
          >
            Back to Leaderboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Back Navigation */}
        <button
          onClick={() => navigate('/recruiter/leaderboard')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-zelis-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Global Leaderboard
        </button>

        {/* Page Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zelis-50 text-zelis-700 border border-zelis-200 mb-2">
                <Trophy className="w-3.5 h-3.5" />
                Per-Assessment Leaderboard
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {assessment?.title || 'Assessment Ranking'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Ranked candidates by score • Passing cutoff: <strong className="text-slate-700">{passingScore}%</strong>
                {assessment?.topics?.length > 0 && (
                  <> • Topics: <span className="font-medium text-slate-700">{assessment.topics.join(', ')}</span></>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-center px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-2xl font-extrabold text-slate-900">{candidates.length}</p>
                <p className="text-[10px] text-slate-500 uppercase font-semibold mt-0.5">Attempted</p>
              </div>
              <div className="text-center px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-2xl font-extrabold text-emerald-700">{passCount}</p>
                <p className="text-[10px] text-emerald-600 uppercase font-semibold mt-0.5">Passed</p>
              </div>
              <div className="text-center px-5 py-3 bg-rose-50 border border-rose-200 rounded-xl">
                <p className="text-2xl font-extrabold text-rose-700">{candidates.length - passCount}</p>
                <p className="text-[10px] text-rose-600 uppercase font-semibold mt-0.5">Below Cutoff</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Sort Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sort by:</span>
            {[
              { key: 'rank', label: 'Rank' },
              { key: 'percentage', label: 'Score %' },
              { key: 'accuracy', label: 'Accuracy' },
              { key: 'tabSwitchCount', label: 'Integrity' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  sortBy === opt.key
                    ? 'bg-zelis-600 text-white border-zelis-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-zelis-400 hover:text-zelis-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Candidates Table */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">No candidates found</p>
            <p className="text-xs text-slate-400 mt-1">
              No completed submissions for this assessment yet, or no candidates match your search.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="py-3.5 px-4 w-12 text-center">Rank</th>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Score</th>
                    <th className="py-3.5 px-4">Accuracy</th>
                    <th className="py-3.5 px-4">Highest Level</th>
                    <th className="py-3.5 px-4">Coding</th>
                    <th className="py-3.5 px-4">Integrity</th>
                    <th className="py-3.5 px-4">Links</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((c, idx) => {
                    const passed = c.percentage >= passingScore;
                    const isExpanded = expandedRow === idx;
                    return (
                      <React.Fragment key={c.attemptId || idx}>
                        <tr
                          className={`hover:bg-slate-50 transition-colors ${isExpanded ? 'bg-slate-50' : ''}`}
                        >
                          {/* Rank */}
                          <td className="py-3.5 px-4 text-center">
                            <RankMedal rank={c.rank} />
                          </td>

                          {/* Candidate Info */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{c.name}</div>
                            <div className="text-[11px] text-slate-500">{c.email}</div>
                            {c.headline && (
                              <div className="text-[10px] text-slate-400 mt-0.5 max-w-[180px] truncate">{c.headline}</div>
                            )}
                          </td>

                          {/* Score */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className={`font-black text-base font-mono ${passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                                {c.percentage}%
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}
                              >
                                {passed ? 'PASS' : 'FAIL'}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {c.totalScore}/{c.maxPossibleScore} pts
                            </div>
                          </td>

                          {/* Accuracy */}
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-sm text-slate-800">{c.accuracy}%</span>
                          </td>

                          {/* Highest Difficulty */}
                          <td className="py-3.5 px-4">
                            <DifficultyBadge difficulty={c.highestDifficulty} />
                          </td>

                          {/* Coding Problems */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                              <span className="font-mono text-slate-700">{c.codingProblemsCompleted} solved</span>
                            </div>
                          </td>

                          {/* Integrity (tab switches) */}
                          <td className="py-3.5 px-4">
                            {c.tabSwitchCount === 0 ? (
                              <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                                <ShieldCheck className="w-3.5 h-3.5" /> Clean
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-amber-700 font-semibold text-[11px]">
                                <ShieldAlert className="w-3.5 h-3.5" /> {c.tabSwitchCount} flags
                              </span>
                            )}
                          </td>

                          {/* Social Links */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              {c.githubUrl ? (
                                <a
                                  href={c.githubUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="GitHub Profile"
                                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-900 text-white hover:bg-slate-700 transition-colors"
                                >
                                  <Github className="w-3.5 h-3.5" />
                                </a>
                              ) : (
                                <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 text-slate-300 border border-slate-200">
                                  <Github className="w-3.5 h-3.5" />
                                </span>
                              )}
                              {c.linkedinUrl ? (
                                <a
                                  href={c.linkedinUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="LinkedIn Profile"
                                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                  <Linkedin className="w-3.5 h-3.5" />
                                </a>
                              ) : (
                                <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 text-slate-300 border border-slate-200">
                                  <Linkedin className="w-3.5 h-3.5" />
                                </span>
                              )}
                              {c.portfolioUrl ? (
                                <a
                                  href={c.portfolioUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Portfolio"
                                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                </a>
                              ) : (
                                <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 text-slate-300 border border-slate-200">
                                  <Globe className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Pass / Fail status */}
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${passed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                              {passed ? 'Above Cutoff' : 'Below Cutoff'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setExpandedRow(isExpanded ? null : idx)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                                title="Expand details"
                              >
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                              {c.candidateId && (
                                <Link
                                  to={`/recruiter/candidates/${c.candidateId}`}
                                  className="px-3 py-1.5 rounded-lg bg-zelis-600 hover:bg-zelis-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                                >
                                  Profile <ArrowRight className="w-3 h-3" />
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Row: Education, Skills, Topic Breakdown */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={10} className="px-4 pb-5 pt-1 bg-slate-50/80 border-b border-slate-100">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                                {/* Education & Background */}
                                <div className="bg-white border border-slate-200 rounded-xl p-4">
                                  <p className="text-[10px] uppercase font-semibold text-slate-400 mb-2.5">Education & Background</p>
                                  <div className="space-y-2 text-xs">
                                    {c.college && (
                                      <div className="flex items-start gap-2">
                                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                                        <div>
                                          <span className="font-semibold text-slate-800 block">{c.college}</span>
                                          {c.degree && <span className="text-slate-500">{c.degree}</span>}
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                      <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                      <span className="text-slate-600">{c.yearsOfExperience} yrs experience</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                      <span className="text-slate-500">
                                        Submitted: {c.submittedAt ? new Date(c.submittedAt).toLocaleString() : 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Skills */}
                                <div className="bg-white border border-slate-200 rounded-xl p-4">
                                  <p className="text-[10px] uppercase font-semibold text-slate-400 mb-2.5">Technical Skills</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {c.skills?.length > 0 ? (
                                      c.skills.slice(0, 10).map((skill, si) => (
                                        <span
                                          key={si}
                                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200"
                                        >
                                          {skill}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-slate-400 text-xs">No skills listed</span>
                                    )}
                                  </div>
                                </div>

                                {/* Topic-wise Accuracy */}
                                <div className="bg-white border border-slate-200 rounded-xl p-4">
                                  <p className="text-[10px] uppercase font-semibold text-slate-400 mb-2.5">Topic Accuracy</p>
                                  <div className="space-y-2">
                                    {c.skillAnalysis?.length > 0 ? (
                                      c.skillAnalysis.slice(0, 5).map((s, si) => (
                                        <div key={si} className="flex items-center gap-2 text-xs">
                                          <span className="text-slate-600 w-20 truncate shrink-0">{s.topic}</span>
                                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div
                                              className={`h-full rounded-full ${
                                                s.accuracy >= 70 ? 'bg-emerald-500' : s.accuracy >= 40 ? 'bg-amber-400' : 'bg-rose-500'
                                              }`}
                                              style={{ width: `${s.accuracy}%` }}
                                            />
                                          </div>
                                          <span className="font-mono text-slate-700 font-semibold w-8 text-right">{s.accuracy}%</span>
                                        </div>
                                      ))
                                    ) : (
                                      <span className="text-slate-400 text-xs">No breakdown available</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer info */}
        <p className="text-xs text-slate-400 text-center pb-4">
          Showing {filtered.length} of {candidates.length} candidates •
          {' '}{passCount} passed ({candidates.length > 0 ? Math.round((passCount / candidates.length) * 100) : 0}% pass rate)
        </p>
      </div>
    </div>
  );
};

export default AssessmentLeaderboard;
