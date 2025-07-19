const express = require('express');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.post('/upload-avatar', auth, upload.single('avatar'), uploadAvatar);

module.exports = router;