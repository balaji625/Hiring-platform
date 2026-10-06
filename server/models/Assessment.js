const mongoose = require('mongoose');

const sectionSubSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: String, required: true },
  type: { type: String, enum: ['mcq', 'coding', 'sql', 'logical'], default: 'mcq' },
  questionCount: { type: Number, default: 5 },
  marks: { type: Number, default: 10 },
  cutoffPercentage: { type: Number, default: 60 },
  durationMinutes: { type: Number, default: 15 },
});

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assessment title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'Software Development Engineer',
    },
    experienceLevel: {
      type: String,
      default: 'Fresher / Entry Level',
    },
    duration: {
      type: Number, // Duration in minutes
      required: [true, 'Duration in minutes is required'],
      default: 45,
    },
    topics: {
      type: [String],
      required: [true, 'At least one topic is required'],
      default: ['DSA', 'SQL', 'OOP', 'DBMS'],
    },
    questionCount: {
      type: Number,
      required: true,
      default: 15,
    },
    passingScore: {
      type: Number, // percentage, e.g. 60
      default: 60,
    },
    negativeMarking: {
      type: Boolean,
      default: false,
    },
    proctoringLevel: {
      type: String,
      enum: ['standard', 'strict'],
      default: 'strict',
    },
    codingRequired: {
      type: Boolean,
      default: true,
    },
    allowedLanguages: {
      type: [String],
      default: ['python', 'java', 'c', 'cpp', 'javascript'],
    },
    sections: [sectionSubSchema],
    difficultyConfig: {
      startDifficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy',
      },
      consecutiveFailuresToDowngrade: {
        type: Number,
        default: 2,
      },
      marks: {
        easy: { type: Number, default: 1 },
        medium: { type: Number, default: 2 },
        hard: { type: Number, default: 3 },
      },
    },
    difficultyDistribution: {
      easy: { type: Number, default: 40 },
      medium: { type: Number, default: 40 },
      hard: { type: Number, default: 20 },
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'published',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Assessment', assessmentSchema);
