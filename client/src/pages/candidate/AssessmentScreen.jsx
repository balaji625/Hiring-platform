import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  BrainCircuit,
  Maximize2,
  Minimize2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Camera,
  Mic,
  Video,
  VideoOff,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Timer } from '../../components/assessment/Timer';
import { AntiCheatingModal } from '../../components/assessment/AntiCheatingModal';
import { CodeEditorSection } from '../../components/assessment/CodeEditorSection';

export const AssessmentScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attemptId, setAttemptId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(15);
  const [startedAt, setStartedAt] = useState(null);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [assessmentTitle, setAssessmentTitle] = useState('Technical Assessment');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Anti-cheating & Proctoring state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violationModalOpen, setViolationModalOpen] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [violationReason, setViolationReason] = useState('');

  // Live media preview for proctoring
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const attemptIdRef = useRef(null);

  // 1. Initialize Assessment Attempt & Camera Stream
  useEffect(() => {
    const initAssessment = async () => {
      try {
        const res = await api.post(`/attempts/start/${id}`);
        const data = res.data;

        if (data.completed) {
          navigate(`/candidate/result/${data.attempt?._id || data.attemptId}`, { replace: true });
          return;
        }

        setAttemptId(data.attemptId);
        attemptIdRef.current = data.attemptId;
        setQuestionNumber((data.questionsAttemptedCount || 0) + 1);
        setTotalQuestions(data.totalQuestions || 15);
        setQuestion(data.currentQuestion);
        setStartedAt(data.startedAt);
        setDurationMinutes(data.durationMinutes || 45);
        if (data.assessment?.title) setAssessmentTitle(data.assessment.title);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not launch assessment.');
      } finally {
        setLoading(false);
      }
    };

    initAssessment();

    // Acquire webcam stream for continuous proctoring verification
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        mediaStreamRef.current = stream;
        setCameraActive(true);
        setMicActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.warn('Proctoring media feed initialization note:', err.message);
        setCameraActive(false);
        setMicActive(false);
      });

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [id, navigate]);

  // Connect video element when stream or question state updates
  useEffect(() => {
    if (videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
    }
  }, [cameraActive, question]);

  // 2. Anti-Cheating Telemetry Listeners
  useEffect(() => {
    const recordViolation = async (type, details) => {
      if (!attemptIdRef.current) return;
      try {
        const res = await api.post(`/attempts/${attemptIdRef.current}/telemetry`, {
          type,
          details,
        });
        const count = res.data.tabSwitchCount || 1;
        setViolationCount(count);
        setViolationReason(details);
        setViolationModalOpen(true);
      } catch (err) {
        console.warn('Telemetry logging note:', err.message);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('tab-hidden', 'Candidate switched to another browser tab or minimized window.');
      }
    };

    const handleBlur = () => {
      recordViolation('tab-blurred', 'Assessment window lost focus.');
    };

    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      if (!active) {
        recordViolation('fullscreen-exit', 'Candidate exited fullscreen mode.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // 3. Submit MCQ Answer (Silent Adaptation)
  const handleAnswerSubmit = async () => {
    if (!selectedOption || !attemptId || submitting) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await api.post(`/attempts/${attemptId}/answer`, {
        selectedAnswer: selectedOption,
      });

      const {
        completed,
        questionsAttemptedCount,
        nextQuestion,
      } = res.data;

      if (completed) {
        navigate(`/candidate/result/${attemptId}`, { replace: true });
        return;
      }

      // Transition to next question seamlessly without disclosing score or difficulty
      setQuestion(nextQuestion);
      setSelectedOption('');
      setQuestionNumber(questionsAttemptedCount + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer.');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Run Code Sample Tests
  const handleRunCode = async ({ codingQuestionId, language, code }) => {
    const res = await api.post(`/attempts/${attemptId}/run-code`, {
      codingQuestionId,
      language,
      code,
    });
    return res.data;
  };

  // 5. Submit Coding Problem
  const handleSubmitCode = async ({ codingQuestionId, language, code }) => {
    setSubmitting(true);
    try {
      const res = await api.post(`/attempts/${attemptId}/submit-code`, {
        codingQuestionId,
        language,
        code,
      });

      const data = res.data;
      if (data.completed) {
        navigate(`/candidate/result/${attemptId}`, { replace: true });
        return data;
      }

      if (data.nextQuestion) {
        setQuestion(data.nextQuestion);
        setQuestionNumber(data.questionsAttemptedCount + 1);
      }
      return data;
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // 6. Timer Expiration Handler
  const handleTimeExpire = async () => {
    if (!attemptId) return;
    try {
      await api.post(`/attempts/${attemptId}/submit`);
      navigate(`/candidate/result/${attemptId}`, { replace: true });
    } catch (err) {
      navigate('/candidate/dashboard', { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 border-4 border-zelis-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-700">Preparing assessment session...</p>
          <p className="text-xs text-slate-500">Configuring adaptive question delivery and proctoring telemetry.</p>
        </div>
      </div>
    );
  }

  if (error && !question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Unable to Launch Assessment</h2>
          <p className="text-slate-600 text-xs mb-6">{error}</p>
          <button
            onClick={() => navigate('/candidate/dashboard')}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-zelis-600 hover:bg-zelis-700 text-white shadow-sm transition-colors cursor-pointer"
          >
            Return to Candidate Dashboard
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.round(((questionNumber - 1) / totalQuestions) * 100));
  const isCodingQuestion = question?.type === 'coding' || !!question?.starterCode;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between select-none">
      {/* Anti-Cheating Telemetry Alert Modal */}
      <AntiCheatingModal
        isOpen={violationModalOpen}
        onClose={() => setViolationModalOpen(false)}
        violationCount={violationCount}
        reason={violationReason}
      />

      {/* Top Distraction-Free Header */}
      <header className="border-b border-slate-200 bg-white px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zelis-600 flex items-center justify-center shadow-xs">
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm tracking-tight">Zelis Hiring Platform</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium border border-slate-200">
                Secure Mode
              </span>
            </div>
            <span className="text-[11px] text-slate-500">{assessmentTitle}</span>
          </div>
        </div>

        {/* Center: Proctoring Active Badges */}
        <div className="hidden md:flex items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
          <span className="flex items-center gap-1.5 text-slate-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            AI Proctoring Active
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="flex items-center gap-1.5 text-slate-600">
            {cameraActive ? (
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Camera ON
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-700">
                <VideoOff className="w-3.5 h-3.5 text-amber-600" />
                Camera Offline
              </span>
            )}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <Mic className="w-3.5 h-3.5 text-emerald-600" />
            Mic Live
          </span>
        </div>

        {/* Right: Timer & Fullscreen toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          {startedAt && (
            <Timer
              startedAt={startedAt}
              durationMinutes={durationMinutes}
              onTimeExpire={handleTimeExpire}
            />
          )}

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Assessment Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col justify-start">
        {/* Floating Proctoring Camera Box (Bottom Right) */}
        <div className="fixed bottom-14 right-4 z-40 bg-white border border-slate-300 rounded-xl shadow-lg p-1.5 w-36 sm:w-44 overflow-hidden pointer-events-none">
          <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/90 text-slate-300 p-2 text-center text-[10px]">
                <Camera className="w-4 h-4 mb-1 text-slate-400" />
                <span>Monitoring Active</span>
              </div>
            )}
            <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded text-[9px] text-white font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </div>
          </div>
          <div className="mt-1 px-1 flex items-center justify-between text-[10px] text-slate-600 font-medium">
            <span>Integrity Feed</span>
            <span className="text-emerald-600 font-semibold">Verified</span>
          </div>
        </div>

        {/* Dynamic Question Render: Coding vs MCQ */}
        {isCodingQuestion ? (
          <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-sm sm:text-base">
                  Question {questionNumber} of {totalQuestions}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                  {question?.topic || 'Programming'}
                </span>
              </div>
              <span className="text-xs text-slate-500">Coding Assessment</span>
            </div>

            <CodeEditorSection
              codingQuestion={question}
              onRunCode={handleRunCode}
              onSubmitCode={handleSubmitCode}
              submitting={submitting}
            />
          </div>
        ) : (
          <div className="max-w-3xl w-full mx-auto my-auto">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-10 relative overflow-hidden">
              {/* Question Index & Topic Header - STRICTLY NO DIFFICULTY OR MARKS */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-slate-900">
                    Question {questionNumber} <span className="text-slate-400 font-normal">of {totalQuestions}</span>
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                    {question?.topic || 'General'}
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Single Choice</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <h2 className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                  {question?.questionText}
                </h2>
              </div>

              {/* MCQ Options List */}
              <div className="space-y-3 mb-8">
                {question?.options?.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-zelis-50 border-zelis-600 text-slate-900 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all shrink-0 ${
                          isSelected
                            ? 'bg-zelis-600 border-zelis-600 text-white'
                            : 'border-slate-300 text-slate-500'
                        }`}
                      >
                        {opt.id}
                      </div>
                      <span className="text-xs sm:text-sm font-medium leading-relaxed">{opt.text}</span>
                    </label>
                  );
                })}
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {error}
                </div>
              )}

              {/* Action Row */}
              <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                  <span>Answers are locked and evaluated upon submission.</span>
                </div>

                <button
                  onClick={handleAnswerSubmit}
                  disabled={!selectedOption || submitting}
                  className="px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-zelis-600 hover:bg-zelis-700 text-white shadow-sm flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit Answer</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Progress Bar Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 sm:px-8 py-3 sticky bottom-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 text-xs">
          <span className="text-slate-500 font-medium">
            Progress: {questionNumber - 1} of {totalQuestions} completed
          </span>
          <div className="flex-1 max-w-xs h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
            <div
              className="h-full bg-zelis-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-semibold text-zelis-700">{progressPercent}%</span>
        </div>
      </footer>
    </div>
  );
};

export default AssessmentScreen;

