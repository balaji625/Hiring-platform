const Question = require('../models/Question');
const CodingQuestion = require('../models/CodingQuestion');
const { generateAIQuestions, generateAICodingQuestions } = require('../services/aiService');

// @desc    Get all questions with filtering & search (combines MCQ and Coding questions)
// @route   GET /api/questions
// @access  Private (Recruiter / Admin)
exports.getQuestions = async (req, res, next) => {
  try {
    const { topic, difficulty, type, search, page = 1, limit = 100 } = req.query;

    const query = {};
    if (topic && topic !== 'all') {
      query.topic = topic;
    }
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    if (search) {
      query.$or = [
        { questionText: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // If type is specifically coding, query CodingQuestion
    if (type === 'coding') {
      const codingQuery = {};
      if (difficulty && difficulty !== 'all') codingQuery.difficulty = difficulty;
      if (topic && topic !== 'all') codingQuery.topic = topic;
      if (search) codingQuery.title = { $regex: search, $options: 'i' };

      const codingTotal = await CodingQuestion.countDocuments(codingQuery);
      const codingQuestions = await CodingQuestion.find(codingQuery).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        total: codingTotal,
        count: codingQuestions.length,
        page: 1,
        pages: 1,
        data: codingQuestions.map((cq) => ({
          _id: cq._id,
          questionText: `${cq.title}: ${cq.problemStatement.slice(0, 100)}...`,
          type: 'coding',
          difficulty: cq.difficulty,
          topic: cq.topic,
          marks: cq.marks,
          allowedLanguages: cq.allowedLanguages,
          sampleTestCases: cq.sampleTestCases,
          createdAt: cq.createdAt,
        })),
      });
    }

    const total = await Question.countDocuments(query);
    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      count: questions.length,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private (Recruiter / Admin)
exports.getQuestionById = async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id);
    if (!question) {
      question = await CodingQuestion.findById(req.params.id);
    }
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create question (MCQ or Coding)
// @route   POST /api/questions
// @access  Private (Recruiter / Admin)
exports.createQuestion = async (req, res, next) => {
  try {
    const {
      questionText,
      type,
      options,
      correctAnswer,
      topic,
      difficulty,
      explanation,
      tags,
      title,
      problemStatement,
      inputFormat,
      outputFormat,
      constraints,
      sampleTestCases,
      hiddenTestCases,
      allowedLanguages,
      starterCode,
    } = req.body;

    if (type === 'coding') {
      if (!title || !problemStatement || !difficulty) {
        return res.status(400).json({
          success: false,
          message: 'Title, problem statement, and difficulty are required for coding questions.',
        });
      }

      const codingQuestion = await CodingQuestion.create({
        title,
        problemStatement,
        inputFormat: inputFormat || '',
        outputFormat: outputFormat || '',
        constraints: constraints || '',
        difficulty,
        topic: topic || 'Algorithms',
        allowedLanguages: allowedLanguages || ['python', 'java', 'c', 'cpp', 'javascript'],
        starterCode: starterCode || undefined,
        sampleTestCases: sampleTestCases || [],
        hiddenTestCases: hiddenTestCases || [],
        marks: difficulty === 'hard' ? 30 : difficulty === 'medium' ? 20 : 10,
        createdBy: req.user._id,
      });

      return res.status(201).json({
        success: true,
        message: 'Coding problem created successfully',
        data: codingQuestion,
      });
    }

    // Default MCQ
    if (!questionText || !options || !correctAnswer || !topic || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Please provide questionText, options, correctAnswer, topic, and difficulty',
      });
    }

    const marks = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1;

    const question = await Question.create({
      questionText,
      type: 'mcq',
      options,
      correctAnswer,
      topic,
      difficulty,
      marks,
      explanation: explanation || '',
      tags: tags || [topic, difficulty],
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private (Recruiter / Admin)
exports.updateQuestion = async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id);
    if (question) {
      if (req.body.difficulty) {
        req.body.marks = req.body.difficulty === 'hard' ? 3 : req.body.difficulty === 'medium' ? 2 : 1;
      }
      question = await Question.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      return res.status(200).json({ success: true, message: 'Question updated', data: question });
    }

    let codingQ = await CodingQuestion.findById(req.params.id);
    if (codingQ) {
      codingQ = await CodingQuestion.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      return res.status(200).json({ success: true, message: 'Coding question updated', data: codingQ });
    }

    return res.status(404).json({ success: false, message: 'Question not found' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private (Recruiter / Admin)
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (question) {
      await Question.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, message: 'Question deleted successfully' });
    }

    const codingQ = await CodingQuestion.findById(req.params.id);
    if (codingQ) {
      await CodingQuestion.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, message: 'Coding question deleted successfully' });
    }

    return res.status(404).json({ success: false, message: 'Question not found' });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI questions (MCQ or Coding) with approval workflow (Requirement 21)
// @route   POST /api/questions/ai-generate
// @access  Private (Recruiter / Admin)
exports.generateQuestionsWithAI = async (req, res, next) => {
  try {
    const { topic = 'DSA', difficulty = 'medium', type = 'mcq', count = 5, autoSave = false } = req.body;

    if (type === 'coding') {
      const generatedCoding = await generateAICodingQuestions({
        topic,
        difficulty,
        count: parseInt(count) || 2,
      });

      if (autoSave && generatedCoding.length > 0) {
        const saved = await CodingQuestion.insertMany(
          generatedCoding.map((cq) => ({ ...cq, createdBy: req.user._id }))
        );
        return res.status(201).json({
          success: true,
          message: `Saved ${saved.length} AI coding problems to Question Bank!`,
          data: saved,
        });
      }

      return res.status(200).json({
        success: true,
        message: `Generated ${generatedCoding.length} AI coding problems ready for recruiter review.`,
        data: generatedCoding,
      });
    }

    const generated = await generateAIQuestions({ topic, difficulty, count: parseInt(count) });

    if (autoSave && generated.length > 0) {
      const savedDocs = await Question.insertMany(
        generated.map((q) => ({
          ...q,
          createdBy: req.user._id,
        }))
      );

      return res.status(201).json({
        success: true,
        message: `Generated and approved ${savedDocs.length} questions to Question Bank!`,
        data: savedDocs,
      });
    }

    res.status(200).json({
      success: true,
      message: `Generated ${generated.length} questions ready for recruiter review.`,
      data: generated,
    });
  } catch (error) {
    next(error);
  }
};
