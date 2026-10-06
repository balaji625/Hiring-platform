const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['mcq', 'coding'],
      default: 'mcq',
    },
    options: [
      {
        id: {
          type: String, // 'A', 'B', 'C', 'D'
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
      },
    ],
    correctAnswer: {
      type: String, // 'A', 'B', 'C', or 'D'
      required: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      enum: ['DSA', 'SQL', 'OOP', 'DBMS', 'OS', 'Computer Networks', 'Problem Solving', 'General'],
      default: 'DSA',
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    marks: {
      type: Number,
      required: true,
      default: function () {
        if (this.difficulty === 'hard') return 3;
        if (this.difficulty === 'medium') return 2;
        return 1;
      },
    },
    explanation: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    codingDetails: {
      problemStatement: String,
      inputFormat: String,
      outputFormat: String,
      constraints: String,
      sampleInput: String,
      sampleOutput: String,
      testCases: [
        {
          input: String,
          expectedOutput: String,
          isHidden: Boolean,
        },
      ],
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

// Indexing for rapid adaptive lookup
questionSchema.index({ topic: 1, difficulty: 1 });
questionSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);
