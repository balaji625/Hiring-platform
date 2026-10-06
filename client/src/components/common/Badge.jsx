import React from 'react';

export const DifficultyBadge = ({ difficulty }) => {
  const diff = (difficulty || 'easy').toLowerCase();
  
  if (diff === 'hard') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
        HARD (3 pts)
      </span>
    );
  }
  if (diff === 'medium') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
        MEDIUM (2 pts)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
      EASY (1 pt)
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    Applied: 'bg-slate-100 text-slate-700 border-slate-200',
    Assessment: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
    Shortlisted: 'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
    'L1 Interview': 'bg-sky-50 text-sky-700 border-sky-200 font-semibold',
    'L2 Interview': 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold',
    Selected: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    Offer: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      {status}
    </span>
  );
};

export const RecommendationBadge = ({ rec }) => {
  const styles = {
    'Strong Hire': 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
    Excellent: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    Hire: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
    Strong: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
    Hold: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold',
    Good: 'bg-sky-50 text-sky-700 border-sky-200 font-medium',
    Average: 'bg-amber-50 text-amber-700 border-amber-200',
    Reject: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
    'Under Review': 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold border ${
        styles[rec] || styles['Under Review']
      }`}
    >
      {rec}
    </span>
  );
};
