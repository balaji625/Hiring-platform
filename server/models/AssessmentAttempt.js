const mongoose = require('mongoose');

const assessmentAttemptSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
    },
    currentDifficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    failureCount: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    maxPossibleScore: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number, // 0 - 100
      default: 0,
    },
    highestDifficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'timed-out'],
      default: 'in-progress',
    },
    questionsAttemptedCount: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 15,
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    currentQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    currentQuestionType: {
      type: String,
      enum: ['mcq', 'coding'],
      default: 'mcq',
    },
    currentCodingQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingQuestion',
    },
    currentQuestionStartedAt: {
      type: Date,
      default: Date.now,
    },
    // Coding module metrics
    codingScore: {
      type: Number,
      default: 0,
    },
    maxCodingScore: {
      type: Number,
      default: 0,
    },
    codingProblemsSolved: {
      type: Number,
      default: 0,
    },
    codingProblemsAttempted: {
      type: Number,
      default: 0,
    },
    languagesUsed: {
      type: [String],
      default: [],
    },
    // Anti-cheating & Proctoring telemetry
    cameraPermission: {
      type: Boolean,
      default: true,
    },
    microphonePermission: {
      type: Boolean,
      default: true,
    },
    fullscreenStatus: {
      type: Boolean,
      default: true,
    },
    tabSwitchCount: {
      type: Number,
      default: 0,
    },
    fullscreenExitCount: {
      type: Number,
      default: 0,
    },
    suspiciousEvents: [
      {
        type: { type: String }, // 'tab-hidden', 'fullscreen-exit', 'camera-revoked', 'microphone-revoked', etc.
        severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        timestamp: { type: Date, default: Date.now },
        details: { type: String },
      },
    ],
    // Progression & Skill analytics caches
    difficultyHistory: [
      {
        questionNumber: Number,
        difficulty: String,
        result: String, // 'correct' or 'wrong'
        score: Number,
        topic: String,
        timeTaken: Number,
      },
    ],
    skillAnalysis: [
      {
        topic: String,
        attempted: Number,
        correct: Number,
        accuracy: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

assessmentAttemptSchema.index({ candidate: 1, assessment: 1 });
assessmentAttemptSchema.index({ status: 1 });

module.exports = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
