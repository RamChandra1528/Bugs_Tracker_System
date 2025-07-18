export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'tester' | 'manager';
  department?: string;
  timezone?: string;
  avatar?: string;
  isActive: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  createdAt: Date;
  permissions: string[];
}

export interface Department {
  id: string;
  name: string;
  description: string;
  managerId: string;
  members: string[];
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  departmentId: string;
  leadId: string;
  members: string[];
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  departmentId: string;
  teamId?: string;
  members: string[];
  createdAt: Date;
  createdBy: string;
  status: 'active' | 'inactive' | 'completed';
  priority: 'low' | 'medium' | 'high';
  startDate?: Date;
  endDate?: Date;
  sprintDuration?: number;
}

export interface Bug {
  id: string;
  title: string;
  description: string;
  projectId: string;
  reportedBy: string;
  assignedTo?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'reopened';
  severity: 'low' | 'medium' | 'high' | 'critical';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  attachments: string[];
  timeTracking: {
    estimatedHours?: number;
    actualHours?: number;
    startTime?: Date;
    endTime?: Date;
  };
  stepsToReproduce?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  environment?: {
    os?: string;
    browser?: string;
    version?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
}

export interface Comment {
  id: string;
  bugId: string;
  userId: string;
  content: string;
  isInternal: boolean;
  createdAt: Date;
  editedAt?: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'bug_assigned' | 'bug_updated' | 'comment_added' | 'status_changed';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedId?: string;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters: Record<string, any>;
  isPublic: boolean;
  createdAt: Date;
}

export interface DashboardWidget {
  id: string;
  userId: string;
  type: 'chart' | 'stats' | 'list';
  title: string;
  config: Record<string, any>;
  position: { x: number; y: number; w: number; h: number };
  createdAt: Date;
}

export interface TimeEntry {
  id: string;
  userId: string;
  bugId: string;
  description: string;
  hours: number;
  date: Date;
  createdAt: Date;
}

export interface Holiday {
  id: string;
  userId?: string;
  title: string;
  startDate: Date;
  endDate: Date;
  type: 'vacation' | 'sick' | 'holiday' | 'personal';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface DashboardStats {
  totalBugs: number;
  bugsByStatus: { [key: string]: number };
  bugsBySeverity: { [key: string]: number };
  bugsPerProject: { [key: string]: number };
  recentActivity: ActivityLog[];
  teamPerformance: {
    userId: string;
    name: string;
    bugsResolved: number;
    avgResolutionTime: number;
    bugsAssigned: number;
  }[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}