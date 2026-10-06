import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { PlusCircle, CheckCircle, ArrowRight, BrainCircuit, Sparkles, Clock, Percent, FileQuestion } from 'lucide-react';

export const CreateAssessment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 45,
    questionCount: 15,
    passingScore: 65,
    topics: ['DSA', 'SQL', 'OOP', 'DBMS'],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const allTopics = ['DSA', 'SQL', 'OOP', 'DBMS'];

  const toggleTopic = (topic) => {
    if (formData.topics.includes(topic)) {
      if (formData.topics.length === 1) return; // Keep at least one
      setFormData({ ...formData, topics: formData.topics.filter((t) => t !== topic) });
    } else {
      setFormData({ ...formData, topics: [...formData.topics, topic] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/assessments', formData);
      const newAssessment = res.data.data;
      if (newAssessment?._id) {
        navigate(`/recruiter/assessment/${newAssessment._id}/leaderboard`);
      } else {
        navigate('/recruiter/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assessment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zelis-50 text-zelis-700 border border-zelis-200 mb-2">
            <PlusCircle className="w-3.5 h-3.5" />
            Recruiter Assessment Configurator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Create New Assessment</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure an adaptive technical assessment benchmark with customized topics, question pools, and passing score cutoffs.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-sm">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Assessment Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Senior Backend Engineering Benchmark (Q4)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Description & Objectives
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the evaluation focus and role requirements..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Time Limit (Minutes)
              </label>
              <input
                type="number"
                min={15}
                max={180}
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Question Count
              </label>
              <input
                type="number"
                min={5}
                max={50}
                value={formData.questionCount}
                onChange={(e) => setFormData({ ...formData, questionCount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Passing Cutoff (%)
              </label>
              <input
                type="number"
                min={40}
                max={95}
                value={formData.passingScore}
                onChange={(e) => setFormData({ ...formData, passingScore: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Evaluated Technical Topics
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {allTopics.map((topic) => {
                const isSelected = formData.topics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zelis-50 border-zelis-500 text-zelis-800'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span>{topic}</span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-zelis-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <BrainCircuit className="w-5 h-5 text-zelis-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-800">Adaptive Dynamic Engine Active:</strong> Questions will automatically be served starting at standard tier and adjusting dynamically based on candidate performance.
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Link
              to="/recruiter/dashboard"
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-semibold text-xs bg-zelis-600 hover:bg-zelis-700 text-white flex items-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Assessment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssessment;
