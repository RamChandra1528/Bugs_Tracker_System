const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');

const router = express.Router();

router.get('/', auth, getAllDepartments);
router.post('/', auth, authorize('admin', 'manager'), createDepartment);
router.put('/:id', auth, authorize('admin', 'manager'), updateDepartment);
router.delete('/:id', auth, authorize('admin'), deleteDepartment);

module.exports = router;