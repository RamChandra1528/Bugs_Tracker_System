import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { formatDate } from '../utils/formatters';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsResponse, usersResponse] = await Promise.all([
        apiService.getProjects(),
        apiService.getUsers()
      ]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.createProject({
        name: formData.name,
        description: formData.description,
        members: formData.members,
      });

      if (response.success) {
        setProjects([response.project, ...projects]);
        setFormData({ name: '', description: '', members: [] });
        setShowCreateModal(false);
        alert('Project created successfully!');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project');
    }
  };

  const handleMemberToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await apiService.deleteProject(projectId);
        if (response.success) {
          setProjects(projects.filter((project: any) => project._id !== projectId));
          alert('Project deleted successfully!');
        }
      } catch (error) {
        console.error('Failed to delete project:', error);
        alert('Failed to delete project');
      }
    }
  };

  const getUserName = (userId: string) => {
    const foundUser = users.find((u: any) => u._id === userId);
    return foundUser ? foundUser.name : 'Unknown User';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
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
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        {(user?.role === 'admin' || user?.role === 'developer') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <Card key={project._id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={20} />
              </button>
              {(user?.role === 'admin') && (
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="text-red-600 hover:text-red-700 text-sm ml-2"
                >
                  Delete
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-gray-400" />
                  <span>{project.members?.length || 0} members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Bug Statistics</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-medium">{project.stats?.totalBugs || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Open:</span>
                    <span className="font-medium text-red-600">{project.stats?.openBugs || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Progress:</span>
                    <span className="font-medium text-yellow-600">{project.stats?.inProgressBugs || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolved:</span>
                    <span className="font-medium text-green-600">{project.stats?.resolvedBugs || 0}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Team Members</h4>
                <div className="flex flex-wrap gap-1">
                  {project.members?.slice(0, 3).map((memberId: string) => (
                    <span key={memberId} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {getUserName(memberId)}
                    </span>
                  ))}
                  {project.members?.length > 3 && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      +{project.members.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xs text-gray-500">
                  Created by {project.createdBy?.name || 'Unknown'}
                </div>
                <Badge variant="status" value={project.status || 'active'} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Members
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {users.filter((u: any) => u._id !== user?.id).map((member: any) => (
                <label key={member._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={formData.members.includes(member._id)}
                    onChange={() => handleMemberToggle(member._id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                  </div>
                </label>
              ))}
            </div>
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
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;