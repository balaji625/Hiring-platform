import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  GitPullRequest,
  CheckCircle2,
  Clock,
  Sparkles,
  Building2,
  Calendar,
  Award,
  FileCheck2,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/Badge';

export const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/candidates/dashboard');
        setApplications(res.data.data?.applications || []);
      } catch (err) {
        setError('Failed to fetch applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const PIPELINE_STAGES = [
    'Applied',
    'Assessment',
    'Shortlisted',
    'L1 Interview',
    'L2 Interview',
    'Selected',
    'Offer',
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-zelis-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zelis-50 text-zelis-700 border border-zelis-200 mb-2">
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>Recruitment Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Application Pipeline Status</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your recruitment stages from technical assessment to final hiring decisions.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center shadow-sm">
            <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">No active applications currently submitted.</p>
            <p className="text-xs text-slate-400 mt-1">Take an assessment to initiate your candidate application.</p>
          </div>
        ) : (
          applications.map((app) => {
            const currentStageIndex = PIPELINE_STAGES.indexOf(app.status);

            return (
              <div key={app._id} className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-sm">
                {/* Application Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                      {app.company || 'Zelis Healthcare'}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">{app.jobTitle}</h2>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Current Stage: <strong className="text-slate-800">{app.status}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={app.status} />
                  </div>
                </div>

                {/* Pipeline Visual Stepper */}
                <div>
                  <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider block mb-4">
                    Stage Progression Stepper
                  </span>

                  <div className="overflow-x-auto pb-4">
                    <div className="min-w-[650px] flex items-center justify-between relative px-2">
                      {/* Connecting Line */}
                      <div className="absolute top-1/2 left-6 right-6 h-1 bg-slate-200 -translate-y-1/2 -z-0" />

                      {PIPELINE_STAGES.map((stage, idx) => {
                        const isCompleted = idx < currentStageIndex;
                        const isCurrent = idx === currentStageIndex;

                        return (
                          <div key={stage} className="relative z-10 flex flex-col items-center text-center">
                            <div
                              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                                isCompleted
                                  ? 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-sm'
                                  : isCurrent
                                  ? 'bg-zelis-600 border-white text-white font-bold ring-4 ring-zelis-100 shadow-sm'
                                  : 'bg-white border-slate-300 text-slate-400'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              ) : (
                                <span className="text-xs font-mono">{idx + 1}</span>
                              )}
                            </div>

                            <span
                              className={`text-[11px] font-semibold mt-2.5 max-w-[80px] leading-tight ${
                                isCurrent ? 'text-zelis-700 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                              }`}
                            >
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Status History Audit Trail */}
                {app.statusHistory && app.statusHistory.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider block mb-3">
                      Application Updates & Milestones
                    </span>
                    <div className="space-y-2">
                      {app.statusHistory.map((h, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between text-xs">
                          <div>
                            <span className="font-semibold text-slate-900 mr-2">[{h.status}]</span>
                            <span className="text-slate-600">{h.note || 'Application stage updated'}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-4">
                            {new Date(h.changedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ApplicationStatus;
