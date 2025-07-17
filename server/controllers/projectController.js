const Project = require('../models/Project');
const Bug = require('../models/Bug');

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('members', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Add bug statistics for each project
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const bugs = await Bug.find({ project: project._id });
        const stats = {
          totalBugs: bugs.length,
          openBugs: bugs.filter(bug => bug.status === 'open').length,
          inProgressBugs: bugs.filter(bug => bug.status === 'in-progress').length,
          resolvedBugs: bugs.filter(bug => bug.status === 'resolved').length,
          closedBugs: bugs.filter(bug => bug.status === 'closed').length,
          criticalBugs: bugs.filter(bug => bug.severity === 'critical').length
        };

        return {
          ...project.toObject(),
          stats
        };
      })
    );

    res.json({
      success: true,
      projects: projectsWithStats
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email role')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Get project bugs
    const bugs = await Bug.find({ project: project._id })
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      project: {
        ...project.toObject(),
        bugs
      }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description, members, priority, startDate, endDate } = req.body;

    const project = await Project.create({
      name,
      description,
      members: members || [],
      createdBy: req.user.id,
      priority,
      startDate,
      endDate
    });

    const populatedProject = await Project.findById(project._id)
      .populate('members', 'name email role')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      project: populatedProject
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { name, description, members, status, priority, endDate } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, members, status, priority, endDate },
      { new: true, runValidators: true }
    ).populate('members', 'name email role')
     .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin or project creator
    if (req.user.role !== 'admin' && project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    // Check if project has bugs
    const bugCount = await Bug.countDocuments({ project: req.params.id });
    if (bugCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete project with existing bugs. Please resolve or move bugs first.' 
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};