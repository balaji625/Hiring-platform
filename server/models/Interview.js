const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    round: {
      type: String,
      enum: ['L1', 'L2', 'HR', 'Executive'],
      default: 'L1',
    },
    interviewer: {
      type: String,
      required: [true, 'Interviewer name or team is required'],
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'In Progress'],
      default: 'Scheduled',
    },
    meetingLink: {
      type: String,
      default: 'https://meet.zelis.internal/interview-room',
    },
    notes: {
      type: String,
      default: '',
    },
    rating: {
      type: Number, // 1 to 5
      default: 0,
    },
    technicalScore: {
      type: Number, // 0 to 100
      default: 0,
    },
    communicationScore: {
      type: Number, // 0 to 100
      default: 0,
    },
    recommendation: {
      type: String,
      enum: ['Strong Hire', 'Hire', 'Hold', 'Reject', 'Pending'],
      default: 'Pending',
    },
    scheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

interviewSchema.index({ candidate: 1, round: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
