import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  Trophy,
  Sliders,
  Search,
  ArrowRight,
  ExternalLink,
  Award,
  BarChart3,
  ChevronRight,
  ListFilter,
  Users,
} from 'lucide-react';
import { DifficultyBadge, StatusBadge, RecommendationBadge } from '../../components/common/Badge';

export const CandidateLeaderboard = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Configurable Weighted Scoring Sliders
  const [wAssessment, setWAssessment] = useState(50);
  const [wProblemSolving, setWProblemSolving] = useState(20);
  const [wTechSkills, setWTechSkills] = useState(20);
  const [wAccuracy, setWAccuracy] = useState(10);

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const params = {
        wAssessment,
        wProblemSolving,
        wTechSkills,
        wAccuracy,
        search,
        stage: stageFilter,
      };
      const res = await api.get('/recruiters/candidates', { params });
      setCandidates(res.data.data);
    } catch (err) {
      setError('Failed to fetch candidate leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessments = async () => {
    try {
      const res = await api.get('/assessments');
      setAssessments(res.data.data || []);
    } catch (err) {
      // non-critical
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchLeaderboard();
    }, 200);
    return () => clearTimeout(debounceTimer);
  }, [wAssessment, wProblemSolving, wTechSkills, wAccuracy, search, stageFilter]);

  const resetWeights = () => {
    setWAssessment(50);
    setWProblemSolving(20);
    setWTechSkills(20);
    setWAccuracy(10);
  };

  const totalWeight = wAssessment + wProblemSolving + wTechSkills + wAccuracy;

  const handleViewAssessmentLeaderboard = () => {
    if (selectedAssessmentId) {
      navigate(`/recruiter/assessment/${selectedAssessmentId}/leaderboard`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Title & Explainer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zelis-50 text-zelis-700 border border-zelis-200 mb-2">
              <Trophy className="w-3.5 h-3.5" />
              Dynamic Candidate Ranking
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Candidate Leaderboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Multi-factor weighted scoring across all candidates. Use the assessment picker below to view per-assessment rankings.
            </p>
          </div>
        </div>

        {/* Per-Assessment Leaderboard Picker */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-zelis-600" />
            <h2 className="text-sm font-bold text-slate-900">Per-Assessment Leaderboard</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            View a detailed ranked list of all candidates who completed a specific assessment — including their GitHub, LinkedIn, portfolio links, education, and topic accuracy.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={selectedAssessmentId}
              onChange={(e) => setSelectedAssessmentId(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100 cursor-pointer"
            >
              <option value="">— Select an Assessment —</option>
              {assessments.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.title}
                </option>
              ))}
            </select>
            <button
              onClick={handleViewAssessmentLeaderboard}
              disabled={!selectedAssessmentId}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-zelis-600 hover:bg-zelis-700 text-white flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <Trophy className="w-4 h-4" />
              View Assessment Leaderboard
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick links to each assessment leaderboard */}
          {assessments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
              {assessments.slice(0, 6).map((a) => (
                <Link
                  key={a._id}
                  to={`/recruiter/assessment/${a._id}/leaderboard`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-zelis-50 hover:text-zelis-700 hover:border-zelis-300 text-slate-700 border border-slate-200 transition-colors"
                >
                  {a.title}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Configurable Weighted Scoring Sliders Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-zelis-600" />
              <span>Configurable Weighted Scoring Formula</span>
            </h2>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-semibold ${totalWeight === 100 ? 'text-emerald-700' : 'text-amber-700'}`}>
                Total Weight: {totalWeight}% {totalWeight !== 100 && '⚠ Should equal 100%'}
              </span>
              <button
                onClick={resetWeights}
                className="text-xs text-slate-500 hover:text-zelis-700 font-semibold underline cursor-pointer"
              >
                Reset (50/20/20/10)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-700 font-medium">Assessment Score</span>
                <span className="font-mono font-bold text-zelis-700">{wAssessment}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={wAssessment}
                onChange={(e) => setWAssessment(parseInt(e.target.value))}
                className="w-full accent-zelis-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-700 font-medium">Problem Solving</span>
                <span className="font-mono font-bold text-purple-700">{wProblemSolving}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={wProblemSolving}
                onChange={(e) => setWProblemSolving(parseInt(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-700 font-medium">Technical Skills (DSA/SQL)</span>
                <span className="font-mono font-bold text-cyan-700">{wTechSkills}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={wTechSkills}
                onChange={(e) => setWTechSkills(parseInt(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-700 font-medium">Accuracy Benchmark</span>
                <span className="font-mono font-bold text-emerald-700">{wAccuracy}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={wAccuracy}
                onChange={(e) => setWAccuracy(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ListFilter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-zelis-500 cursor-pointer"
            >
              <option value="all">All Stages</option>
              <option value="Applied">Applied</option>
              <option value="Assessment">Assessment</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="L1 Interview">L1 Interview</option>
              <option value="L2 Interview">L2 Interview</option>
              <option value="Selected">Selected</option>
              <option value="Offer">Offer</option>
            </select>
          </div>
        </div>

        {/* Candidate Leaderboard Table */}
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-8 h-8 border-4 border-zelis-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Loading leaderboard...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">No candidates found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting the stage filter or search term.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="py-3.5 px-4 w-12 text-center">Rank</th>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Composite</th>
                    <th className="py-3.5 px-4">Test Score</th>
                    <th className="py-3.5 px-4">Accuracy</th>
                    <th className="py-3.5 px-4">Highest Diff</th>
                    <th className="py-3.5 px-4">DSA</th>
                    <th className="py-3.5 px-4">SQL</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Recommendation</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      {/* Rank */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold font-mono text-xs ${
                            c.rank === 1
                              ? 'bg-amber-400 text-white shadow-sm'
                              : c.rank === 2
                              ? 'bg-slate-400 text-white'
                              : c.rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {c.rank}
                        </span>
                      </td>

                      {/* Candidate */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-[11px] text-slate-500">{c.email}</div>
                      </td>

                      {/* Weighted Composite Score */}
                      <td className="py-3.5 px-4 font-mono font-black text-base text-zelis-700">
                        {c.compositeScore}%
                      </td>

                      {/* Assessment Raw Score */}
                      <td className="py-3.5 px-4 font-mono text-slate-800">
                        {c.assessmentScore}%
                      </td>

                      {/* Accuracy */}
                      <td className="py-3.5 px-4 font-mono text-emerald-700 font-semibold">
                        {c.accuracy}%
                      </td>

                      {/* Highest Level */}
                      <td className="py-3.5 px-4">
                        <DifficultyBadge difficulty={c.highestDifficulty} />
                      </td>

                      {/* DSA */}
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {c.dsaScore}%
                      </td>

                      {/* SQL */}
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {c.sqlScore}%
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={c.stage} />
                      </td>

                      {/* Recommendation */}
                      <td className="py-3.5 px-4">
                        <RecommendationBadge rec={c.recommendation} />
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/recruiter/candidates/${c.id}`}
                          className="px-3 py-1.5 rounded-lg bg-zelis-600 hover:bg-zelis-700 text-white font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          View Profile
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default CandidateLeaderboard;
