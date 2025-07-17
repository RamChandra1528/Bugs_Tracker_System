const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

const router = express.Router();

router.get('/', auth, getAllProjects);
router.get('/:id', auth, getProjectById);
router.post('/', auth, authorize('admin', 'developer'), createProject);
router.put('/:id', auth, authorize('admin', 'developer'), updateProject);
router.delete('/:id', auth, authorize('admin'), deleteProject);

module.exports = router;