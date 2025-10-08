import api from '../config/api';
import type {
  LoginCredentials,
  RegisterPINData,
  RegisterCSRRepData,
  AuthResponse,
  User,
} from '../types';

export const authService = {
  // Register as PIN (Person In Need)
  registerPIN: async (data: RegisterPINData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register/pin', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register as CSR Representative
  registerCSRRep: async (data: RegisterCSRRepData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register/csr-rep', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get<{ user: User }>('/auth/profile');
    return response.data.user;
  },

  // Update password
  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/auth/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Get stored user data
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

