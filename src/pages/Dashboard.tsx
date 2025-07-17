import React, { useState, useEffect } from 'react';
import { Bug, FolderOpen, Users, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import BugChart from '../components/dashboard/BugChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import { useStorage } from '../hooks/useStorage';
import { User, Project, Bug as BugType, ActivityLog } from '../types';

const Dashboard = () => {
  const [users] = useStorage<User[]>('users', []);
  const [projects] = useStorage<Project[]>('projects', []);
  const [bugs] = useStorage<BugType[]>('bugs', []);
  const [activities] = useStorage<ActivityLog[]>('activityLogs', []);

  const totalBugs = bugs.length;
  const openBugs = bugs.filter(bug => bug.status === 'open').length;
  const criticalBugs = bugs.filter(bug => bug.severity === 'critical').length;
  const resolvedBugs = bugs.filter(bug => bug.status === 'resolved').length;

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

  const recentActivities = activities
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Activity size={16} />
          <span>Real-time updates</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Bugs"
          value={totalBugs}
          icon={Bug}
          color="blue"
          change={{ value: 12, type: 'increase' }}
        />
        <StatsCard
          title="Open Bugs"
          value={openBugs}
          icon={AlertTriangle}
          color="red"
          change={{ value: 8, type: 'increase' }}
        />
        <StatsCard
          title="Projects"
          value={projects.length}
          icon={FolderOpen}
          color="green"
          change={{ value: 5, type: 'increase' }}
        />
        <StatsCard
          title="Team Members"
          value={users.length}
          icon={Users}
          color="purple"
          change={{ value: 2, type: 'increase' }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BugChart data={statusData} title="Bugs by Status" />
        <BugChart data={severityData} title="Bugs by Severity" />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={recentActivities} users={users} bugs={bugs} />
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h3>
          <div className="space-y-4">
            {projects.map((project) => {
              const projectBugs = bugs.filter(bug => bug.projectId === project.id);
              const openProjectBugs = projectBugs.filter(bug => bug.status === 'open');
              
              return (
                <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.members.length} members</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{projectBugs.length}</p>
                    <p className="text-sm text-gray-600">{openProjectBugs.length} open</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;