import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthCheck = () => api.get('/health');
export const testDatabase = () => api.get('/test-db');
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

export const register = (data: RegisterData) => api.post('/register', data);
export const login = (data: LoginData) => api.post('/login', data);

// Profile API endpoints
export const createStudentProfile = (data: any) => api.post('/profile/student', data);
export const createFacultyProfile = (data: any) => api.post('/profile/faculty', data);
export const createIndustryProfile = (data: any) => api.post('/profile/industry', data);
export const getProfile = (userType: string, userId: string) => api.get(`/profile/${userType}/${userId}`);

// Check if profile exists
export const checkProfileExists = (userType: string, userId: string) => 
  api.get(`/profile/${userType}/${userId}`);
