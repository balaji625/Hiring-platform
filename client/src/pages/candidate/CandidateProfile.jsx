import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Briefcase,
  MapPin,
  Phone,
  FileText,
  Save,
  CheckCircle,
  AlertCircle,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';

export const CandidateProfile = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    headline: '',
    bio: '',
    phone: '',
    location: '',
    resumeUrl: '',
    resumeText: '',
    skills: '',
    yearsOfExperience: 2,
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    college: '',
    degree: '',
    graduationYear: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        const p = res.data.user.profile || {};
        setProfile({
          headline: p.headline || 'Full Stack & Backend Engineer',
          bio: p.bio || '',
          phone: p.phone || '',
          location: p.location || 'Remote / Hybrid',
          resumeUrl: p.resumeUrl || '',
          resumeText: p.resumeText || '',
          skills: Array.isArray(p.skills) ? p.skills.join(', ') : '',
          yearsOfExperience: p.yearsOfExperience || 2,
          githubUrl: p.githubUrl || '',
          linkedinUrl: p.linkedinUrl || '',
          portfolioUrl: p.portfolioUrl || '',
          college: p.college || '',
          degree: p.degree || '',
          graduationYear: p.graduationYear || '',
        });
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const payload = {
        ...profile,
        skills: profile.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        graduationYear: profile.graduationYear ? Number(profile.graduationYear) : undefined,
      };
      await updateProfile(payload);
      setSuccess('Profile updated successfully! Recruiters can now review your updated profile.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-zelis-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Candidate Profile & Credentials</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep your credentials, GitHub, LinkedIn, portfolio, and resume up to date for Zelis recruiters.
          </p>
        </div>

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                disabled
                value={user?.name || ''}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Professional Headline
              </label>
              <input
                type="text"
                name="headline"
                value={profile.headline}
                onChange={handleChange}
                placeholder="e.g. Full Stack Engineer | React, Node.js & Distributed Systems"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                placeholder="Boston, MA (or Remote)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100"
              />
            </div>

            {/* Social & Professional Links */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-zelis-600" />
                <span>Professional Links & Profiles (Visible to Recruiters)</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-slate-800" />
                <span>GitHub Profile URL</span>
              </label>
              <input
                type="url"
                name="githubUrl"
                value={profile.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/yourusername"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                <span>LinkedIn Profile URL</span>
              </label>
              <input
                type="url"
                name="linkedinUrl"
                value={profile.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourusername"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>Portfolio Website URL</span>
              </label>
              <input
                type="url"
                name="portfolioUrl"
                value={profile.portfolioUrl}
                onChange={handleChange}
                placeholder="https://yourportfolio.dev"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Resume Document Link (PDF / Cloud Storage URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  name="resumeUrl"
                  value={profile.resumeUrl}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/... or https://domain.com/resume.pdf"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100"
                />
                {profile.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200"
                    title="Open link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Education Details */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Education & Academic Background</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                College / University
              </label>
              <input
                type="text"
                name="college"
                value={profile.college}
                onChange={handleChange}
                placeholder="e.g. Northeastern University"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100"
              />
            </div>

            <div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Degree
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={profile.degree}
                    onChange={handleChange}
                    placeholder="B.S. in Computer Science"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    name="graduationYear"
                    value={profile.graduationYear}
                    onChange={handleChange}
                    placeholder="2025"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Technical Skills (Comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                placeholder="DSA, SQL, OOP, DBMS, React, Node.js, TypeScript, Python"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Professional Bio & Summary
              </label>
              <textarea
                rows={3}
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                placeholder="Brief summary of your software engineering achievements..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-zelis-500 focus:ring-2 focus:ring-zelis-100"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl font-semibold text-xs bg-zelis-600 hover:bg-zelis-700 text-white flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateProfile;
