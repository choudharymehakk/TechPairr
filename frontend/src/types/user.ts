export interface User {
  id: string;
  email: string;
  full_name: string;
  user_type: 'student' | 'faculty' | 'industry';
}

export interface AuthResponse {
  status: 'success' | 'error';
  message: string;
  token?: string;
  user?: User;
}
