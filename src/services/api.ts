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
  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse(response);
  }

  async register(name: string, email: string, password: string, role: string) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, email, password, role }),
    });
    return this.handleResponse(response);
  }

  async getProfile() {
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateProfile(data: { name: string; email: string }) {
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
}

export const apiService = new ApiService();