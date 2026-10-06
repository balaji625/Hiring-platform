import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { AboutPage } from './pages/public/AboutPage';

// Candidate Pages
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { AvailableAssessments } from './pages/candidate/AvailableAssessments';
import { AssessmentInstructions } from './pages/candidate/AssessmentInstructions';
import { SystemCheck } from './pages/candidate/SystemCheck';
import { AssessmentScreen } from './pages/candidate/AssessmentScreen';
import { AssessmentResult } from './pages/candidate/AssessmentResult';
import { CandidateProfile } from './pages/candidate/CandidateProfile';
import { ApplicationStatus } from './pages/candidate/ApplicationStatus';

// Recruiter Pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { CandidateLeaderboard } from './pages/recruiter/CandidateLeaderboard';
import { CandidateDetails } from './pages/recruiter/CandidateDetails';
import { RecruitmentPipeline } from './pages/recruiter/RecruitmentPipeline';
import { QuestionBank } from './pages/recruiter/QuestionBank';
import { CreateAssessment } from './pages/recruiter/CreateAssessment';
import { AssessmentLeaderboard } from './pages/recruiter/AssessmentLeaderboard';

// Helper component to conditionally render Navbar & Footer (hide on distraction-free assessment screen)
const Layout = ({ children }) => {
  const location = useLocation();
  const isAssessmentScreen =
    location.pathname.startsWith('/candidate/assessment/') &&
    !location.pathname.endsWith('/instructions') &&
    !location.pathname.endsWith('/system-check');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      {!isAssessmentScreen && <Navbar />}
      <div className="flex-1">{children}</div>
      {!isAssessmentScreen && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Candidate Protected Routes */}
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/assessments"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <AvailableAssessments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/assessment/:id/instructions"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <AssessmentInstructions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/assessment/:id/system-check"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <SystemCheck />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/assessment/:id"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <AssessmentScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/result/:id"
              element={
                <ProtectedRoute allowedRoles={['candidate', 'recruiter', 'admin']}>
                  <AssessmentResult />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/profile"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CandidateProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/applications"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <ApplicationStatus />
                </ProtectedRoute>
              }
            />

            {/* Recruiter / Admin Protected Routes */}
            <Route
              path="/recruiter/dashboard"
              element={
                <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/leaderboard"
              element={
                <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                  <CandidateLeaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/candidates/:id"
              element={
                <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                  <CandidateDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/pipeline"
              element={
                <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                  <RecruitmentPipeline />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/questions"
              element={
                <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                  <QuestionBank />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/create-assessment"
              element={
                <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                  <CreateAssessment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/assessment/:id/leaderboard"
              element={
                <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                  <AssessmentLeaderboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
