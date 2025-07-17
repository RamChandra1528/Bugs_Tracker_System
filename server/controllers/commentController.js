const Comment = require('../models/Comment');
const ActivityLog = require('../models/ActivityLog');

const getCommentsByBug = async (req, res) => {
  try {
    const comments = await Comment.find({ bug: req.params.bugId })
      .populate('user', 'name email role')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      comments
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const createComment = async (req, res) => {
  try {
    const { content, isInternal } = req.body;
    const { bugId } = req.params;

    const comment = await Comment.create({
      bug: bugId,
      user: req.user.id,
      content,
      isInternal: isInternal || false
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name email role');

    // Log activity
    await ActivityLog.create({
      bug: bugId,
      user: req.user.id,
      action: 'commented',
      details: `Added a comment: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`
    });

    res.status(201).json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment or is admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = content;
    comment.editedAt = new Date();
    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name email role');

    res.json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment or is admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  getCommentsByBug,
  createComment,
  updateComment,
  deleteComment
};