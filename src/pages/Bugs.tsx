import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Bug as BugIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { formatDate } from '../utils/formatters';

const Bugs = () => {
  const { user } = useAuth();
  const [bugs, setBugs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    priority: 'medium' as 'low' | 'medium' | 'high',
    tags: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bugsResponse, projectsResponse, usersResponse] = await Promise.all([
        apiService.getBugs(),
        apiService.getProjects(),
        apiService.getUsers()
      ]);

      if (bugsResponse.success) {
        setBugs(bugsResponse.bugs);
      }
      if (projectsResponse.success) {
        setProjects(projectsResponse.projects);
      }
      if (usersResponse.success) {
        setUsers(usersResponse.users);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //         const response = await apiService.createBug({
  //       title: formData.title.trim(),
  //       description: formData.description.trim(),
  //       project: formData.project,
  //       assignedTo: formData.assignedTo || undefined,
  //       severity: formData.severity,
  //       priority: formData.priority,
  //       tags: typeof formData.tags === 'string'
  //         ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
  //         : [],
  //       reportedBy: user?.id, // Make sure you pass this too
  //     });


  //     if (response.success) {
  //       setBugs([response.bug, ...bugs]);
  //       setFormData({
  //         title: '',
  //         description: '',
  //         project: '',
  //         assignedTo: '',
  //         severity: 'medium',
  //         priority: 'medium',
  //         tags: '',
  //       });
  //       setShowCreateModal(false);
  //       alert('Bug reported successfully!');
  //     }
  //   } catch (error) {
  //     console.error('Failed to create bug:', error);
  //     alert('Failed to create bug');
  //   }
  // };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log('FormData:', formData);

  try {
    const response = await apiService.createBug({
      title: formData.title.trim(),
      description: formData.description.trim(),
      project: formData.project,
      assignedTo: formData.assignedTo || undefined,
      severity: formData.severity,
      priority: formData.priority,
      tags: typeof formData.tags === 'string'
        ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [],
      reportedBy: user?.id, // ✅ Required by backend
    });

    if (response.success) {
      // reset form
      setBugs([response.bug, ...bugs]);
      setFormData({ title: '', description: '', project: '', assignedTo: '', severity: 'medium', priority: 'medium', tags: '' });
      setShowCreateModal(false);
      alert('Bug reported successfully!');
    }
  } catch (error) {
    console.error('Failed to create bug:', error);
    alert('Failed to create bug');
  }
};

  const filteredBugs = bugs.filter((bug: any) => {
    const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bug.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bug.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || bug.severity === filterSeverity;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getUserName = (userId: string) => {
    const foundUser = users.find((u: any) => u._id === userId);
    return foundUser ? foundUser.name : 'Unknown User';
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find((p: any) => p._id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const updateBugStatus = async (bugId: string, newStatus: string) => {
    try {
      const response = await apiService.updateBug(bugId, { status: newStatus });
      if (response.success) {
        setBugs(prevBugs =>
          prevBugs.map((bug: any) =>
            bug._id === bugId ? { ...bug, status: newStatus } : bug
          )
        );
      }
    } catch (error) {
      console.error('Failed to update bug status:', error);
      alert('Failed to update bug status');
    }
  };

  const handleDeleteBug = async (bugId: string) => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        const response = await apiService.deleteBug(bugId);
        if (response.success) {
          setBugs(bugs.filter((bug: any) => bug._id !== bugId));
          alert('Bug deleted successfully!');
        }
      } catch (error) {
        console.error('Failed to delete bug:', error);
        alert('Failed to delete bug');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="h-6 bg-gray-200 rounded w-64 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bugs</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Report Bug</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bugs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Bug List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredBugs.map((bug: any) => (
          <Card key={bug._id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <BugIcon size={20} className="text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">{bug.title}</h3>
                  <Badge variant="status" value={bug.status} />
                  <Badge variant="severity" value={bug.severity} />
                  <Badge variant="priority" value={bug.priority} />
                </div>
                <p className="text-gray-600 mb-4">{bug.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>Project: {getProjectName(bug.project)}</span>
                  <span>Reported by: {getUserName(bug.reportedBy)}</span>
                  {bug.assignedTo && (
                    <span>Assigned to: {getUserName(bug.assignedTo)}</span>
                  )}
                  <span>Created: {formatDate(bug.createdAt)}</span>
                </div>

                {bug.tags && bug.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {bug.tags.map((tag: string, index: number) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                {(user?.role === 'admin' || user?.role === 'developer' || bug.assignedTo === user?.id) && (
                  <select
                    value={bug.status}
                    onChange={(e) => updateBugStatus(bug._id, e.target.value)}
                    className="text-sm px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                )}
                {(user?.role === 'admin' || bug.reportedBy === user?.id) && (
                  <button
                    onClick={() => handleDeleteBug(bug._id)}
                    className="text-red-600 hover:text-red-700 text-sm px-2 py-1 border border-red-300 rounded"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Bug Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Report New Bug"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Bug Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
                Project
              </label>
              <select
                id="project"
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a project</option>
                {projects.map((project: any) => (
                  <option key={project._id} value={project._id}>{project.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
                Assign To
              </label>
              <select
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Unassigned</option>
                {users.filter((u: any) => u.role === 'developer' || u.role === 'admin').map((user: any) => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select
                id="severity"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., frontend, api, mobile"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Report Bug
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Bugs;