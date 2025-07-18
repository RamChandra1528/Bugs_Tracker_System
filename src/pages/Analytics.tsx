import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Target, Users, Download, Calendar } from 'lucide-react';
import { apiService } from '../services/api';
import Card from '../components/common/Card';
import StatsCard from '../components/dashboard/StatsCard';

const Analytics = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [projects, setProjects] = useState([]);
  const [burndownData, setBurndownData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const burndownChartData = [
    { day: 'Day 1', planned: 100, actual: 100 },
    { day: 'Day 2', planned: 95, actual: 98 },
    { day: 'Day 3', planned: 90, actual: 92 },
    { day: 'Day 4', planned: 85, actual: 88 },
    { day: 'Day 5', planned: 80, actual: 82 },
    { day: 'Day 6', planned: 75, actual: 78 },
    { day: 'Day 7', planned: 70, actual: 72 },
    { day: 'Day 8', planned: 65, actual: 68 },
    { day: 'Day 9', planned: 60, actual: 62 },
    { day: 'Day 10', planned: 55, actual: 58 },
    { day: 'Day 11', planned: 50, actual: 52 },
    { day: 'Day 12', planned: 45, actual: 48 },
    { day: 'Day 13', planned: 40, actual: 42 },
    { day: 'Day 14', planned: 35, actual: 38 },
    { day: 'Day 15', planned: 30, actual: 32 },
  ];

  const developerPerformanceData = [
    { name: 'John Doe', bugsResolved: 45, avgResolutionTime: 2.3, bugsAssigned: 52 },
    { name: 'Jane Smith', bugsResolved: 38, avgResolutionTime: 1.8, bugsAssigned: 41 },
    { name: 'Mike Johnson', bugsResolved: 42, avgResolutionTime: 2.1, bugsAssigned: 48 },
    { name: 'Sarah Wilson', bugsResolved: 35, avgResolutionTime: 2.5, bugsAssigned: 39 },
    { name: 'David Brown', bugsResolved: 40, avgResolutionTime: 1.9, bugsAssigned: 44 },
  ];

  const resolutionTimeData = [
    { severity: 'Critical', avgTime: 4.2, target: 4.0 },
    { severity: 'High', avgTime: 8.5, target: 8.0 },
    { severity: 'Medium', avgTime: 16.3, target: 16.0 },
    { severity: 'Low', avgTime: 32.1, target: 32.0 },
  ];

  const teamProductivityData = [
    { team: 'Frontend', velocity: 85, capacity: 100 },
    { team: 'Backend', velocity: 92, capacity: 100 },
    { team: 'Mobile', velocity: 78, capacity: 100 },
    { team: 'QA', velocity: 88, capacity: 100 },
    { team: 'DevOps', velocity: 95, capacity: 100 },
  ];

  useEffect(() => {
    loadData();
  }, [selectedProject, selectedTimeframe]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load projects
      const projectsResponse = await apiService.getProjects();
      if (projectsResponse.success) {
        setProjects(projectsResponse.projects);
      }

      // Load analytics data
      if (selectedProject) {
        const burndownResponse = await apiService.getBurndownChart(selectedProject);
        if (burndownResponse.success) {
          setBurndownData(burndownResponse.data);
        }
      }

      const performanceResponse = await apiService.getDeveloperPerformance(undefined, selectedTimeframe);
      if (performanceResponse.success) {
        setPerformanceData(performanceResponse.data);
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const reportData = {
        project: selectedProject,
        timeframe: selectedTimeframe,
        burndown: burndownChartData,
        performance: developerPerformanceData,
        resolutionTime: resolutionTimeData,
        teamProductivity: teamProductivityData,
      };

      const csvContent = [
        'Analytics Report',
        `Generated: ${new Date().toLocaleDateString()}`,
        `Project: ${selectedProject || 'All Projects'}`,
        `Timeframe: ${selectedTimeframe}`,
        '',
        'Developer Performance:',
        'Name,Bugs Resolved,Avg Resolution Time,Bugs Assigned',
        ...developerPerformanceData.map(dev => 
          `${dev.name},${dev.bugsResolved},${dev.avgResolutionTime},${dev.bugsAssigned}`
        ),
        '',
        'Resolution Time by Severity:',
        'Severity,Average Time,Target Time',
        ...resolutionTimeData.map(item => 
          `${item.severity},${item.avgTime},${item.target}`
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export report:', error);
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
        <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Projects</option>
            {projects.map((project: any) => (
              <option key={project._id} value={project._id}>{project.name}</option>
            ))}
          </select>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={exportReport}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Sprint Velocity"
          value="87%"
          icon={TrendingUp}
          color="green"
          change={{ value: 5, type: 'increase' }}
        />
        <StatsCard
          title="Avg Resolution Time"
          value="2.3 days"
          icon={Clock}
          color="blue"
          change={{ value: 12, type: 'decrease' }}
        />
        <StatsCard
          title="Sprint Goal Achievement"
          value="92%"
          icon={Target}
          color="purple"
          change={{ value: 8, type: 'increase' }}
        />
        <StatsCard
          title="Team Capacity"
          value="88%"
          icon={Users}
          color="yellow"
          change={{ value: 3, type: 'increase' }}
        />
      </div>

      {/* Burndown Chart */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Sprint Burndown Chart</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>Current Sprint</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={burndownChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="planned" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Planned Progress"
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Actual Progress"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Developer Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Developer Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={developerPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bugsResolved" fill="#10B981" name="Bugs Resolved" />
              <Bar dataKey="bugsAssigned" fill="#3B82F6" name="Bugs Assigned" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Resolution Time by Severity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resolutionTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="severity" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgTime" fill="#F59E0B" name="Average Time (hours)" />
              <Bar dataKey="target" fill="#10B981" name="Target Time (hours)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Team Productivity */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Productivity & Capacity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={teamProductivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="team" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="velocity" fill="#8B5CF6" name="Velocity %" />
            <Bar dataKey="capacity" fill="#E5E7EB" name="Capacity %" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Performance Summary Table */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Developer Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Developer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bugs Resolved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Resolution Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {developerPerformanceData.map((dev, index) => {
                const successRate = Math.round((dev.bugsResolved / dev.bugsAssigned) * 100);
                const performance = successRate >= 90 ? 'Excellent' : successRate >= 80 ? 'Good' : successRate >= 70 ? 'Average' : 'Needs Improvement';
                const performanceColor = successRate >= 90 ? 'text-green-600' : successRate >= 80 ? 'text-blue-600' : successRate >= 70 ? 'text-yellow-600' : 'text-red-600';
                
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {dev.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{dev.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dev.bugsResolved}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dev.avgResolutionTime} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {successRate}%
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${performanceColor}`}>
                      {performance}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;