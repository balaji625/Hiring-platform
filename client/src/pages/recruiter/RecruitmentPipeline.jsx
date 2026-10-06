import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  GitPullRequest,
  Users,
  Trophy,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Github,
  Linkedin,
} from 'lucide-react';
import { RecommendationBadge } from '../../components/common/Badge';

export const RecruitmentPipeline = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const STAGES = [
    'Applied',
    'Assessment',
    'Shortlisted',
    'L1 Interview',
    'L2 Interview',
    'Selected',
    'Offer',
  ];

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recruiters/candidates');
      setCandidates(res.data.data || []);
    } catch (err) {
      setError('Failed to fetch pipeline candidates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleMoveStage = async (candidate, targetStage) => {
    if (!candidate.applicationId) return;
    setUpdatingId(candidate.id);

    try {
      await api.patch(`/recruiters/applications/${candidate.applicationId}/status`, {
        status: targetStage,
        note: `Candidate advanced to ${targetStage} via Recruitment Pipeline`,
      });
      fetchCandidates();
    } catch (err) {
      console.error('Failed to move stage:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-zelis-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 mb-2">
              <GitPullRequest className="w-3.5 h-3.5" />
              Applicant Tracking System
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Recruitment Pipeline Kanban
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Drag or click to advance candidates across all stages: Applied → Assessment → Shortlisted → L1 → L2 → Selected → Offer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/recruiter/leaderboard"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
            >
              Candidate Leaderboard
            </Link>
          </div>
        </div>

        {/* Horizontal Kanban Scroll Columns */}
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-4 min-w-[1400px]">
            {STAGES.map((stage) => {
              const inStage = candidates.filter((c) => c.stage === stage);

              return (
                <div
                  key={stage}
                  className="w-72 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col flex-shrink-0 shadow-sm"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      {stage}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-slate-600">
                      {inStage.length}
                    </span>
                  </div>

                  {/* Candidate Cards List */}
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-1">
                    {inStage.map((c) => {
                      const nextStageIdx = STAGES.indexOf(stage) + 1;
                      const nextStage = STAGES[nextStageIdx];

                      return (
                        <div
                          key={c.id}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-zelis-300 hover:shadow-sm transition-all text-xs space-y-2 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link
                                to={`/recruiter/candidates/${c.id}`}
                                className="font-bold text-slate-900 hover:text-zelis-700 transition-colors block line-clamp-1"
                              >
                                {c.name}
                              </Link>
                              <span className="text-[11px] text-slate-500 line-clamp-1">{c.email}</span>
                            </div>

                            <RecommendationBadge rec={c.recommendation} />
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200/60">
                            <span>Score: <strong className="text-zelis-700 font-bold">{c.assessmentScore}%</strong></span>
                            <span>Rank: <strong className="text-slate-800 font-bold">#{c.rank || 1}</strong></span>
                          </div>

                          {/* Next Stage Fast Move Action */}
                          {nextStage && (
                            <button
                              onClick={() => handleMoveStage(c, nextStage)}
                              disabled={updatingId === c.id}
                              className="w-full mt-1 py-1.5 px-2 rounded-lg bg-white hover:bg-zelis-50 border border-slate-200 hover:border-zelis-300 text-[11px] font-semibold text-slate-700 hover:text-zelis-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>Advance to {nextStage}</span>
                              <ChevronRight className="w-3 h-3 text-zelis-600" />
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {inStage.length === 0 && (
                      <div className="py-8 text-center text-[11px] text-slate-400 italic">
                        No candidates in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentPipeline;
