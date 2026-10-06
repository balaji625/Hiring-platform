import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BrainCircuit,
  LayoutDashboard,
  FileQuestion,
  Users,
  Trophy,
  GitPullRequest,
  PlusCircle,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isCandidate, isRecruiter, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuickSwitch = async (roleEmail) => {
    setSwitching(true);
    setShowRoleMenu(false);
    try {
      await login(roleEmail, 'Password123!');
      if (roleEmail === 'candidate@example.com') {
        navigate('/candidate/dashboard');
      } else {
        navigate('/recruiter/dashboard');
      }
    } catch (err) {
      console.error('Quick switch failed:', err);
    } finally {
      setSwitching(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  ZELIS <span className="text-blue-700 font-semibold text-[11px] tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200">HIRING</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase -mt-0.5">
                  Adaptive Recruitment Ecosystem
                </span>
              </div>
            </Link>

            {/* Navigation Links for Authenticated Users */}
            {user && (
              <div className="hidden md:flex items-center gap-1">
                {isCandidate ? (
                  <>
                    <Link
                      to="/candidate/dashboard"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/candidate/dashboard')
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/candidate/assessments"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/candidate/assessments')
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <FileQuestion className="w-4 h-4" />
                      Assessments
                    </Link>
                    <Link
                      to="/candidate/applications"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/candidate/applications')
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <GitPullRequest className="w-4 h-4" />
                      Status
                    </Link>
                    <Link
                      to="/candidate/profile"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/candidate/profile')
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/recruiter/dashboard"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/recruiter/dashboard')
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Analytics
                    </Link>
                    <Link
                      to="/recruiter/leaderboard"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/recruiter/leaderboard')
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Trophy className="w-4 h-4" />
                      Candidates
                    </Link>
                    <Link
                      to="/recruiter/pipeline"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/recruiter/pipeline')
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <GitPullRequest className="w-4 h-4" />
                      Pipeline (Kanban)
                    </Link>
                    <Link
                      to="/recruiter/questions"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/recruiter/questions')
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      Question Bank
                    </Link>
                    <Link
                      to="/recruiter/create-assessment"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                        isActive('/recruiter/create-assessment')
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      <PlusCircle className="w-4 h-4" />
                      Builder
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Demo Quick Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-300"
                title="Switch demo persona instantly"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Demo Persona:</span>
                <span className="font-bold text-slate-900 uppercase">
                  {user ? user.role : 'Guest'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 text-xs">
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Instant Demo Login
                  </div>
                  <button
                    onClick={() => handleQuickSwitch('candidate@example.com')}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Alex Rivera</div>
                      <div className="text-[11px] text-slate-500">Candidate (MERN / Full Stack)</div>
                    </div>
                    {user?.email === 'candidate@example.com' && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleQuickSwitch('recruiter@example.com')}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Sarah Jenkins</div>
                      <div className="text-[11px] text-slate-500">Technical Recruiter</div>
                    </div>
                    {user?.email === 'recruiter@example.com' && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleQuickSwitch('admin@example.com')}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">System Admin</div>
                      <div className="text-[11px] text-slate-500">Talent Ops Admin</div>
                    </div>
                    {user?.email === 'admin@example.com' && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-900 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700 border border-slate-200 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
