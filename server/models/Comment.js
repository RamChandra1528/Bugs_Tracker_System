const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  isInternal: {
    type: Boolean,
    default: false
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number
  }],
  editedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
commentSchema.index({ bug: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);