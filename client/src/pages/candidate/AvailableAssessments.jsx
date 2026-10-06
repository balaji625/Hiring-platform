import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  FileQuestion,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  BookOpen,
  CheckCircle,
} from 'lucide-react';

export const AvailableAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await api.get('/assessments');
        setAssessments(res.data.data || []);
      } catch (err) {
        setError('Failed to fetch available assessments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-zelis-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zelis-50 text-zelis-700 border border-zelis-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Adaptive Benchmarks
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Available Technical Assessments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose an assessment to begin. Each test begins at standard difficulty and dynamically adjusts question selection as you proceed.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((test) => (
            <div
              key={test._id}
              className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between hover:border-zelis-300 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zelis-50 text-zelis-700 border border-zelis-200">
                    Adaptive Engine
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{test.duration || test.timeLimitMinutes || 60} min</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-zelis-600 transition-colors">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {test.description || 'Comprehensive technical assessment evaluating problem solving, algorithms, and technical fundamentals.'}
                </p>

                {/* Topics Tags */}
                <div className="mt-4">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-1.5">
                    Evaluated Topics
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(test.topics || ['DSA', 'SQL', 'OOP', 'DBMS']).map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 border border-slate-200 text-slate-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-800">{test.questionCount || test.totalQuestions || 15}</span> Questions
                </div>

                <Link
                  to={`/candidate/assessment/${test._id}/instructions`}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-zelis-600 hover:bg-zelis-700 text-white flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <span>Start Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableAssessments;
