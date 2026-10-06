import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  FileQuestion,
  Search,
  Filter,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { DifficultyBadge } from '../../components/common/Badge';
import { AIQuestionModal } from './AIQuestionModal';
import { Modal } from '../../components/common/Modal';

export const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New question form state
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    topic: 'DSA',
    difficulty: 'medium',
    options: [
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' },
    ],
    correctAnswer: 'A',
    explanation: '',
  });

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 15,
        search,
        topic,
        difficulty,
      };
      const res = await api.get('/questions', { params });
      setQuestions(res.data.data || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page, topic, difficulty]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      console.error('Failed to delete question:', err);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      await api.post('/questions', newQuestion);
      setAddModalOpen(false);
      setNewQuestion({
        questionText: '',
        topic: 'DSA',
        difficulty: 'medium',
        options: [
          { id: 'A', text: '' },
          { id: 'B', text: '' },
          { id: 'C', text: '' },
          { id: 'D', text: '' },
        ],
        correctAnswer: 'A',
        explanation: '',
      });
      fetchQuestions();
    } catch (err) {
      console.error('Failed to create question:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zelis-50 text-zelis-700 border border-zelis-200 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              Assessment Repository
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Technical Question Bank
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Curated repository of {total} adaptive assessment questions across DSA, SQL, OOP, and DBMS.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setAiModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate with AI</span>
            </button>

            <button
              onClick={() => setAddModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-zelis-600 hover:bg-zelis-700 text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search question text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-zelis-500"
            />
          </form>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-zelis-500 cursor-pointer"
            >
              <option value="all">All Topics</option>
              <option value="DSA">DSA</option>
              <option value="SQL">SQL</option>
              <option value="OOP">OOP</option>
              <option value="DBMS">DBMS</option>
            </select>

            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-zelis-500 cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy (1 mark)</option>
              <option value="medium">Medium (2 marks)</option>
              <option value="hard">Hard (3 marks)</option>
            </select>
          </div>
        </div>

        {/* Question Bank Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-3.5 px-4 w-12">#</th>
                  <th className="py-3.5 px-4">Question Text</th>
                  <th className="py-3.5 px-4">Topic</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Correct Key</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questions.map((q, idx) => (
                  <tr key={q._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {(page - 1) * 15 + idx + 1}
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <div className="font-medium text-slate-900 line-clamp-2 leading-relaxed">
                        {q.questionText}
                      </div>
                      {q.explanation && (
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 italic">
                          Expl: {q.explanation}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[11px]">
                        {q.topic}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <DifficultyBadge difficulty={q.difficulty} />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      Option {q.correctAnswer}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50">
            <span>
              Showing {questions.length} of {total} total questions
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-800 font-semibold">
                Page {page} of {pages || 1}
              </span>
              <button
                disabled={page >= pages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Modal */}
      <AIQuestionModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onQuestionsGenerated={fetchQuestions}
      />

      {/* Manual Add Question Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Question to Bank">
        <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 uppercase font-semibold mb-1">Question Text</label>
            <textarea
              rows={3}
              required
              value={newQuestion.questionText}
              onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-zelis-500"
              placeholder="e.g. What is the time complexity of QuickSort in the average case?"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 uppercase font-semibold mb-1">Topic</label>
              <select
                value={newQuestion.topic}
                onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
              >
                <option value="DSA">DSA</option>
                <option value="SQL">SQL</option>
                <option value="OOP">OOP</option>
                <option value="DBMS">DBMS</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 uppercase font-semibold mb-1">Difficulty</label>
              <select
                value={newQuestion.difficulty}
                onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
              >
                <option value="easy">Easy (1 mark)</option>
                <option value="medium">Medium (2 marks)</option>
                <option value="hard">Hard (3 marks)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-slate-600 uppercase font-semibold">Options (A, B, C, D)</label>
            {newQuestion.options.map((opt, i) => (
              <div key={opt.id} className="flex items-center gap-2">
                <span className="w-6 font-mono font-bold text-center text-zelis-700">{opt.id}</span>
                <input
                  type="text"
                  required
                  value={opt.text}
                  onChange={(e) => {
                    const opts = [...newQuestion.options];
                    opts[i].text = e.target.value;
                    setNewQuestion({ ...newQuestion, options: opts });
                  }}
                  className="flex-1 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
                  placeholder={`Option ${opt.id} text`}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 uppercase font-semibold mb-1">Correct Answer</label>
              <select
                value={newQuestion.correctAnswer}
                onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono"
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 uppercase font-semibold mb-1">Explanation</label>
              <input
                type="text"
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                placeholder="Brief technical explanation..."
                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-zelis-600 hover:bg-zelis-700 text-white font-semibold"
            >
              Save Question
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default QuestionBank;
