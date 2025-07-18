import React, { useState, useEffect } from 'react';
import { Plus, Users, Building, UserCheck, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { formatDate } from '../utils/formatters';

const Teams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showCreateDeptModal, setShowCreateDeptModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('teams');
  
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    description: '',
    departmentId: '',
    leadId: '',
    members: [] as string[],
  });

  const [deptFormData, setDeptFormData] = useState({
    name: '',
    description: '',
    managerId: '',
    members: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teamsResponse, deptsResponse, usersResponse] = await Promise.all([
        apiService.getTeams(),
        apiService.getDepartments(),
        apiService.getUsers()
      ]);

      if (teamsResponse.success) setTeams(teamsResponse.teams);
      if (deptsResponse.success) setDepartments(deptsResponse.departments);
      if (usersResponse.success) setUsers(usersResponse.users);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.createTeam(teamFormData);
      if (response.success) {
        setTeams([response.team, ...teams]);
        setTeamFormData({ name: '', description: '', departmentId: '', leadId: '', members: [] });
        setShowCreateTeamModal(false);
      }
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.createDepartment(deptFormData);
      if (response.success) {
        setDepartments([response.department, ...departments]);
        setDeptFormData({ name: '', description: '', managerId: '', members: [] });
        setShowCreateDeptModal(false);
      }
    } catch (error) {
      console.error('Failed to create department:', error);
    }
  };

  const getUserName = (userId: string) => {
    const foundUser = users.find((u: any) => u._id === userId);
    return foundUser ? foundUser.name : 'Unknown User';
  };

  const getDepartmentName = (deptId: string) => {
    const dept = departments.find((d: any) => d._id === deptId);
    return dept ? dept.name : 'Unknown Department';
  };

  const handleMemberToggle = (userId: string, isTeam = true) => {
    if (isTeam) {
      setTeamFormData(prev => ({
        ...prev,
        members: prev.members.includes(userId)
          ? prev.members.filter(id => id !== userId)
          : [...prev.members, userId]
      }));
    } else {
      setDeptFormData(prev => ({
        ...prev,
        members: prev.members.includes(userId)
          ? prev.members.filter(id => id !== userId)
          : [...prev.members, userId]
      }));
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
        <div className="flex space-x-3">
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <>
              <button
                onClick={() => setShowCreateDeptModal(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Building size={20} />
                <span>New Department</span>
              </button>
              <button
                onClick={() => setShowCreateTeamModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Users size={20} />
                <span>New Team</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('teams')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'teams'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Teams ({teams.length})
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'departments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Departments ({departments.length})
          </button>
        </nav>
      </div>

      {/* Teams Tab */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team: any) => (
            <Card key={team._id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-600">{getDepartmentName(team.departmentId)}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <p className="text-gray-600 mb-4">{team.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Team Lead:</span>
                  <span className="font-medium">{getUserName(team.leadId)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Members:</span>
                  <span className="font-medium">{team.members?.length || 0}</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Team Members</h4>
                  <div className="flex flex-wrap gap-1">
                    {team.members?.slice(0, 4).map((memberId: string) => (
                      <span key={memberId} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {getUserName(memberId)}
                      </span>
                    ))}
                    {team.members?.length > 4 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        +{team.members.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t text-xs text-gray-500">
                  Created {formatDate(team.createdAt)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept: any) => (
            <Card key={dept._id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                    <p className="text-sm text-gray-600">Department</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <p className="text-gray-600 mb-4">{dept.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Manager:</span>
                  <span className="font-medium">{getUserName(dept.managerId)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Members:</span>
                  <span className="font-medium">{dept.members?.length || 0}</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Department Members</h4>
                  <div className="flex flex-wrap gap-1">
                    {dept.members?.slice(0, 4).map((memberId: string) => (
                      <span key={memberId} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {getUserName(memberId)}
                      </span>
                    ))}
                    {dept.members?.length > 4 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        +{dept.members.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t text-xs text-gray-500">
                  Created {formatDate(dept.createdAt)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Team Modal */}
      <Modal
        isOpen={showCreateTeamModal}
        onClose={() => setShowCreateTeamModal(false)}
        title="Create New Team"
        size="lg"
      >
        <form onSubmit={handleCreateTeam} className="space-y-6">
          <div>
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
              Team Name
            </label>
            <input
              type="text"
              id="teamName"
              value={teamFormData.name}
              onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="teamDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="teamDescription"
              value={teamFormData.description}
              onChange={(e) => setTeamFormData({ ...teamFormData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                id="department"
                value={teamFormData.departmentId}
                onChange={(e) => setTeamFormData({ ...teamFormData, departmentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept: any) => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="teamLead" className="block text-sm font-medium text-gray-700 mb-2">
                Team Lead
              </label>
              <select
                id="teamLead"
                value={teamFormData.leadId}
                onChange={(e) => setTeamFormData({ ...teamFormData, leadId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Team Lead</option>
                {users.filter((u: any) => u.role === 'manager' || u.role === 'developer').map((user: any) => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Members
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {users.filter((u: any) => u._id !== teamFormData.leadId).map((member: any) => (
                <label key={member._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={teamFormData.members.includes(member._id)}
                    onChange={() => handleMemberToggle(member._id, true)}
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
              onClick={() => setShowCreateTeamModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Team
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Department Modal */}
      <Modal
        isOpen={showCreateDeptModal}
        onClose={() => setShowCreateDeptModal(false)}
        title="Create New Department"
        size="lg"
      >
        <form onSubmit={handleCreateDepartment} className="space-y-6">
          <div>
            <label htmlFor="deptName" className="block text-sm font-medium text-gray-700 mb-2">
              Department Name
            </label>
            <input
              type="text"
              id="deptName"
              value={deptFormData.name}
              onChange={(e) => setDeptFormData({ ...deptFormData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="deptDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="deptDescription"
              value={deptFormData.description}
              onChange={(e) => setDeptFormData({ ...deptFormData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="deptManager" className="block text-sm font-medium text-gray-700 mb-2">
              Department Manager
            </label>
            <select
              id="deptManager"
              value={deptFormData.managerId}
              onChange={(e) => setDeptFormData({ ...deptFormData, managerId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Manager</option>
              {users.filter((u: any) => u.role === 'admin' || u.role === 'manager').map((user: any) => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Members
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {users.filter((u: any) => u._id !== deptFormData.managerId).map((member: any) => (
                <label key={member._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={deptFormData.members.includes(member._id)}
                    onChange={() => handleMemberToggle(member._id, false)}
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
              onClick={() => setShowCreateDeptModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Department
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Teams;