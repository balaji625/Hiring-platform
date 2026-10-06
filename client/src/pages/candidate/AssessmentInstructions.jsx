import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  BrainCircuit,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Maximize2,
  Code2,
  ShieldCheck,
  Camera,
} from 'lucide-react';

export const AssessmentInstructions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await api.get(`/assessments/${id}`);
        setAssessment(res.data.data);
      } catch (err) {
        setError('Failed to load assessment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  const handleProceed = () => {
    if (!agree) return;
    navigate(`/candidate/assessment/${id}/system-check`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <p className="text-rose-600 text-sm mb-4">{error || 'Assessment not found.'}</p>
          <Link to="/candidate/assessments" className="text-xs text-blue-600 underline font-semibold">
            Back to Assessments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
            <BrainCircuit className="w-4 h-4" />
            <span>Pre-Assessment Briefing & Guidelines</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {assessment.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {assessment.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Duration</span>
              <p className="font-mono text-sm font-bold text-slate-900 mt-0.5">{assessment.duration} Minutes</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Questions</span>
              <p className="font-mono text-sm font-bold text-slate-900 mt-0.5">{assessment.questionCount} Total</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Environment</span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">Fullscreen Secure</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Coding Allowed</span>
              <p className="text-xs font-bold text-blue-600 mt-0.5">Python, JS, Java, C++</p>
            </div>
          </div>
        </div>

        {/* Assessment Structure & Instructions */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Important Candidate Rules</h2>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Maximize2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">Fullscreen Secure Exam Mode</strong>
                The exam will automatically enter fullscreen mode upon launch. Do not switch tabs or exit fullscreen, as these events are logged as suspicious flags.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Camera className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">Camera & Microphone Monitoring</strong>
                Hardware verification is required on the next screen. A small camera preview will remain visible in the corner during testing.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Code2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">Monaco Coding Sandbox</strong>
                For coding questions, use the integrated Monaco code editor. You can test your code using the "Run Code" button against sample cases before final submission.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">Strict Exam Timer</strong>
                The assessment timer runs continuously. If time expires, all submitted and drafted answers are automatically finalized.
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="text-xs text-slate-700 font-medium leading-relaxed">
                I have read and understood the assessment instructions. I consent to webcam and proctoring telemetry monitoring for recruitment evaluation.
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Link
              to="/candidate/assessments"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel & Return
            </Link>

            <button
              onClick={handleProceed}
              disabled={!agree}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <span>Proceed to System Check</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
