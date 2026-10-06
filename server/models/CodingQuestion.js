const mongoose = require('mongoose');

const codingQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    problemStatement: {
      type: String,
      required: [true, 'Problem statement is required'],
    },
    inputFormat: {
      type: String,
      default: '',
    },
    outputFormat: {
      type: String,
      default: '',
    },
    constraints: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
      default: 'easy',
    },
    topic: {
      type: String,
      default: 'Algorithms',
    },
    marks: {
      type: Number,
      default: function () {
        if (this.difficulty === 'hard') return 30;
        if (this.difficulty === 'medium') return 20;
        return 10;
      },
    },
    allowedLanguages: {
      type: [String],
      default: ['python', 'java', 'c', 'cpp', 'javascript'],
    },
    starterCode: {
      python: { type: String, default: 'def solution(input_data):\n    # Write your solution here\n    pass\n' },
      javascript: { type: String, default: 'function solution(inputData) {\n    // Write your solution here\n}\n' },
      java: { type: String, default: 'public class Solution {\n    public static void main(String[] args) {\n        // Write solution here\n    }\n}\n' },
      cpp: { type: String, default: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write solution here\n    return 0;\n}\n' },
      c: { type: String, default: '#include <stdio.h>\n\nint main() {\n    // Write solution here\n    return 0;\n}\n' },
    },
    sampleTestCases: [
      {
        input: { type: String, default: '' },
        expectedOutput: { type: String, default: '' },
        explanation: { type: String, default: '' },
      },
    ],
    hiddenTestCases: [
      {
        input: { type: String, default: '' },
        expectedOutput: { type: String, default: '' },
      },
    ],
    timeLimitMs: {
      type: Number,
      default: 2000,
    },
    memoryLimitMb: {
      type: Number,
      default: 256,
    },
    isAIGenerated: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

codingQuestionSchema.index({ difficulty: 1, topic: 1 });

module.exports = mongoose.model('CodingQuestion', codingQuestionSchema);
