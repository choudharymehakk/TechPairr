import axios from 'axios';

// Use local backend for development, production backend for deployed app
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV 
    ? 'http://localhost:5000/api'  // Local development
    : 'https://mentora-backend-p9pf.onrender.com/api');  // Production (updated URL)

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// TYPES
// ============================================
export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  user_type: 'student' | 'faculty' | 'industry';
}

export interface LoginData {
  email: string;
  password: string;
}

// ============================================
// HEALTH & TEST ENDPOINTS
// ============================================
export const healthCheck = () => api.get('/health');
export const testDatabase = () => api.get('/test-db');

// ============================================
// AUTHENTICATION API
// ============================================
export const register = (data: RegisterData) => api.post('/register', data);
export const login = (data: LoginData) => api.post('/login', data);

// ============================================
// PROFILE API
// ============================================
export const createStudentProfile = (data: any) => api.post('/profile/student', data);
export const createFacultyProfile = (data: any) => api.post('/profile/faculty', data);
export const createIndustryProfile = (data: any) => api.post('/profile/industry', data);
export const getProfile = (userType: string, userId: string) => api.get(`/profile/${userType}/${userId}`);
export const checkProfileExists = (userType: string, userId: string) => api.get(`/profile/${userType}/${userId}`);

// ============================================
// EXPLORE / MATCHING API
// ============================================
export const getExploreMatches = (userId: string) => api.get(`/explore?user_id=${userId}`);

// ============================================
// PROJECT API
// ============================================
export const createProject = (data: any) => api.post('/projects', data);
export const getProjects = (params?: any) => api.get('/projects', { params });
export const getProject = (projectId: string) => api.get(`/projects/${projectId}`);
export const getUserProjects = (userId: string) => api.get(`/projects/user/${userId}`);
export const getProjectOwner = (projectId: string) => api.get(`/projects/${projectId}/owner`);
export const updateProject = (projectId: string, data: any) => api.put(`/projects/${projectId}`, data);
export const deleteProject = (projectId: string) => api.delete(`/projects/${projectId}`);
export const getProjectStats = (projectId: string) => api.get(`/projects/${projectId}/stats`);

// ============================================
// APPLICATION API
// ============================================
export const createApplication = (data: any) => api.post('/applications', data);
export const getUserApplications = (userId: string) => api.get(`/applications/user/${userId}`);
export const getProjectApplications = (projectId: string) => api.get(`/applications/project/${projectId}`);
export const updateApplicationStatus = (applicationId: string, status: string) => api.put(`/applications/${applicationId}/status`, { status });
export const checkExistingApplication = (projectId: string, userId: string) => api.get(`/applications/check/${projectId}/${userId}`);

// ============================================
// MENTORSHIP REQUEST API
// ============================================
export const createMentorshipRequest = (data: any) => api.post('/mentorship-requests', data);
export const getUserMentorshipRequests = (userId: string) => api.get(`/mentorship-requests/user/${userId}`);
export const updateMentorshipRequestStatus = (requestId: string, status: string) => 
  api.put(`/mentorship-requests/${requestId}/status`, { status });
export const checkMentorshipRequestExists = (requesterId: string, recipientId: string) => 
  api.get(`/mentorship-requests/check/${requesterId}/${recipientId}`);

// ============================================
// DASHBOARD STATS API
// ============================================
export const getDashboardStats = (userId: string) => api.get(`/stats/dashboard/${userId}`);

export default api;
