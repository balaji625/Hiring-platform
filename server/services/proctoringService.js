/**
 * Modular Proctoring & AI Telemetry Service
 * Analyzes candidate assessment signals and generates actionable flags for recruiter review.
 * Never performs automatic unfair rejection; presents an objective Proctoring Trust Index and timeline.
 */

const SecurityEvent = require('../models/SecurityEvent');

class ProctoringService {
  /**
   * Evaluates a security event telemetry signal and maps severity.
   */
  classifyEvent(eventType, metadata = {}) {
    switch (eventType) {
      case 'multiple-faces':
        return {
          severity: 'high',
          title: 'Multiple Faces Detected',
          description: 'Vision signal detected more than one person in camera frame.',
        };
      case 'no-face':
      case 'candidate-left-frame':
        return {
          severity: 'medium',
          title: 'Candidate Left Camera Frame',
          description: 'No face detected in video feed for an extended period.',
        };
      case 'face-changed':
        return {
          severity: 'high',
          title: 'Face Discrepancy Detected',
          description: 'Candidate facial biometric features shifted significantly.',
        };
      case 'fullscreen-exit':
        return {
          severity: 'medium',
          title: 'Exited Fullscreen Secure Mode',
          description: 'Candidate pressed Escape or exited fullscreen exam view.',
        };
      case 'tab-hidden':
      case 'tab-blurred':
        return {
          severity: 'medium',
          title: 'Browser Tab Switched',
          description: 'Candidate switched application focus away from the exam tab.',
        };
      case 'camera-revoked':
        return {
          severity: 'high',
          title: 'Camera Access Revoked',
          description: 'Webcam feed disconnected or permissions manually revoked.',
        };
      case 'microphone-revoked':
        return {
          severity: 'medium',
          title: 'Microphone Access Revoked',
          description: 'Microphone stream disconnected or permissions revoked.',
        };
      case 'copy-paste':
        return {
          severity: 'low',
          title: 'Clipboard Activity Detected',
          description: 'Candidate attempted to copy or paste content into question area.',
        };
      default:
        return {
          severity: 'low',
          title: 'Telemetry Event',
          description: metadata.details || 'General proctoring signal logged.',
        };
    }
  }

  /**
   * Calculate Proctoring Integrity Score (0 to 100)
   * High severity event: -15 pts
   * Medium severity event: -6 pts
   * Low severity event: -2 pts
   */
  calculateIntegrityScore(events = [], tabSwitchCount = 0, fullscreenExitCount = 0) {
    let penalty = 0;

    events.forEach((ev) => {
      if (ev.severity === 'high') penalty += 15;
      else if (ev.severity === 'medium') penalty += 6;
      else penalty += 2;
    });

    penalty += (tabSwitchCount || 0) * 4;
    penalty += (fullscreenExitCount || 0) * 5;

    const integrityScore = Math.max(0, 100 - penalty);
    
    let statusLabel = 'Clean';
    if (integrityScore < 60) statusLabel = 'High Suspicion';
    else if (integrityScore < 85) statusLabel = 'Needs Review';
    else if (integrityScore < 95) statusLabel = 'Minor Flags';

    return {
      score: integrityScore,
      statusLabel,
      totalFlags: events.length + tabSwitchCount + fullscreenExitCount,
    };
  }

  /**
   * Log an event to the SecurityEvent collection and return structured flag
   */
  async recordSecurityEvent({ candidateId, attemptId, eventType, details = '', metadata = {} }) {
    const classification = this.classifyEvent(eventType, metadata);

    const event = await SecurityEvent.create({
      candidate: candidateId,
      attempt: attemptId,
      eventType,
      severity: classification.severity,
      details: details || classification.description,
      timestamp: new Date(),
    });

    return {
      event,
      classification,
    };
  }
}

module.exports = new ProctoringService();
