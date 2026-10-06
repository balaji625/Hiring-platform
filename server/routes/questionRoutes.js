const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  generateQuestionsWithAI,
} = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('recruiter', 'admin'));

router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.post('/', createQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);
router.post('/ai-generate', generateQuestionsWithAI);

module.exports = router;
