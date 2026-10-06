import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import {
  BrainCircuit,
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const RegisterPage = () => {
  const [activeTab, setActiveTab] = useState('candidate'); // 'candidate' or 'recruiter'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    title: 'Software Engineer Candidate',
    hrAccessCode: '',
  });

  // HR Access code verification state
  const [hrInputCode, setHrInputCode] = useState('');
  const [isHrCodeVerified, setIsHrCodeVerified] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [codeError, setCodeError] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setCodeError('');
    if (tab === 'candidate') {
      setFormData((prev) => ({
        ...prev,
        role: 'candidate',
        title: 'Software Engineer Candidate',
        hrAccessCode: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        role: 'recruiter',
        title: 'Technical Recruiter',
      }));
    }
  };

  const handleVerifyHrCode = async (e) => {
    e.preventDefault();
    setCodeError('');
    setVerifyingCode(true);

    try {
      const res = await api.post('/auth/verify-hr-code', { accessCode: hrInputCode });
      if (res.data.verified) {
        setIsHrCodeVerified(true);
        setFormData((prev) => ({ ...prev, hrAccessCode: hrInputCode }));
      }
    } catch (err) {
      setCodeError(err.response?.data?.message || 'Invalid HR access code.');
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register(formData);
      if (user.role === 'candidate') {
        navigate('/candidate/dashboard');
      } else {
        navigate('/recruiter/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Zelis Hiring</span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h2>
        <p className="mt-1 text-xs text-slate-500">
          Enterprise Adaptive Assessment & Recruitment Platform
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          {/* Tabs: Candidate vs Recruiter */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleTabChange('candidate')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'candidate'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('recruiter')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'recruiter'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Recruiter / HR Portal
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* If Recruiter tab selected and HR code not yet verified: show Security Gate */}
          {activeTab === 'recruiter' && !isHrCodeVerified ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  Authorized Personnel Access
                </div>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Recruiter accounts require a valid organization HR access code.
                  For development/demo verification, use access code: <code className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-blue-900 font-bold">10101</code>
                </p>
              </div>

              {codeError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{codeError}</span>
                </div>
              )}

              <form onSubmit={handleVerifyHrCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Enter HR Access Code
                  </label>
                  <input
                    type="password"
                    required
                    value={hrInputCode}
                    onChange={(e) => setHrInputCode(e.target.value)}
                    placeholder="Enter security access code"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifyingCode || !hrInputCode}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {verifyingCode ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Registration Form (Candidate or Verified Recruiter) */
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'recruiter' && isHrCodeVerified && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>HR Access Code Verified ✓ (Create Recruiter Account)</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Jordan Lee"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {activeTab === 'recruiter' ? 'Work Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={activeTab === 'recruiter' ? 'jordan.lee@zelis.com' : 'jordan.lee@example.com'}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {activeTab === 'recruiter' ? 'Role / Title' : 'Target Role'}
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {activeTab === 'recruiter' ? 'Create Recruiter Account' : 'Create Candidate Account'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
