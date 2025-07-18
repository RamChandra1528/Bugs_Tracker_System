import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { apiService } from '../services/api';
import Card from '../components/common/Card';
import BugChart from '../components/dashboard/BugChart';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';

const Reports = () => {
  const [stats, setStats] = useState({
    totalBugs: 0,
    openBugs: 0,
    resolvedBugs: 0,
    criticalBugs: 0
  });
  const [chartData, setChartData] = useState({
    statusData: [],
    severityData: [],
    projectData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      
      // Load bug statistics
      const bugStatsResponse = await apiService.getBugStats();
      if (bugStatsResponse.success) {
        const { overview, byStatus, bySeverity, byProject } = bugStatsResponse.stats;
        
        setStats({
          totalBugs: overview.total,
          openBugs: overview.open,
          resolvedBugs: overview.resolved,
          criticalBugs: overview.critical
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

        const projectData = byProject.map((item: any) => ({
          name: item.name,
          bugs: item.count,
          open: Math.floor(item.count * 0.3), // Mock data
          resolved: Math.floor(item.count * 0.6) // Mock data
        }));

        setChartData({ statusData, severityData, projectData });
      }
    } catch (error) {
      console.error('Failed to load reports data:', error);
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

  const exportToCSV = async () => {
    try {
      const bugsResponse = await apiService.getBugs();
      if (bugsResponse.success) {
        const csvData = bugsResponse.bugs.map((bug: any) => ({
          Title: bug.title,
          Project: bug.project?.name || 'Unknown',
          Status: bug.status,
          Severity: bug.severity,
          Priority: bug.priority,
          'Reported By': bug.reportedBy?.name || 'Unknown',
          'Assigned To': bug.assignedTo?.name || 'Unassigned',
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
      }
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  // Generate trend data (mock data for demo)
  const trendData = [
    { month: 'Jan', bugs: 12, resolved: 8 },
    { month: 'Feb', bugs: 19, resolved: 15 },
    { month: 'Mar', bugs: 16, resolved: 18 },
    { month: 'Apr', bugs: 23, resolved: 20 },
    { month: 'May', bugs: 18, resolved: 22 },
    { month: 'Jun', bugs: 25, resolved: 19 },
  ];

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
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalBugs}</p>
          <div className="flex items-center justify-center mt-2 text-sm text-green-600">
            <TrendingUp size={16} />
            <span className="ml-1">+12% from last month</span>
          </div>
        </Card>

        <Card className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Open Bugs</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.openBugs}</p>
          <div className="flex items-center justify-center mt-2 text-sm text-red-600">
            <TrendingUp size={16} />
            <span className="ml-1">+8% from last month</span>
          </div>
        </Card>

        <Card className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Resolved Bugs</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolvedBugs}</p>
          <div className="flex items-center justify-center mt-2 text-sm text-green-600">
            <TrendingUp size={16} />
            <span className="ml-1">+15% from last month</span>
          </div>
        </Card>

        <Card className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Critical Issues</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.criticalBugs}</p>
          <div className="flex items-center justify-center mt-2 text-sm text-red-600">
            <TrendingDown size={16} />
            <span className="ml-1">-3% from last month</span>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BugChart data={chartData.statusData} title="Bug Distribution by Status" />
        <BugChart data={chartData.severityData} title="Bug Distribution by Severity" />
      </div>

      {/* Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bugs by Project</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.projectData}>
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
      </div>
    </div>
  );
};

export default Reports;