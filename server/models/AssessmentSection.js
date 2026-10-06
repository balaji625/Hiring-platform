const mongoose = require('mongoose');

const assessmentSectionSchema = new mongoose.Schema(
  {
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['mcq', 'coding', 'sql', 'subjective'],
      default: 'mcq',
    },
    questionCount: {
      type: Number,
      required: true,
      default: 5,
    },
    totalMarks: {
      type: Number,
      required: true,
      default: 10,
    },
    cutoffPercentage: {
      type: Number,
      default: 60,
    },
    durationMinutes: {
      type: Number,
      default: 15,
    },
    order: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AssessmentSection', assessmentSectionSchema);
