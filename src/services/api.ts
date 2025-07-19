const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Auth endpoints
  async login(email: string, password: string, twoFactorCode?: string) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password, twoFactorCode }),
    });
    return this.handleResponse(response);
  }

  async register(name: string, email: string, password: string, role: string, department?: string) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, email, password, role, department }),
    });
    return this.handleResponse(response);
  }

  async getProfile() {
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateProfile(data: any) {
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await fetch(`${this.baseURL}/auth/change-password`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return this.handleResponse(response);
  }

  async enable2FA() {
    const response = await fetch(`${this.baseURL}/auth/enable-2fa`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async verify2FA(token: string) {
    const response = await fetch(`${this.baseURL}/auth/verify-2fa`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ token }),
    });
    return this.handleResponse(response);
  }

  async disable2FA(token: string) {
    const response = await fetch(`${this.baseURL}/auth/disable-2fa`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ token }),
    });
    return this.handleResponse(response);
  }

  // Department endpoints
  async getDepartments() {
    const response = await fetch(`${this.baseURL}/departments`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createDepartment(data: any) {
    const response = await fetch(`${this.baseURL}/departments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateDepartment(id: string, data: any) {
    const response = await fetch(`${this.baseURL}/departments/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Team endpoints
  async getTeams() {
    const response = await fetch(`${this.baseURL}/teams`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createTeam(data: any) {
    const response = await fetch(`${this.baseURL}/teams`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateTeam(id: string, data: any) {
    const response = await fetch(`${this.baseURL}/teams/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteTeam(id: string) {
    const response = await fetch(`${this.baseURL}/teams/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Upload avatar
  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${this.baseURL}/auth/upload-avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });
    return this.handleResponse(response);
  }

  // Users endpoints
  async getUsers() {
    const response = await fetch(`${this.baseURL}/users`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createUser(userData: any) {
    const response = await fetch(`${this.baseURL}/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async updateUser(userId: string, userData: any) {
    const response = await fetch(`${this.baseURL}/users/${userId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async deleteUser(userId: string) {
    const response = await fetch(`${this.baseURL}/users/${userId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Projects endpoints
  async getProjects() {
    const response = await fetch(`${this.baseURL}/projects`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getProject(projectId: string) {
    const response = await fetch(`${this.baseURL}/projects/${projectId}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createProject(projectData: any) {
    const response = await fetch(`${this.baseURL}/projects`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(projectData),
    });
    return this.handleResponse(response);
  }

  async updateProject(projectId: string, projectData: any) {
    const response = await fetch(`${this.baseURL}/projects/${projectId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(projectData),
    });
    return this.handleResponse(response);
  }

  async deleteProject(projectId: string) {
    const response = await fetch(`${this.baseURL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Bugs endpoints
  async getBugs(params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const response = await fetch(`${this.baseURL}/bugs${queryString ? `?${queryString}` : ''}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getBug(bugId: string) {
    const response = await fetch(`${this.baseURL}/bugs/${bugId}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createBug(bugData: any) {
    const response = await fetch(`${this.baseURL}/bugs`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(bugData),
    });
    return this.handleResponse(response);
  }

  async updateBug(bugId: string, bugData: any) {
    const response = await fetch(`${this.baseURL}/bugs/${bugId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(bugData),
    });
    return this.handleResponse(response);
  }

  async deleteBug(bugId: string) {
    const response = await fetch(`${this.baseURL}/bugs/${bugId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getBugStats() {
    const response = await fetch(`${this.baseURL}/bugs/stats`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Time tracking endpoints
  async logTime(bugId: string, hours: number, description: string) {
    const response = await fetch(`${this.baseURL}/time-entries`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ bugId, hours, description }),
    });
    return this.handleResponse(response);
  }

  async getTimeEntries(bugId?: string) {
    const queryString = bugId ? `?bugId=${bugId}` : '';
    const response = await fetch(`${this.baseURL}/time-entries${queryString}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Comments endpoints
  async getComments(bugId: string) {
    const response = await fetch(`${this.baseURL}/comments/bug/${bugId}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createComment(bugId: string, content: string, isInternal = false) {
    const response = await fetch(`${this.baseURL}/comments/bug/${bugId}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ content, isInternal }),
    });
    return this.handleResponse(response);
  }

  async updateComment(commentId: string, content: string) {
    const response = await fetch(`${this.baseURL}/comments/${commentId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ content }),
    });
    return this.handleResponse(response);
  }

  async deleteComment(commentId: string) {
    const response = await fetch(`${this.baseURL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Notifications endpoints
  async getNotifications() {
    const response = await fetch(`${this.baseURL}/notifications`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async markNotificationRead(notificationId: string) {
    const response = await fetch(`${this.baseURL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async markAllNotificationsRead() {
    const response = await fetch(`${this.baseURL}/notifications/read-all`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Saved searches endpoints
  async getSavedSearches() {
    const response = await fetch(`${this.baseURL}/saved-searches`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createSavedSearch(name: string, filters: any, isPublic = false) {
    const response = await fetch(`${this.baseURL}/saved-searches`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, filters, isPublic }),
    });
    return this.handleResponse(response);
  }

  async deleteSavedSearch(searchId: string) {
    const response = await fetch(`${this.baseURL}/saved-searches/${searchId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Dashboard widgets endpoints
  async getDashboardWidgets() {
    const response = await fetch(`${this.baseURL}/dashboard/widgets`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createDashboardWidget(widget: any) {
    const response = await fetch(`${this.baseURL}/dashboard/widgets`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(widget),
    });
    return this.handleResponse(response);
  }

  async updateDashboardWidget(widgetId: string, widget: any) {
    const response = await fetch(`${this.baseURL}/dashboard/widgets/${widgetId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(widget),
    });
    return this.handleResponse(response);
  }

  async deleteDashboardWidget(widgetId: string) {
    const response = await fetch(`${this.baseURL}/dashboard/widgets/${widgetId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Holiday/vacation endpoints
  async getHolidays() {
    const response = await fetch(`${this.baseURL}/holidays`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createHoliday(holiday: any) {
    const response = await fetch(`${this.baseURL}/holidays`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(holiday),
    });
    return this.handleResponse(response);
  }

  async updateHoliday(holidayId: string, holiday: any) {
    const response = await fetch(`${this.baseURL}/holidays/${holidayId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(holiday),
    });
    return this.handleResponse(response);
  }

  // Analytics endpoints
  async getBurndownChart(projectId: string, sprintId?: string) {
    const queryString = sprintId ? `?sprintId=${sprintId}` : '';
    const response = await fetch(`${this.baseURL}/analytics/burndown/${projectId}${queryString}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getDeveloperPerformance(userId?: string, timeframe = '30d') {
    const queryString = userId ? `?userId=${userId}&timeframe=${timeframe}` : `?timeframe=${timeframe}`;
    const response = await fetch(`${this.baseURL}/analytics/performance${queryString}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getAdvancedReports(type: string, params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const response = await fetch(`${this.baseURL}/analytics/reports/${type}${queryString ? `?${queryString}` : ''}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Session management
  async getSessions() {
    const response = await fetch(`${this.baseURL}/auth/sessions`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async revokeSession(sessionId: string) {
    const response = await fetch(`${this.baseURL}/auth/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async revokeAllSessions() {
    const response = await fetch(`${this.baseURL}/auth/sessions/revoke-all`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Audit logs
  async getAuditLogs(params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const response = await fetch(`${this.baseURL}/audit-logs${queryString ? `?${queryString}` : ''}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();