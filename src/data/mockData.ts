import { User, Project, Bug, Comment, ActivityLog } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@bugtracker.com',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Jane Developer',
    email: 'developer@bugtracker.com',
    role: 'developer',
    createdAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    name: 'Mike Tester',
    email: 'tester@bugtracker.com',
    role: 'tester',
    createdAt: new Date('2024-01-03'),
  },
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Main e-commerce application with payment integration',
    members: ['1', '2', '3'],
    createdAt: new Date('2024-01-01'),
    createdBy: '1',
    status: 'active',
  },
  {
    id: '2',
    name: 'Mobile App',
    description: 'React Native mobile application',
    members: ['2', '3'],
    createdAt: new Date('2024-01-05'),
    createdBy: '1',
    status: 'active',
  },
];

export const mockBugs: Bug[] = [
  {
    id: '1',
    title: 'Payment gateway timeout',
    description: 'Payment processing fails after 30 seconds',
    projectId: '1',
    reportedBy: '3',
    assignedTo: '2',
    status: 'in-progress',
    severity: 'high',
    priority: 'high',
    tags: ['payment', 'timeout'],
    attachments: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    title: 'UI button misalignment',
    description: 'Submit button is not properly aligned on mobile devices',
    projectId: '1',
    reportedBy: '3',
    assignedTo: '2',
    status: 'open',
    severity: 'low',
    priority: 'medium',
    tags: ['ui', 'mobile'],
    attachments: [],
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: '3',
    title: 'App crashes on startup',
    description: 'Application crashes when launching on Android 12',
    projectId: '2',
    reportedBy: '3',
    assignedTo: '2',
    status: 'resolved',
    severity: 'critical',
    priority: 'high',
    tags: ['crash', 'android'],
    attachments: [],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-13'),
  },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    bugId: '1',
    userId: '2',
    content: 'Looking into this issue. It seems to be related to the API timeout configuration.',
    createdAt: new Date('2024-01-10T10:00:00'),
  },
  {
    id: '2',
    bugId: '1',
    userId: '3',
    content: 'I can reproduce this consistently. Happens on both staging and production.',
    createdAt: new Date('2024-01-10T14:30:00'),
  },
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    bugId: '1',
    userId: '2',
    action: 'status_change',
    details: 'Changed status from Open to In Progress',
    createdAt: new Date('2024-01-10T09:00:00'),
  },
  {
    id: '2',
    bugId: '3',
    userId: '2',
    action: 'status_change',
    details: 'Changed status from In Progress to Resolved',
    createdAt: new Date('2024-01-13T15:00:00'),
  },
];

export const initializeStorage = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem('projects')) {
    localStorage.setItem('projects', JSON.stringify(mockProjects));
  }
  if (!localStorage.getItem('bugs')) {
    localStorage.setItem('bugs', JSON.stringify(mockBugs));
  }
  if (!localStorage.getItem('comments')) {
    localStorage.setItem('comments', JSON.stringify(mockComments));
  }
  if (!localStorage.getItem('activityLogs')) {
    localStorage.setItem('activityLogs', JSON.stringify(mockActivityLogs));
  }
};