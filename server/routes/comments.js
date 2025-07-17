const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getCommentsByBug,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

const router = express.Router();

router.get('/bug/:bugId', auth, getCommentsByBug);
router.post('/bug/:bugId', auth, createComment);
router.put('/:commentId', auth, updateComment);
router.delete('/:commentId', auth, deleteComment);

module.exports = router;