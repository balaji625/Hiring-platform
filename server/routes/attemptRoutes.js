const express = require('express');
const router = express.Router();
const {
  startAssessment,
  getCurrentQuestion,
  submitAnswer,
  runCode,
  submitCode,
  finishAssessment,
  getAttemptResult,
  logTelemetryEvent,
} = require('../controllers/attemptController');
const { protect } = require('../middleware/auth');

router.post('/start/:assessmentId', protect, startAssessment);
router.get('/:attemptId/current-question', protect, getCurrentQuestion);
router.post('/:attemptId/answer', protect, submitAnswer);
router.post('/:attemptId/run-code', protect, runCode);
router.post('/:attemptId/submit-code', protect, submitCode);
router.post('/:attemptId/submit', protect, finishAssessment);
router.get('/:attemptId/result', protect, getAttemptResult);
router.post('/:attemptId/telemetry', protect, logTelemetryEvent);

module.exports = router;
