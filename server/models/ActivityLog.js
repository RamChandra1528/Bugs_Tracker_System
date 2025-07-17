const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  bug: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bug',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'created',
      'status_changed',
      'assigned',
      'unassigned',
      'priority_changed',
      'severity_changed',
      'commented',
      'attachment_added',
      'updated'
    ]
  },
  details: {
    type: String,
    required: true
  },
  oldValue: {
    type: String,
    default: null
  },
  newValue: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
activityLogSchema.index({ bug: 1, createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);