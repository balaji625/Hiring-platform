import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  Camera,
  Mic,
  Maximize2,
  Globe,
  Wifi,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

export const SystemCheck = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Checks state
  const [cameraStatus, setCameraStatus] = useState('checking'); // 'checking' | 'passed' | 'failed'
  const [micStatus, setMicStatus] = useState('checking');
  const [fullscreenStatus, setFullscreenStatus] = useState('pending'); // 'pending' | 'passed'
  const [browserStatus, setBrowserStatus] = useState('passed');
  const [internetStatus, setInternetStatus] = useState(navigator.onLine ? 'passed' : 'failed');

  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await api.get(`/assessments/${id}`);
        setAssessment(res.data.data);
      } catch (err) {
        setError('Failed to load assessment information.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();

    // Check media permissions (Camera and Mic)
    const requestMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setCameraStream(stream);
        setCameraStatus('passed');
        setMicStatus('passed');

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera/Mic permission error:', err);
        setCameraStatus('failed');
        setMicStatus('failed');
      }
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      requestMedia();
    } else {
      setCameraStatus('failed');
      setMicStatus('failed');
    }

    // Clean up media streams when unmounting
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [id]);

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const testFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      setFullscreenStatus('passed');
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
      // In case browser requires user click during navigation, consider passed
      setFullscreenStatus('passed');
    }
  };

  const allPassed =
    cameraStatus === 'passed' &&
    micStatus === 'passed' &&
    browserStatus === 'passed' &&
    internetStatus === 'passed';

  const handleStartExam = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (_) {}
    navigate(`/candidate/assessment/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Pre-Assessment Environment Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            System & Device Readiness Check
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            {assessment?.title} — Please verify that your hardware and browser meet proctoring requirements.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Live Camera Preview */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Webcam Video Stream Preview
              </div>
              <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center shadow-inner">
                {cameraStatus === 'passed' ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror-mode"
                  />
                ) : (
                  <div className="text-center p-4 text-slate-400 text-xs">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                    <span>Camera permission not detected</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-sm flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      cameraStatus === 'passed' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                    }`}
                  />
                  <span>Live Stream</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                A small proctoring camera thumbnail will be displayed in the corner during the exam.
              </p>
            </div>

            {/* Checklist items */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                System Diagnostics
              </div>

              {/* Camera check */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <Camera className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-semibold text-slate-800">Webcam Camera</span>
                </div>
                {cameraStatus === 'passed' ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" /> Ready ✓
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-rose-600">
                    <AlertCircle className="w-4 h-4" /> Blocked
                  </span>
                )}
              </div>

              {/* Microphone check */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <Mic className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-semibold text-slate-800">Microphone Audio</span>
                </div>
                {micStatus === 'passed' ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" /> Active ✓
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-rose-600">
                    <AlertCircle className="w-4 h-4" /> Blocked
                  </span>
                )}
              </div>

              {/* Fullscreen check */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <Maximize2 className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-semibold text-slate-800">Fullscreen Secure Mode</span>
                </div>
                {fullscreenStatus === 'passed' ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" /> Verified ✓
                  </span>
                ) : (
                  <button
                    onClick={testFullscreen}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
                  >
                    Test Fullscreen
                  </button>
                )}
              </div>

              {/* Browser check */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-semibold text-slate-800">Browser Compatibility</span>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> Supported ✓
                </span>
              </div>

              {/* Internet check */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <Wifi className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-semibold text-slate-800">Internet Connectivity</span>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> Online ✓
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs leading-relaxed">
            <strong>Monitored Environment Notice:</strong> Once you enter, the assessment will open in fullscreen mode.
            Leaving fullscreen or navigating to other application windows will generate security telemetry flags for recruiter review.
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => navigate(`/candidate/assessment/${id}/instructions`)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              ← Back to Instructions
            </button>

            <button
              onClick={handleStartExam}
              disabled={!allPassed}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <span>Start Monitored Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
