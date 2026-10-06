const mongoose = require('mongoose');

const questionAttemptSchema = new mongoose.Schema(
  {
    attempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssessmentAttempt',
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    questionNumber: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    selectedAnswer: {
      type: String, // 'A', 'B', 'C', 'D' or code submission
      default: '',
    },
    isCorrect: {
      type: Boolean,
      required: true,
      default: false,
    },
    marksAwarded: {
      type: Number,
      default: 0,
    },
    maxMarks: {
      type: Number,
      default: 1,
    },
    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
    transitionFrom: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
    },
    transitionTo: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
    },
    failureCountBefore: {
      type: Number,
      default: 0,
    },
    failureCountAfter: {
      type: Number,
      default: 0,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

questionAttemptSchema.index({ attempt: 1, question: 1 }, { unique: true });

module.exports = mongoose.model('QuestionAttempt', questionAttemptSchema);
