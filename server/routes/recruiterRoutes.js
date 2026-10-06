const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getCandidatesLeaderboard,
  getCandidateDetails,
  updateApplicationStatus,
  scheduleInterview,
  updateInterview,
  getCandidateReport,
  getAssessmentLeaderboard,
} = require('../controllers/recruiterController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('recruiter', 'admin'));

router.get('/dashboard', getDashboardStats);
router.get('/candidates', getCandidatesLeaderboard);
router.get('/candidates/:id', getCandidateDetails);
router.get('/candidates/:id/report', getCandidateReport);
router.patch('/applications/:id/status', updateApplicationStatus);
router.post('/interviews', scheduleInterview);
router.put('/interviews/:id', updateInterview);
router.get('/assessments/:id/leaderboard', getAssessmentLeaderboard);

module.exports = router;

