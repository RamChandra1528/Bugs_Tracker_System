const Team = require('../models/Team');
const Department = require('../models/Department');

const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('departmentId', 'name')
      .populate('leadId', 'name email role')
      .populate('members', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      teams
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const createTeam = async (req, res) => {
  try {
    const { name, description, departmentId, leadId, members } = req.body;

    const team = await Team.create({
      name,
      description,
      departmentId,
      leadId,
      members: members || []
    });

    const populatedTeam = await Team.findById(team._id)
      .populate('departmentId', 'name')
      .populate('leadId', 'name email role')
      .populate('members', 'name email role');

    res.status(201).json({
      success: true,
      team: populatedTeam
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const updateTeam = async (req, res) => {
  try {
    const { name, description, leadId, members } = req.body;

    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { name, description, leadId, members },
      { new: true, runValidators: true }
    ).populate('departmentId', 'name')
     .populate('leadId', 'name email role')
     .populate('members', 'name email role');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({
      success: true,
      team
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam
};