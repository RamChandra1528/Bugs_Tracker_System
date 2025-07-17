const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  getBugStats
} = require('../controllers/bugController');

const router = express.Router();

router.get('/', auth, getAllBugs);
router.get('/stats', auth, getBugStats);
router.get('/:id', auth, getBugById);
router.post('/', auth, createBug);
router.put('/:id', auth, updateBug);
router.delete('/:id', auth, deleteBug);

module.exports = router;