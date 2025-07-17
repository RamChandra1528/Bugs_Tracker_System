export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'tester';
  avatar?: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdAt: Date;
  createdBy: string;
  status: 'active' | 'inactive';
}

export interface Bug {
  id: string;
  title: string;
  description: string;
  projectId: string;
  reportedBy: string;
  assignedTo?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  bugId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface ActivityLog {
  id: string;
  bugId: string;
  userId: string;
  action: string;
  details: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalBugs: number;
  bugsByStatus: { [key: string]: number };
  bugsBySeverity: { [key: string]: number };
  bugsPerProject: { [key: string]: number };
  recentActivity: ActivityLog[];
}