const Department = require('../models/Department');

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('managerId', 'name email role')
      .populate('members', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      departments
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, description, managerId, members } = req.body;

    const department = await Department.create({
      name,
      description,
      managerId,
      members: members || []
    });

    const populatedDepartment = await Department.findById(department._id)
      .populate('managerId', 'name email role')
      .populate('members', 'name email role');

    res.status(201).json({
      success: true,
      department: populatedDepartment
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { name, description, managerId, members } = req.body;

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name, description, managerId, members },
      { new: true, runValidators: true }
    ).populate('managerId', 'name email role')
     .populate('members', 'name email role');

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({
      success: true,
      department
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
};