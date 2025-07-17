import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useStorage } from '../hooks/useStorage';
import { Bug, Project, User } from '../types';
import Card from '../components/common/Card';
import BugChart from '../components/dashboard/BugChart';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';

const Reports = () => {
  const [bugs] = useStorage<Bug[]>('bugs', []);
  const [projects] = useStorage<Project[]>('projects', []);
  const [users] = useStorage<User[]>('users', []);

  // Generate data for charts
  const statusData = [
    { name: 'Open', value: bugs.filter(b => b.status === 'open').length, color: '#3B82F6' },
    { name: 'In Progress', value: bugs.filter(b => b.status === 'in-progress').length, color: '#8B5CF6' },
    { name: 'Resolved', value: bugs.filter(b => b.status === 'resolved').length, color: '#10B981' },
    { name: 'Closed', value: bugs.filter(b => b.status === 'closed').length, color: '#6B7280' },
  ];

  const severityData = [
    { name: 'Critical', value: bugs.filter(b => b.severity === 'critical').length, color: '#EF4444' },
    { name: 'High', value: bugs.filter(b => b.severity === 'high').length, color: '#F97316' },
    { name: 'Medium', value: bugs.filter(b => b.severity === 'medium').length, color: '#F59E0B' },
    { name: 'Low', value: bugs.filter(b => b.severity === 'low').length, color: '#10B981' },
  ];

  const projectData = projects.map(project => ({
    name: project.name,
    bugs: bugs.filter(bug => bug.projectId === project.id).length,
    open: bugs.filter(bug => bug.projectId === project.id && bug.status === 'open').length,
    resolved: bugs.filter(bug => bug.projectId === project.id && bug.status === 'resolved').length,
  }));

  const userPerformanceData = users.map(user => ({
    name: user.name,
    reported: bugs.filter(bug => bug.reportedBy === user.id).length,
    resolved: bugs.filter(bug => bug.assignedTo === user.id && bug.status === 'resolved').length,
  }));

  // Generate trend data (mock data for demo)
  const trendData = [
    { month: 'Jan', bugs: 12, resolved: 8 },
    { month: 'Feb', bugs: 19, resolved: 15 },
    { month: 'Mar', bugs: 16, resolved: 18 },
    { month: 'Apr', bugs: 23, resolved: 20 },
    { month: 'May', bugs: 18, resolved: 22 },
    { month: 'Jun', bugs: 25, resolved: 19 },
  ];

  const exportToCSV = () => {
    const csvData = bugs.map(bug => ({
      Title: bug.title,
      Project: projects.find(p => p.id === bug.projectId)?.name || 'Unknown',
      Status: bug.status,
      Severity: bug.severity,
      Priority: bug.priority,
      'Reported By': users.find(u => u.id === bug.reportedBy)?.name || 'Unknown',
      'Assigned To': bug.assignedTo ? users.find(u => u.id === bug.assignedTo)?.name || 'Unknown' : 'Unassigned',
      'Created At': new Date(bug.createdAt).toLocaleDateString(),
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bug-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <button
          onClick={exportToCSV}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={20} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Total Bugs</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{bugs.length}</p>
          <div className="flex items-center justify-center mt-2 text-sm text-green-600">
            <TrendingUp size={16} />
            <span className="ml-1">+12% from last month</span>
          </div>
        </Card>

        <Card className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Open Bugs</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {bugs.filter(b => b.status === 'open').length}
          </p>
          <div className="flex items-center justify-center mt-2 text-sm text-red-600">
            <TrendingUp size={16} />
            <span className="ml-1">+8% from last month</span>
          </div>
        </Card>

        <Card className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Resolved Bugs</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {bugs.filter(b => b.status === 'resolved').length}
          </p>
          <div className="flex items-center justify-center mt-2 text-sm text-green-600">
            <TrendingUp size={16} />
            <span className="ml-1">+15% from last month</span>
          </div>
        </Card>

        <Card className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Critical Issues</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {bugs.filter(b => b.severity === 'critical').length}
          </p>
          <div className="flex items-center justify-center mt-2 text-sm text-red-600">
            <TrendingDown size={16} />
            <span className="ml-1">-3% from last month</span>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BugChart data={statusData} title="Bug Distribution by Status" />
        <BugChart data={severityData} title="Bug Distribution by Severity" />
      </div>

      {/* Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bugs by Project</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bugs" fill="#3B82F6" name="Total Bugs" />
              <Bar dataKey="open" fill="#EF4444" name="Open Bugs" />
              <Bar dataKey="resolved" fill="#10B981" name="Resolved Bugs" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reported" fill="#F59E0B" name="Reported" />
              <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bug Trends Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="bugs" stroke="#EF4444" name="Bugs Reported" />
            <Line type="monotone" dataKey="resolved" stroke="#10B981" name="Bugs Resolved" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Statistics</h3>
          <div className="space-y-3">
            {projects.map(project => {
              const projectBugs = bugs.filter(bug => bug.projectId === project.id);
              const criticalBugs = projectBugs.filter(bug => bug.severity === 'critical');
              const resolvedBugs = projectBugs.filter(bug => bug.status === 'resolved');
              
              return (
                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600">
                      {projectBugs.length} total bugs • {criticalBugs.length} critical
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {projectBugs.length ? Math.round((resolvedBugs.length / projectBugs.length) * 100) : 0}%
                    </p>
                    <p className="text-xs text-gray-500">Resolution Rate</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
          <div className="space-y-3">
            {users.filter(user => user.role === 'developer').map(user => {
              const assignedBugs = bugs.filter(bug => bug.assignedTo === user.id);
              const resolvedBugs = assignedBugs.filter(bug => bug.status === 'resolved');
              
              return (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">
                      {assignedBugs.length} assigned bugs
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {assignedBugs.length ? Math.round((resolvedBugs.length / assignedBugs.length) * 100) : 0}%
                    </p>
                    <p className="text-xs text-gray-500">Resolution Rate</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;