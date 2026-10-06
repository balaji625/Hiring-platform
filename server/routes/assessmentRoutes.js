const express = require('express');
const router = express.Router();
const {
  getAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  previewAIAssessment,
} = require('../controllers/assessmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAssessments);
router.post('/ai-preview', protect, authorize('recruiter', 'admin'), previewAIAssessment);
router.get('/:id', getAssessmentById);
router.post('/', protect, authorize('recruiter', 'admin'), createAssessment);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateAssessment);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteAssessment);

module.exports = router;
