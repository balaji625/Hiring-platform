const express = require('express');
const router = express.Router();
const { generateQuestionsWithAI } = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('recruiter', 'admin'));

router.post('/generate-questions', generateQuestionsWithAI);

module.exports = router;
