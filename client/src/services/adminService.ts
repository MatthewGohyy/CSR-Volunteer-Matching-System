import api from '../config/api';
import type { User, UserType, UserStatus, PlatformManagerProfile } from '../types';

export interface CreateUserData {
  email: string;
  password: string;
  userType: UserType;
  // PIN specific fields
  name?: string;
  age?: number;
  location?: string;
  phoneNumber?: string;
  accessibilityNeeds?: string;
  // CSR Rep specific fields
  companyName?: string;
  companyRegistrationNumber?: string;
  industry?: string;
  contactPerson?: string;
  companyAddress?: string;
  // Platform Manager specific fields
  fullName?: string;
  department?: string;
  phone?: string;
}

export interface AdminUser extends User {
  pin?: {
    id: string;
    name: string;
    age?: number;
    location?: string;
    phoneNumber?: string;
    accessibilityNeeds?: string;
  };
  csrRep?: {
    id: string;
    companyName: string;
    companyRegistrationNumber: string;
    industry?: string;
    contactPerson: string;
    phoneNumber: string;
    companyAddress?: string;
    approvalStatus: UserStatus;
    approvedAt?: string;
  };
  platformManager?: PlatformManagerProfile;
}

export interface UsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export const adminService = {
  // Get all users with pagination
  getUsers: async (page: number = 1, limit: number = 10): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<AdminUser> => {
    const response = await api.get<{ user: AdminUser }>(`/admin/users/${id}`);
    return response.data.user;
  },

  // Create new user
  createUser: async (userData: CreateUserData): Promise<AdminUser> => {
    const response = await api.post<{ user: AdminUser; message: string }>('/admin/users', userData);
    return response.data.user;
  },

  // Update user status (suspend/activate)
  updateUserStatus: async (id: string, status: UserStatus): Promise<AdminUser> => {
    const response = await api.put<{ user: AdminUser; message: string }>(`/admin/users/${id}/status`, { status });
    return response.data.user;
  },

  // Suspend user
  suspendUser: async (id: string): Promise<AdminUser> => {
    return adminService.updateUserStatus(id, 'SUSPENDED');
  },

  // Activate user
  activateUser: async (id: string): Promise<AdminUser> => {
    return adminService.updateUserStatus(id, 'ACTIVE');
  },

  // Approve CSR Rep
  approveCSRRep: async (id: string): Promise<AdminUser> => {
    const response = await api.put<{ user: AdminUser; message: string }>(`/admin/users/${id}/approve`);
    return response.data.user;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  // Get pending CSR Reps
  getPendingCSRReps: async (): Promise<AdminUser[]> => {
    const response = await api.get<{ users: AdminUser[] }>('/admin/users/pending-csr-reps');
    return response.data.users;
  },

  // Get system statistics
  getSystemStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};
