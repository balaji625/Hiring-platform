const mongoose = require('mongoose');

const recruiterActionSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    actionType: {
      type: String,
      enum: [
        'STATUS_CHANGE',
        'INTERVIEW_SCHEDULED',
        'ASSESSMENT_CREATED',
        'NOTE_ADDED',
        'REPORT_GENERATED',
        'CANDIDATE_SHORTLISTED',
        'OFFER_EXTENDED',
      ],
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RecruiterAction', recruiterActionSchema);
