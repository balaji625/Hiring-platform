const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const { generateAIAssessmentStructure } = require('../services/aiService');

// @desc    Get all assessments
// @route   GET /api/assessments
// @access  Public / Protected
exports.getAssessments = async (req, res, next) => {
  try {
    const filter = {};
    if (!req.user || req.user.role === 'candidate') {
      filter.status = 'published';
    }

    const assessments = await Assessment.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assessments.length,
      data: assessments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assessment
// @route   GET /api/assessments/:id
// @access  Public / Protected
exports.getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('createdBy', 'name email');
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Preview AI generated assessment structure for recruiter review before publishing
// @route   POST /api/assessments/ai-preview
// @access  Private (Recruiter / Admin)
exports.previewAIAssessment = async (req, res, next) => {
  try {
    const { role, experienceLevel, durationMinutes, sections, difficulty, passingCutoff } = req.body;

    const proposedAssessment = await generateAIAssessmentStructure({
      role: role || 'Software Engineer Intern',
      experienceLevel: experienceLevel || 'Fresher',
      durationMinutes: durationMinutes || 60,
      sections: sections || ['DSA', 'DBMS', 'SQL', 'OOP', 'Coding'],
      difficulty: difficulty || 'Adaptive',
      passingCutoff: passingCutoff || 70,
    });

    res.status(200).json({
      success: true,
      data: proposedAssessment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new assessment
// @route   POST /api/assessments
// @access  Private (Recruiter / Admin)
exports.createAssessment = async (req, res, next) => {
  try {
    const {
      title,
      description,
      role,
      experienceLevel,
      duration,
      topics,
      questionCount,
      passingScore,
      negativeMarking,
      proctoringLevel,
      codingRequired,
      allowedLanguages,
      sections,
      difficultyConfig,
      difficultyDistribution,
      aiGenerated,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Assessment title is required.',
      });
    }

    const assessmentTopics =
      topics && Array.isArray(topics) && topics.length > 0 ? topics : ['DSA', 'SQL', 'OOP', 'DBMS'];

    const assessment = await Assessment.create({
      title,
      description: description || '',
      role: role || 'Software Development Engineer',
      experienceLevel: experienceLevel || 'Entry Level',
      duration: Number(duration) || 45,
      topics: assessmentTopics,
      questionCount: Number(questionCount) || 15,
      passingScore: Number(passingScore) || 60,
      negativeMarking: !!negativeMarking,
      proctoringLevel: proctoringLevel || 'strict',
      codingRequired: codingRequired !== false,
      allowedLanguages: allowedLanguages || ['python', 'java', 'c', 'cpp', 'javascript'],
      sections: sections || [],
      difficultyConfig: difficultyConfig || {
        startDifficulty: 'easy',
        consecutiveFailuresToDowngrade: 2,
        marks: { easy: 1, medium: 2, hard: 3 },
      },
      difficultyDistribution: difficultyDistribution || {
        easy: 40,
        medium: 40,
        hard: 20,
      },
      aiGenerated: !!aiGenerated,
      createdBy: req.user._id,
      status: 'published',
    });

    res.status(201).json({
      success: true,
      message: 'Assessment created successfully',
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update assessment
// @route   PUT /api/assessments/:id
// @access  Private (Recruiter / Admin)
exports.updateAssessment = async (req, res, next) => {
  try {
    let assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
      });
    }

    assessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete assessment
// @route   DELETE /api/assessments/:id
// @access  Private (Recruiter / Admin)
exports.deleteAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
      });
    }

    await Assessment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
