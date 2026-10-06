const mongoose = require('mongoose');

const codingSubmissionSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssessmentAttempt',
      required: true,
    },
    codingQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingQuestion',
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ['python', 'java', 'c', 'cpp', 'javascript'],
    },
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Compilation Error', 'Runtime Error'],
      default: 'Accepted',
    },
    sampleTestsPassed: {
      type: Number,
      default: 0,
    },
    totalSampleTests: {
      type: Number,
      default: 0,
    },
    hiddenTestsPassed: {
      type: Number,
      default: 0,
    },
    totalHiddenTests: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    maxScore: {
      type: Number,
      default: 10,
    },
    executionTimeMs: {
      type: Number,
      default: 0,
    },
    memoryKb: {
      type: Number,
      default: 0,
    },
    stdout: {
      type: String,
      default: '',
    },
    stderr: {
      type: String,
      default: '',
    },
    compileError: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

codingSubmissionSchema.index({ candidate: 1, codingQuestion: 1 });
codingSubmissionSchema.index({ attempt: 1 });

module.exports = mongoose.model('CodingSubmission', codingSubmissionSchema);
