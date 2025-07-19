const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam
} = require('../controllers/teamController');

const router = express.Router();

router.get('/', auth, getAllTeams);
router.post('/', auth, authorize('admin', 'manager'), createTeam);
router.put('/:id', auth, authorize('admin', 'manager'), updateTeam);
router.delete('/:id', auth, authorize('admin'), deleteTeam);

module.exports = router;