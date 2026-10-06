import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  BrainCircuit,
  Trophy,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileQuestion,
  Sparkles,
  GitPullRequest,
  CheckCircle2,
  Github,
  Linkedin,
  Globe,
  FileCheck2,
  ShieldCheck,
  User,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/Badge';

export const CandidateDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/candidates/dashboard');
        setData(res.data.data);
      } catch (err) {
        setError('Failed to load candidate dashboard data.');
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
          <p className="text-xs font-semibold text-slate-500">Loading candidate dashboard...</p>
        </div>
      </div>
    );
  }

  const currentApp = data?.currentApplication;
  const profile = user?.profile || {};
  const hasSocials = profile.githubUrl || profile.linkedinUrl || profile.portfolioUrl;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zelis-50 text-zelis-700 border border-zelis-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Candidate Assessment Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Candidate'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Complete technical assessments and keep your profile, GitHub, and LinkedIn links updated for Zelis recruiters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/candidate/assessments"
              className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-zelis-600 hover:bg-zelis-700 text-white shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FileQuestion className="w-4 h-4" />
              <span>Available Tests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Profile Completion Callout if missing social links */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Recruiter Profile Visibility</div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                <span>{hasSocials ? 'Profile linked with professional social profiles' : 'Add your GitHub & LinkedIn to stand out'}</span>
              </div>
            </div>
          </div>

          <Link
            to="/candidate/profile"
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Github className="w-3.5 h-3.5 text-slate-800" />
            <Linkedin className="w-3.5 h-3.5 text-blue-600" />
            <span>Update Profile & Links</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Current Recruitment Pipeline Status Banner */}
        {currentApp && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase font-semibold">Active Application Stage</div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>{currentApp.jobTitle}</span>
                  <StatusBadge status={currentApp.status} />
                </div>
              </div>
            </div>

            <Link
              to="/candidate/applications"
              className="text-xs font-semibold text-zelis-600 hover:text-zelis-700 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Track Pipeline Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Key KPI Metric Cards (Respecting Score Secrecy) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Submissions</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{data?.recentAttempts?.length || 0}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Assessments completed</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Application</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900">{currentApp?.status || 'Active'}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Current hiring pipeline stage</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Proctoring</span>
            <div className="mt-2 flex items-baseline gap-1.5 text-emerald-600 font-bold text-base">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">AI integrity sessions compliant</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Evaluation</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-base font-bold text-slate-800">Under Review</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Recruiter panel evaluation</p>
          </div>
        </div>

        {/* In-Progress Assessment Alert Banner if any */}
        {data?.inProgressAttempt && (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Assessment In Progress</h3>
                <p className="text-xs text-amber-800">
                  {data.inProgressAttempt.assessment?.title} (Question{' '}
                  {(data.inProgressAttempt.questionsAttemptedCount || 0) + 1} of{' '}
                  {data.inProgressAttempt.totalQuestions})
                </p>
              </div>
            </div>

            <Link
              to={`/candidate/assessment/${data.inProgressAttempt.assessment?._id}`}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-colors"
            >
              Resume Active Test
            </Link>
          </div>
        )}

        {/* Recent Assessment Submissions (Score Secrecy Preserved) */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Completed Assessments</h2>
              <p className="text-xs text-slate-500 mt-0.5">Your official submissions logged with Zelis Recruitment</p>
            </div>
            <Link to="/candidate/assessments" className="text-xs font-semibold text-zelis-600 hover:text-zelis-700">
              Browse All Assessments
            </Link>
          </div>

          {data?.recentAttempts && data.recentAttempts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Assessment</th>
                    <th className="py-3 px-4">Submitted Date</th>
                    <th className="py-3 px-4">Evaluation Status</th>
                    <th className="py-3 px-4">Proctoring Telemetry</th>
                    <th className="py-3 px-4 text-right">Confirmation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recentAttempts.map((att) => (
                    <tr key={att._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {att.assessment?.title || 'Technical Assessment'}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(att.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Submitted & Logged
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Clean
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/candidate/result/${att._id}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold transition-colors"
                        >
                          View Receipt
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No completed assessments yet. Start your first assessment to begin your evaluation!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
