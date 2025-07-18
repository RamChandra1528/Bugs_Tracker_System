import React, { useState, useEffect } from 'react';
import { Bug, FolderOpen, Users, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import BugChart from '../components/dashboard/BugChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import { apiService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBugs: 0,
    openBugs: 0,
    resolvedBugs: 0,
    criticalBugs: 0,
    totalProjects: 0,
    totalUsers: 0
  });
  const [chartData, setChartData] = useState({
    statusData: [],
    severityData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load bug statistics
      const bugStatsResponse = await apiService.getBugStats();
      if (bugStatsResponse.success) {
        const { overview, byStatus, bySeverity } = bugStatsResponse.stats;
        
        setStats({
          totalBugs: overview.total,
          openBugs: overview.open,
          resolvedBugs: overview.resolved,
          criticalBugs: overview.critical,
          totalProjects: 0, // Will be updated below
          totalUsers: 0 // Will be updated below
        });

        // Format chart data
        const statusData = byStatus.map((item: any) => ({
          name: item._id.charAt(0).toUpperCase() + item._id.slice(1).replace('-', ' '),
          value: item.count,
          color: getStatusColor(item._id)
        }));

        const severityData = bySeverity.map((item: any) => ({
          name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
          value: item.count,
          color: getSeverityColor(item._id)
        }));

        setChartData({ statusData, severityData });
      }

      // Load projects count
      const projectsResponse = await apiService.getProjects();
      if (projectsResponse.success) {
        setStats(prev => ({ ...prev, totalProjects: projectsResponse.projects.length }));
      }

      // Load users count
      const usersResponse = await apiService.getUsers();
      if (usersResponse.success) {
        setStats(prev => ({ ...prev, totalUsers: usersResponse.users.length }));
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#3B82F6';
      case 'in-progress': return '#8B5CF6';
      case 'resolved': return '#10B981';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#EF4444';
      case 'high': return '#F97316';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
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
          value={stats.totalBugs}
          icon={Bug}
          color="blue"
          change={{ value: 12, type: 'increase' }}
        />
        <StatsCard
          title="Open Bugs"
          value={stats.openBugs}
          icon={AlertTriangle}
          color="red"
          change={{ value: 8, type: 'increase' }}
        />
        <StatsCard
          title="Projects"
          value={stats.totalProjects}
          icon={FolderOpen}
          color="green"
          change={{ value: 5, type: 'increase' }}
        />
        <StatsCard
          title="Team Members"
          value={stats.totalUsers}
          icon={Users}
          color="purple"
          change={{ value: 2, type: 'increase' }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BugChart data={chartData.statusData} title="Bugs by Status" />
        <BugChart data={chartData.severityData} title="Bugs by Severity" />
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-gray-500">
          <Activity size={48} className="mx-auto mb-4 opacity-50" />
          <p>Activity tracking will be available soon</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;