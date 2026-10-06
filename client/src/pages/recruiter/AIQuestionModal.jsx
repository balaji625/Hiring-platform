import React, { useState } from 'react';
import api from '../../api/axios';
import { Modal } from '../../components/common/Modal';
import { Sparkles, CheckCircle, BrainCircuit, Plus, Loader2 } from 'lucide-react';
import { DifficultyBadge } from '../../components/common/Badge';

export const AIQuestionModal = ({ isOpen, onClose, onQuestionsGenerated }) => {
  const [topic, setTopic] = useState('DSA');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPreviewQuestions([]);

    try {
      const res = await api.post('/questions/ai-generate', {
        topic,
        difficulty,
        count,
        autoSave: false,
      });

      setPreviewQuestions(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate questions with AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToBank = async () => {
    if (previewQuestions.length === 0) return;
    setSaving(true);
    setError('');

    try {
      // Save all generated questions to the question bank
      for (const q of previewQuestions) {
        await api.post('/questions', q);
      }

      if (onQuestionsGenerated) onQuestionsGenerated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save generated questions.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Question Generator" maxWidth="max-w-3xl">
      <div className="space-y-6">
        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            Powered by the modular AI Service. Generates high-signal multiple-choice questions dynamically with verified keys and technical explanations.
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Generator Controls */}
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-zelis-500"
            >
              <option value="DSA">DSA</option>
              <option value="SQL">SQL</option>
              <option value="OOP">OOP</option>
              <option value="DBMS">DBMS</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-zelis-500"
            >
              <option value="easy">Easy (1 mark)</option>
              <option value="medium">Medium (2 marks)</option>
              <option value="hard">Hard (3 marks)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Count</label>
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-zelis-500"
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-1.5 px-3 rounded-lg font-semibold text-xs bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preview of Generated Questions */}
        {previewQuestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Review Generated Questions ({previewQuestions.length})
              </span>
              <button
                type="button"
                onClick={handleSaveToBank}
                disabled={saving}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save All to Question Bank</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {previewQuestions.map((q, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Q{idx + 1}. {q.questionText}</span>
                    <DifficultyBadge difficulty={q.difficulty} />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-slate-300">
                    {q.options?.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-1.5 rounded border text-[11px] ${
                          opt.id === q.correctAnswer
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-semibold'
                            : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        {opt.id}. {opt.text}
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-400 italic">Explanation: {q.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
