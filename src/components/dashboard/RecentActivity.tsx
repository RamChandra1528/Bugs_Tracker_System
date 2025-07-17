import React from 'react';
import { formatRelativeTime } from '../../utils/formatters';
import { User, Bug, ActivityLog } from '../../types';

interface RecentActivityProps {
  activities: ActivityLog[];
  users: User[];
  bugs: Bug[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, users, bugs }) => {
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getBugTitle = (bugId: string) => {
    const bug = bugs.find(b => b.id === bugId);
    return bug ? bug.title : 'Unknown Bug';
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'status_change':
        return '🔄';
      case 'created':
        return '✨';
      case 'assigned':
        return '👤';
      case 'commented':
        return '💬';
      default:
        return '📝';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="text-2xl">{getActivityIcon(activity.action)}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{getUserName(activity.userId)}</span>{' '}
                  {activity.details}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {getBugTitle(activity.bugId)} • {formatRelativeTime(activity.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;