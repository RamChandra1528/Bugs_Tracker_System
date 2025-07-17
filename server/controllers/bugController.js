const Bug = require('../models/Bug');
const ActivityLog = require('../models/ActivityLog');

const logActivity = async (bugId, userId, action, details, oldValue = null, newValue = null) => {
  try {
    await ActivityLog.create({
      bug: bugId,
      user: userId,
      action,
      details,
      oldValue,
      newValue
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

const getAllBugs = async (req, res) => {
  try {
    const { 
      status, 
      severity, 
      priority, 
      project, 
      assignedTo, 
      reportedBy,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (priority) filter.priority = priority;
    if (project) filter.project = project;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (reportedBy) filter.reportedBy = reportedBy;

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const bugs = await Bug.find(filter)
      .populate('project', 'name')
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Bug.countDocuments(filter);

    res.json({
      success: true,
      bugs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getBugById = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('project', 'name description')
      .populate('reportedBy', 'name email role')
      .populate('assignedTo', 'name email role');

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    // Get comments and activity logs
    const Comment = require('../models/Comment');
    const comments = await Comment.find({ bug: bug._id })
      .populate('user', 'name email role')
      .sort({ createdAt: 1 });

    const activities = await ActivityLog.find({ bug: bug._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      bug: {
        ...bug.toObject(),
        comments,
        activities
      }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const createBug = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      severity,
      priority,
      tags,
      stepsToReproduce,
      expectedBehavior,
      actualBehavior,
      environment
    } = req.body;

    const bug = await Bug.create({
      title,
      description,
      project,
      reportedBy: req.user.id,
      assignedTo: assignedTo || null,
      severity,
      priority,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      stepsToReproduce,
      expectedBehavior,
      actualBehavior,
      environment
    });

    const populatedBug = await Bug.findById(bug._id)
      .populate('project', 'name')
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email');

    // Log activity
    await logActivity(
      bug._id,
      req.user.id,
      'created',
      `Bug "${title}" was created`
    );

    if (assignedTo) {
      await logActivity(
        bug._id,
        req.user.id,
        'assigned',
        `Bug assigned to ${populatedBug.assignedTo.name}`
      );
    }

    res.status(201).json({
      success: true,
      bug: populatedBug
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const updateBug = async (req, res) => {
  try {
    const bugId = req.params.id;
    const updates = req.body;
    
    const currentBug = await Bug.findById(bugId)
      .populate('assignedTo', 'name email');

    if (!currentBug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    // Check permissions
    const canUpdate = req.user.role === 'admin' || 
                     req.user.role === 'developer' ||
                     currentBug.reportedBy.toString() === req.user.id ||
                     (currentBug.assignedTo && currentBug.assignedTo._id.toString() === req.user.id);

    if (!canUpdate) {
      return res.status(403).json({ message: 'Not authorized to update this bug' });
    }

    // Track changes for activity log
    const changes = [];
    
    if (updates.status && updates.status !== currentBug.status) {
      changes.push({
        action: 'status_changed',
        details: `Status changed from ${currentBug.status} to ${updates.status}`,
        oldValue: currentBug.status,
        newValue: updates.status
      });
    }

    if (updates.assignedTo !== undefined && updates.assignedTo !== currentBug.assignedTo?.toString()) {
      if (updates.assignedTo) {
        const User = require('../models/User');
        const newAssignee = await User.findById(updates.assignedTo);
        changes.push({
          action: 'assigned',
          details: `Bug assigned to ${newAssignee.name}`,
          oldValue: currentBug.assignedTo?.name || 'Unassigned',
          newValue: newAssignee.name
        });
      } else {
        changes.push({
          action: 'unassigned',
          details: `Bug unassigned from ${currentBug.assignedTo?.name}`,
          oldValue: currentBug.assignedTo?.name,
          newValue: 'Unassigned'
        });
      }
    }

    if (updates.priority && updates.priority !== currentBug.priority) {
      changes.push({
        action: 'priority_changed',
        details: `Priority changed from ${currentBug.priority} to ${updates.priority}`,
        oldValue: currentBug.priority,
        newValue: updates.priority
      });
    }

    if (updates.severity && updates.severity !== currentBug.severity) {
      changes.push({
        action: 'severity_changed',
        details: `Severity changed from ${currentBug.severity} to ${updates.severity}`,
        oldValue: currentBug.severity,
        newValue: updates.severity
      });
    }

    // Update bug
    const updatedBug = await Bug.findByIdAndUpdate(
      bugId,
      updates,
      { new: true, runValidators: true }
    ).populate('project', 'name')
     .populate('reportedBy', 'name email')
     .populate('assignedTo', 'name email');

    // Log all changes
    for (const change of changes) {
      await logActivity(
        bugId,
        req.user.id,
        change.action,
        change.details,
        change.oldValue,
        change.newValue
      );
    }

    res.json({
      success: true,
      bug: updatedBug
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const deleteBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    // Check permissions
    const canDelete = req.user.role === 'admin' || 
                     bug.reportedBy.toString() === req.user.id;

    if (!canDelete) {
      return res.status(403).json({ message: 'Not authorized to delete this bug' });
    }

    // Delete related data
    const Comment = require('../models/Comment');
    await Comment.deleteMany({ bug: req.params.id });
    await ActivityLog.deleteMany({ bug: req.params.id });
    await Bug.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Bug deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getBugStats = async (req, res) => {
  try {
    const stats = await Bug.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
          critical: { $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$severity', 'medium'] }, 1, 0] } },
          low: { $sum: { $cond: [{ $eq: ['$severity', 'low'] }, 1, 0] } }
        }
      }
    ]);

    const statusStats = await Bug.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const severityStats = await Bug.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    const projectStats = await Bug.aggregate([
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'projectInfo'
        }
      },
      { $unwind: '$projectInfo' },
      { $group: { _id: '$project', name: { $first: '$projectInfo.name' }, count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        overview: stats[0] || {
          total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0,
          critical: 0, high: 0, medium: 0, low: 0
        },
        byStatus: statusStats,
        bySeverity: severityStats,
        byProject: projectStats
      }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  getBugStats
};