const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
    },
    latestAttempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssessmentAttempt',
    },
    jobTitle: {
      type: String,
      default: 'Software Development Engineer (Full Stack)',
    },
    company: {
      type: String,
      default: 'Zelis Healthcare',
    },
    status: {
      type: String,
      enum: [
        'Applied',
        'Assessment',
        'Shortlisted',
        'L1 Interview',
        'L2 Interview',
        'Selected',
        'Offer',
        'Rejected',
      ],
      default: 'Applied',
    },
    assessmentScore: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    highestDifficulty: {
      type: String,
      default: 'easy',
    },
    recommendation: {
      type: String,
      enum: ['Strong Hire', 'Hire', 'Hold', 'Reject', 'Excellent', 'Strong', 'Good', 'Average', 'Under Review'],
      default: 'Under Review',
    },
    notes: {
      type: String,
      default: '',
    },
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ candidate: 1, jobTitle: 1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
