const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const QuestionAttempt = require('../models/QuestionAttempt');
const Question = require('../models/Question');
const CodingQuestion = require('../models/CodingQuestion');
const CodingSubmission = require('../models/CodingSubmission');
const Application = require('../models/Application');
const SecurityEvent = require('../models/SecurityEvent');
const proctoringService = require('../services/proctoringService');
const { evaluateInSandbox } = require('../services/codeExecutionService');
const {
  computeNextDifficulty,
  selectNextQuestion,
  recalculateAttemptMetrics,
  DIFFICULTY_MARKS,
} = require('../services/adaptiveAssessmentService');

// Helper to sanitize MCQ question for candidate so difficulty, marks, and correct answer are STRICTLY CONCEALED
const sanitizeQuestionCandidate = (question) => {
  if (!question) return null;
  return {
    _id: question._id,
    questionText: question.questionText,
    type: question.type || 'mcq',
    options: (question.options || []).map((opt) => ({
      id: opt.id,
      text: opt.text,
    })),
    topic: question.topic,
    tags: question.tags,
    codingDetails: question.codingDetails,
  };
};

// Helper to sanitize Coding question for candidate so difficulty, marks, and hidden test cases are STRICTLY CONCEALED
const sanitizeCodingQuestionCandidate = (codingQ) => {
  if (!codingQ) return null;
  return {
    _id: codingQ._id,
    type: 'coding',
    title: codingQ.title,
    problemStatement: codingQ.problemStatement,
    inputFormat: codingQ.inputFormat,
    outputFormat: codingQ.outputFormat,
    constraints: codingQ.constraints,
    topic: codingQ.topic,
    allowedLanguages: codingQ.allowedLanguages || ['python', 'java', 'c', 'cpp', 'javascript'],
    starterCode: codingQ.starterCode,
    sampleTestCases: (codingQ.sampleTestCases || []).map((stc) => ({
      input: stc.input,
      expectedOutput: stc.expectedOutput,
      explanation: stc.explanation,
    })),
  };
};

// @desc    Start or resume assessment attempt
// @route   POST /api/attempts/start/:assessmentId
// @access  Private (Candidate)
exports.startAssessment = async (req, res, next) => {
  try {
    const { assessmentId } = req.params;
    const candidateId = req.user._id;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
      });
    }

    // Check for existing in-progress attempt
    let attempt = await AssessmentAttempt.findOne({
      candidate: candidateId,
      assessment: assessmentId,
      status: 'in-progress',
    })
      .populate('currentQuestion')
      .populate('currentCodingQuestion');

    if (attempt) {
      // Check if attempt timed out based on startedAt and duration
      const elapsedMinutes = (Date.now() - new Date(attempt.startedAt).getTime()) / (1000 * 60);
      if (elapsedMinutes > assessment.duration) {
        attempt.status = 'timed-out';
        attempt.submittedAt = new Date();
        const metrics = await recalculateAttemptMetrics(attempt);
        Object.assign(attempt, metrics);
        await attempt.save();

        return res.status(200).json({
          success: true,
          message: 'Previous assessment attempt has timed out.',
          completed: true,
        });
      }

      // Resume active attempt
      const activeQ =
        attempt.currentQuestionType === 'coding' && attempt.currentCodingQuestion
          ? sanitizeCodingQuestionCandidate(attempt.currentCodingQuestion)
          : sanitizeQuestionCandidate(attempt.currentQuestion);

      return res.status(200).json({
        success: true,
        message: 'Resuming active assessment attempt',
        attemptId: attempt._id,
        questionsAttemptedCount: attempt.questionsAttemptedCount,
        totalQuestions: attempt.totalQuestions,
        currentQuestion: activeQ,
        durationMinutes: assessment.duration,
        startedAt: attempt.startedAt,
        resumed: true,
      });
    }

    // Start fresh attempt starting at EASY
    const initialDifficulty = assessment.difficultyConfig?.startDifficulty || 'easy';

    attempt = new AssessmentAttempt({
      candidate: candidateId,
      assessment: assessmentId,
      startedAt: new Date(),
      currentDifficulty: initialDifficulty,
      failureCount: 0,
      totalQuestions: assessment.questionCount,
      questionsAttemptedCount: 0,
      currentQuestionIndex: 1,
      currentQuestionStartedAt: new Date(),
      status: 'in-progress',
      cameraPermission: true,
      microphonePermission: true,
      fullscreenStatus: true,
    });

    await attempt.save();

    // Select first question
    const firstQuestion = await selectNextQuestion({
      assessment,
      attemptId: attempt._id,
      targetDifficulty: initialDifficulty,
    });

    if (!firstQuestion) {
      await AssessmentAttempt.findByIdAndDelete(attempt._id);
      return res.status(400).json({
        success: false,
        message: 'Insufficient questions available in question bank to start assessment.',
      });
    }

    attempt.currentQuestion = firstQuestion._id;
    attempt.currentQuestionType = 'mcq';
    await attempt.save();

    // Upsert Application in pipeline
    let application = await Application.findOne({
      candidate: candidateId,
      assessment: assessmentId,
    });

    if (!application) {
      application = await Application.create({
        candidate: candidateId,
        assessment: assessmentId,
        latestAttempt: attempt._id,
        status: 'Assessment',
        jobTitle: `Software Engineer (${assessment.title})`,
        company: 'Zelis Healthcare',
        statusHistory: [
          {
            status: 'Assessment',
            changedAt: new Date(),
            changedBy: candidateId,
            note: 'Candidate began adaptive technical assessment',
          },
        ],
      });
    } else {
      application.latestAttempt = attempt._id;
      if (application.status === 'Applied') {
        application.status = 'Assessment';
        application.statusHistory.push({
          status: 'Assessment',
          changedAt: new Date(),
          changedBy: candidateId,
          note: 'Candidate began adaptive technical assessment',
        });
      }
      await application.save();
    }

    res.status(201).json({
      success: true,
      message: 'Assessment attempt started successfully',
      attemptId: attempt._id,
      questionsAttemptedCount: 0,
      totalQuestions: attempt.totalQuestions,
      currentQuestion: sanitizeQuestionCandidate(firstQuestion),
      durationMinutes: assessment.duration,
      startedAt: attempt.startedAt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active question in attempt
// @route   GET /api/attempts/:attemptId/current-question
// @access  Private (Candidate)
exports.getCurrentQuestion = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const attempt = await AssessmentAttempt.findById(attemptId)
      .populate('assessment')
      .populate('currentQuestion')
      .populate('currentCodingQuestion');

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    if (attempt.candidate.toString() !== req.user._id.toString() && req.user.role === 'candidate') {
      return res.status(403).json({ success: false, message: 'Unauthorized access to attempt' });
    }

    if (attempt.status !== 'in-progress') {
      return res.status(200).json({
        success: true,
        completed: true,
        message: 'Assessment is already completed.',
      });
    }

    // Check timer timeout
    const elapsedMinutes = (Date.now() - new Date(attempt.startedAt).getTime()) / (1000 * 60);
    if (elapsedMinutes > attempt.assessment.duration) {
      attempt.status = 'timed-out';
      attempt.submittedAt = new Date();
      const metrics = await recalculateAttemptMetrics(attempt);
      Object.assign(attempt, metrics);
      await attempt.save();

      return res.status(200).json({
        success: true,
        completed: true,
        timedOut: true,
        message: 'Assessment time limit has expired. Automatically submitted.',
      });
    }

    const activeQ =
      attempt.currentQuestionType === 'coding' && attempt.currentCodingQuestion
        ? sanitizeCodingQuestionCandidate(attempt.currentCodingQuestion)
        : sanitizeQuestionCandidate(attempt.currentQuestion);

    res.status(200).json({
      success: true,
      attemptId: attempt._id,
      questionsAttemptedCount: attempt.questionsAttemptedCount,
      totalQuestions: attempt.totalQuestions,
      currentQuestion: activeQ,
      durationMinutes: attempt.assessment.duration,
      startedAt: attempt.startedAt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit answer to current MCQ question and trigger silent adaptive difficulty transition
// @route   POST /api/attempts/:attemptId/answer
// @access  Private (Candidate)
exports.submitAnswer = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const { selectedAnswer } = req.body;

    const attempt = await AssessmentAttempt.findById(attemptId).populate('assessment');
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    if (attempt.candidate.toString() !== req.user._id.toString() && req.user.role === 'candidate') {
      return res.status(403).json({ success: false, message: 'Unauthorized access to attempt' });
    }

    if (attempt.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Assessment is no longer in progress.',
        completed: true,
      });
    }

    const currentQuestion = await Question.findById(attempt.currentQuestion);
    if (!currentQuestion) {
      return res.status(400).json({ success: false, message: 'Current question not found.' });
    }

    // Guard against duplicate submission of same question
    const existingQA = await QuestionAttempt.findOne({
      attempt: attempt._id,
      question: currentQuestion._id,
    });

    if (existingQA) {
      return res.status(400).json({
        success: false,
        message: 'This question has already been answered.',
      });
    }

    // Evaluate answer on backend
    const isCorrect = (selectedAnswer || '').trim().toUpperCase() === currentQuestion.correctAnswer.trim().toUpperCase();
    const marksForDifficulty = DIFFICULTY_MARKS[currentQuestion.difficulty] || 1;
    const marksAwarded = isCorrect ? marksForDifficulty : 0;

    const timeTakenSeconds = Math.max(
      1,
      Math.round((Date.now() - new Date(attempt.currentQuestionStartedAt || Date.now()).getTime()) / 1000)
    );

    // SILENT ADAPTIVE DIFFICULTY ALGORITHM
    // Easy -> Correct -> Med -> Correct -> Hard -> Hard
    // 1st Wrong -> Retain level
    // 2 Consecutive Wrong -> Downgrade (Hard -> Med, Med -> Easy, never below Easy)
    const failureCountBefore = attempt.failureCount || 0;
    const { nextDifficulty, nextFailureCount } = computeNextDifficulty(
      attempt.currentDifficulty,
      failureCountBefore,
      isCorrect
    );

    const questionNumber = (attempt.questionsAttemptedCount || 0) + 1;

    // Record question attempt with full transition metadata for recruiter analysis
    await QuestionAttempt.create({
      attempt: attempt._id,
      question: currentQuestion._id,
      questionNumber,
      difficulty: currentQuestion.difficulty,
      topic: currentQuestion.topic,
      selectedAnswer: selectedAnswer || 'None',
      isCorrect,
      marksAwarded,
      maxMarks: marksForDifficulty,
      timeTakenSeconds,
      transitionFrom: attempt.currentDifficulty,
      transitionTo: nextDifficulty,
      failureCountBefore,
      failureCountAfter: nextFailureCount,
    });

    // Update attempt adaptive state
    attempt.currentDifficulty = nextDifficulty;
    attempt.failureCount = nextFailureCount;
    attempt.questionsAttemptedCount = questionNumber;

    // Check if assessment completed
    // If assessment includes coding, let the final 2 questions be coding questions if configured
    const codingRequired = attempt.assessment.codingRequired !== false;
    const isLastQuestionsForCoding = codingRequired && questionNumber >= attempt.totalQuestions - 1;

    const isFinished = questionNumber >= attempt.totalQuestions;

    if (isFinished) {
      attempt.status = 'completed';
      attempt.submittedAt = new Date();
      attempt.currentQuestion = null;
      attempt.currentCodingQuestion = null;

      const metrics = await recalculateAttemptMetrics(attempt);
      Object.assign(attempt, metrics);
      await attempt.save();

      // Update recruitment application
      const recommendation =
        attempt.percentage >= 85
          ? 'Excellent'
          : attempt.percentage >= 70
          ? 'Strong'
          : attempt.percentage >= 50
          ? 'Good'
          : 'Average';

      await Application.findOneAndUpdate(
        { candidate: attempt.candidate, assessment: attempt.assessment._id },
        {
          assessmentScore: attempt.percentage,
          accuracy: attempt.accuracy,
          highestDifficulty: attempt.highestDifficulty,
          recommendation,
          status: attempt.percentage >= (attempt.assessment.passingScore || 60) ? 'Shortlisted' : 'Assessment',
          $push: {
            statusHistory: {
              status: attempt.percentage >= (attempt.assessment.passingScore || 60) ? 'Shortlisted' : 'Assessment',
              changedAt: new Date(),
              changedBy: req.user._id,
              note: `Assessment completed. Results queued for recruiter evaluation.`,
            },
          },
        }
      );

      // Candidate receives submission confirmation with NO SCORES, NO MARKS, NO CORRECT ANSWERS
      return res.status(200).json({
        success: true,
        completed: true,
        questionsAttemptedCount: questionNumber,
        totalQuestions: attempt.totalQuestions,
        message: 'Assessment submitted successfully. Your results are being reviewed.',
        attemptId: attempt._id,
      });
    }

    // Check if next question should be a Coding question
    if (isLastQuestionsForCoding) {
      // Find a coding question suitable for the current difficulty
      const codingQ = await CodingQuestion.findOne({ difficulty: nextDifficulty }) ||
        await CodingQuestion.findOne();

      if (codingQ) {
        attempt.currentCodingQuestion = codingQ._id;
        attempt.currentQuestionType = 'coding';
        attempt.currentQuestionStartedAt = new Date();
        await attempt.save();

        return res.status(200).json({
          success: true,
          completed: false,
          questionsAttemptedCount: questionNumber,
          totalQuestions: attempt.totalQuestions,
          nextQuestion: sanitizeCodingQuestionCandidate(codingQ),
        });
      }
    }

    // Otherwise select next MCQ question at nextDifficulty
    const nextQuestion = await selectNextQuestion({
      assessment: attempt.assessment,
      attemptId: attempt._id,
      targetDifficulty: nextDifficulty,
    });

    if (!nextQuestion) {
      // Pool exhausted, finalize attempt
      attempt.status = 'completed';
      attempt.submittedAt = new Date();
      attempt.currentQuestion = null;
      const metrics = await recalculateAttemptMetrics(attempt);
      Object.assign(attempt, metrics);
      await attempt.save();

      return res.status(200).json({
        success: true,
        completed: true,
        questionsAttemptedCount: questionNumber,
        totalQuestions: attempt.totalQuestions,
        message: 'Assessment submitted successfully. Your results are being reviewed.',
        attemptId: attempt._id,
      });
    }

    attempt.currentQuestion = nextQuestion._id;
    attempt.currentQuestionType = 'mcq';
    attempt.currentQuestionStartedAt = new Date();
    await attempt.save();

    // Candidate response: Strictly hides difficulty, marks, isCorrect, nextDifficulty!
    res.status(200).json({
      success: true,
      completed: false,
      questionsAttemptedCount: questionNumber,
      totalQuestions: attempt.totalQuestions,
      nextQuestion: sanitizeQuestionCandidate(nextQuestion),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Run candidate code against sample test cases (candidate test runner)
// @route   POST /api/attempts/:attemptId/run-code
// @access  Private (Candidate)
exports.runCode = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const { codingQuestionId, language, code } = req.body;

    const codingQ = await CodingQuestion.findById(codingQuestionId);
    if (!codingQ) {
      return res.status(404).json({ success: false, message: 'Coding problem not found.' });
    }

    // Evaluate against sample test cases ONLY
    const testCases = (codingQ.sampleTestCases || []).map((t) => ({
      input: t.input,
      expectedOutput: t.expectedOutput,
      isHidden: false,
      explanation: t.explanation,
    }));

    const result = await evaluateInSandbox({
      language,
      code,
      testCases,
      timeLimitMs: codingQ.timeLimitMs || 2000,
    });

    res.status(200).json({
      success: true,
      status: result.status,
      sampleResults: result.sampleResults,
      sampleTestsPassed: result.sampleTestsPassed,
      totalSampleTests: result.totalSampleTests,
      allSamplePassed: result.sampleTestsPassed === result.totalSampleTests,
      executionTimeMs: result.executionTimeMs,
      memoryKb: result.memoryKb,
      stderr: result.stderr,
      compileError: result.compileError,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit candidate code for final evaluation (evaluates sample + hidden test cases)
// @route   POST /api/attempts/:attemptId/submit-code
// @access  Private (Candidate)
exports.submitCode = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const { codingQuestionId, language, code } = req.body;

    const attempt = await AssessmentAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found.' });
    }

    const codingQ = await CodingQuestion.findById(codingQuestionId);
    if (!codingQ) {
      return res.status(404).json({ success: false, message: 'Coding problem not found.' });
    }

    // Assemble all test cases (sample + hidden)
    const allTestCases = [
      ...(codingQ.sampleTestCases || []).map((t) => ({
        input: t.input,
        expectedOutput: t.expectedOutput,
        isHidden: false,
      })),
      ...(codingQ.hiddenTestCases || []).map((t) => ({
        input: t.input,
        expectedOutput: t.expectedOutput,
        isHidden: true,
      })),
    ];

    const result = await evaluateInSandbox({
      language,
      code,
      testCases: allTestCases,
      timeLimitMs: codingQ.timeLimitMs || 2000,
    });

    const totalTests = result.totalTests || 1;
    const score = Math.round((result.totalPassed / totalTests) * (codingQ.marks || 20));

    // Store CodingSubmission record
    const submission = await CodingSubmission.create({
      candidate: attempt.candidate,
      attempt: attempt._id,
      codingQuestion: codingQ._id,
      language: language || 'python',
      code,
      status: result.status,
      sampleTestsPassed: result.sampleTestsPassed,
      totalSampleTests: result.totalSampleTests,
      hiddenTestsPassed: result.hiddenTestsPassed,
      totalHiddenTests: result.totalHiddenTests,
      score,
      maxScore: codingQ.marks || 20,
      executionTimeMs: result.executionTimeMs,
      memoryKb: result.memoryKb,
      stderr: result.stderr,
      compileError: result.compileError,
    });

    // Update attempt telemetry
    attempt.codingScore = (attempt.codingScore || 0) + score;
    attempt.maxCodingScore = (attempt.maxCodingScore || 0) + (codingQ.marks || 20);
    attempt.codingProblemsAttempted = (attempt.codingProblemsAttempted || 0) + 1;
    if (result.allPassed) {
      attempt.codingProblemsSolved = (attempt.codingProblemsSolved || 0) + 1;
    }
    if (!attempt.languagesUsed.includes(language)) {
      attempt.languagesUsed.push(language);
    }

    const questionNumber = (attempt.questionsAttemptedCount || 0) + 1;
    attempt.questionsAttemptedCount = questionNumber;

    const isFinished = questionNumber >= attempt.totalQuestions;

    if (isFinished) {
      attempt.status = 'completed';
      attempt.submittedAt = new Date();
      attempt.currentQuestion = null;
      attempt.currentCodingQuestion = null;
      const metrics = await recalculateAttemptMetrics(attempt);
      Object.assign(attempt, metrics);
    } else {
      // Advance to next question
      const nextQ = await selectNextQuestion({
        assessment: attempt.assessment,
        attemptId: attempt._id,
        targetDifficulty: attempt.currentDifficulty,
      });
      if (nextQ) {
        attempt.currentQuestion = nextQ._id;
        attempt.currentQuestionType = 'mcq';
        attempt.currentQuestionStartedAt = new Date();
      } else {
        attempt.status = 'completed';
        attempt.submittedAt = new Date();
      }
    }

    await attempt.save();

    res.status(200).json({
      success: true,
      submissionId: submission._id,
      status: result.status,
      sampleTestsPassed: result.sampleTestsPassed,
      totalSampleTests: result.totalSampleTests,
      hiddenTestsPassed: result.hiddenTestsPassed,
      totalHiddenTests: result.totalHiddenTests,
      completed: isFinished,
      message: isFinished
        ? 'Assessment submitted successfully. Your results are being reviewed.'
        : 'Code evaluated and submitted.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Explicitly finish/submit assessment
// @route   POST /api/attempts/:attemptId/submit
// @access  Private (Candidate)
exports.finishAssessment = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const attempt = await AssessmentAttempt.findById(attemptId).populate('assessment');

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    if (attempt.candidate.toString() !== req.user._id.toString() && req.user.role === 'candidate') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    attempt.status = 'completed';
    attempt.submittedAt = new Date();
    attempt.currentQuestion = null;
    attempt.currentCodingQuestion = null;

    const metrics = await recalculateAttemptMetrics(attempt);
    Object.assign(attempt, metrics);
    await attempt.save();

    const recommendation =
      attempt.percentage >= 85
        ? 'Excellent'
        : attempt.percentage >= 70
        ? 'Strong'
        : attempt.percentage >= 50
        ? 'Good'
        : 'Average';

    await Application.findOneAndUpdate(
      { candidate: attempt.candidate, assessment: attempt.assessment._id },
      {
        assessmentScore: attempt.percentage,
        accuracy: attempt.accuracy,
        highestDifficulty: attempt.highestDifficulty,
        recommendation,
        status: attempt.percentage >= (attempt.assessment.passingScore || 60) ? 'Shortlisted' : 'Assessment',
      }
    );

    res.status(200).json({
      success: true,
      message: 'Assessment submitted successfully. Your results are being reviewed.',
      completed: true,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assessment result: Candidate gets ONLY review notice; Recruiter gets FULL analytics
// @route   GET /api/attempts/:attemptId/result
// @access  Private (Candidate / Recruiter)
exports.getAttemptResult = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const attempt = await AssessmentAttempt.findById(attemptId)
      .populate('assessment')
      .populate('candidate', 'name email title');

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    // Role-based visibility isolation (REQUIREMENT 5 & 25)
    if (req.user.role === 'candidate') {
      if (attempt.candidate._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized to view this attempt result' });
      }

      // CANDIDATE VIEW: Strictly DO NOT show score, correct answers, difficulty progression, cutoff, or ranking!
      return res.status(200).json({
        success: true,
        candidateView: true,
        message: 'Assessment submitted successfully. Your results are being reviewed.',
        assessmentTitle: attempt.assessment?.title || 'Technical Assessment',
        submittedAt: attempt.submittedAt || attempt.updatedAt,
        status: attempt.status,
      });
    }

    // RECRUITER / ADMIN VIEW: Complete Deep Analytics
    const questionAttempts = await QuestionAttempt.find({ attempt: attempt._id })
      .populate('question')
      .sort({ questionNumber: 1 });

    const reviewQuestions = questionAttempts.map((qa) => ({
      questionNumber: qa.questionNumber,
      questionText: qa.question ? qa.question.questionText : 'Question text unavailable',
      options: qa.question ? qa.question.options : [],
      selectedAnswer: qa.selectedAnswer,
      correctAnswer: qa.question ? qa.question.correctAnswer : '',
      isCorrect: qa.isCorrect,
      difficulty: qa.difficulty,
      topic: qa.topic,
      marksAwarded: qa.marksAwarded,
      maxMarks: qa.maxMarks,
      explanation: qa.question ? qa.question.explanation : '',
      timeTakenSeconds: qa.timeTakenSeconds,
      transitionFrom: qa.transitionFrom,
      transitionTo: qa.transitionTo,
    }));

    const codingSubmissions = await CodingSubmission.find({ attempt: attempt._id }).populate('codingQuestion');
    const securityEvents = await SecurityEvent.find({ attempt: attempt._id }).sort({ timestamp: -1 });

    const proctoringSummary = proctoringService.calculateIntegrityScore(
      securityEvents,
      attempt.tabSwitchCount,
      attempt.fullscreenExitCount
    );

    res.status(200).json({
      success: true,
      candidateView: false,
      data: {
        attempt,
        reviewQuestions,
        codingSubmissions,
        securityEvents,
        proctoringSummary,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log anti-cheating telemetry event
// @route   POST /api/attempts/:attemptId/telemetry
// @access  Private (Candidate)
exports.logTelemetryEvent = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const { type, details } = req.body;

    const attempt = await AssessmentAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    if (type === 'tab-hidden' || type === 'tab-blurred') {
      attempt.tabSwitchCount = (attempt.tabSwitchCount || 0) + 1;
    } else if (type === 'fullscreen-exit') {
      attempt.fullscreenExitCount = (attempt.fullscreenExitCount || 0) + 1;
      attempt.fullscreenStatus = false;
    } else if (type === 'camera-revoked') {
      attempt.cameraPermission = false;
    } else if (type === 'microphone-revoked') {
      attempt.microphonePermission = false;
    }

    const { classification } = await proctoringService.recordSecurityEvent({
      candidateId: req.user._id,
      attemptId: attempt._id,
      eventType: type,
      details,
    });

    attempt.suspiciousEvents.push({
      type,
      severity: classification.severity,
      details: details || classification.description,
      timestamp: new Date(),
    });

    await attempt.save();

    res.status(200).json({
      success: true,
      tabSwitchCount: attempt.tabSwitchCount,
      fullscreenExitCount: attempt.fullscreenExitCount,
    });
  } catch (error) {
    next(error);
  }
};
