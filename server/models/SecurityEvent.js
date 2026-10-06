const mongoose = require('mongoose');

const securityEventSchema = new mongoose.Schema(
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
    eventType: {
      type: String,
      enum: [
        'tab-hidden',
        'tab-blurred',
        'fullscreen-exit',
        'camera-revoked',
        'microphone-revoked',
        'multiple-faces',
        'no-face',
        'face-changed',
        'copy-paste',
        'devtools-opened',
        'unusual-activity',
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    details: {
      type: String,
      default: '',
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

securityEventSchema.index({ attempt: 1, eventType: 1 });

module.exports = mongoose.model('SecurityEvent', securityEventSchema);
