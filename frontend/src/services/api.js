import axios from 'axios';
// Use local backend for development, production for deployed app
const API_BASE_URL = import.meta.env.DEV
    ? 'http://localhost:5000/api' // Local development
    : 'https://techpairr.onrender.com/api'; // Production
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
// HEALTH & TEST ENDPOINTS
// ============================================
export const healthCheck = () => api.get('/health');
export const testDatabase = () => api.get('/test-db');
// ============================================
// AUTHENTICATION API
// ============================================
export const register = (data) => api.post('/register', data);
export const login = (data) => api.post('/login', data);
// ============================================
// PROFILE API
// ============================================
export const createStudentProfile = (data) => api.post('/profile/student', data);
export const createFacultyProfile = (data) => api.post('/profile/faculty', data);
export const createIndustryProfile = (data) => api.post('/profile/industry', data);
export const getProfile = (userType, userId) => api.get(`/profile/${userType}/${userId}`);
export const checkProfileExists = (userType, userId) => api.get(`/profile/${userType}/${userId}`);
// ============================================
// EXPLORE / MATCHING API
// ============================================
export const getExploreMatches = (userId) => api.get(`/explore?user_id=${userId}`);
// ============================================
// PROJECT API
// ============================================
export const createProject = (data) => api.post('/projects', data);
export const getProjects = (params) => api.get('/projects', { params });
export const getProject = (projectId) => api.get(`/projects/${projectId}`);
export const getUserProjects = (userId) => api.get(`/projects/user/${userId}`);
export const getProjectOwner = (projectId) => api.get(`/projects/${projectId}/owner`);
export const updateProject = (projectId, data) => api.put(`/projects/${projectId}`, data);
export const deleteProject = (projectId) => api.delete(`/projects/${projectId}`);
export const getProjectStats = (projectId) => api.get(`/projects/${projectId}/stats`);
// ============================================
// APPLICATION API
// ============================================
export const createApplication = (data) => api.post('/applications', data);
export const getUserApplications = (userId) => api.get(`/applications/user/${userId}`);
export const getProjectApplications = (projectId) => api.get(`/applications/project/${projectId}`);
export const updateApplicationStatus = (applicationId, status) => api.put(`/applications/${applicationId}/status`, { status });
export const checkExistingApplication = (projectId, userId) => api.get(`/applications/check/${projectId}/${userId}`);
export default api;
// ============================================
// MENTORSHIP REQUEST API
// ============================================
export const createMentorshipRequest = (data) => api.post('/mentorship-requests', data);
export const getUserMentorshipRequests = (userId) => api.get(`/mentorship-requests/user/${userId}`);
export const updateMentorshipRequestStatus = (requestId, status) => api.put(`/mentorship-requests/${requestId}/status`, { status });
export const checkMentorshipRequestExists = (requesterId, recipientId) => api.get(`/mentorship-requests/check/${requesterId}/${recipientId}`);
// ============================================
// DASHBOARD STATS API
// ============================================
export const getDashboardStats = (userId) => api.get(`/stats/dashboard/${userId}`);
