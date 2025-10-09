import api from '../config/api';
import type { Request, ServiceCategory } from '../types';

export const requestService = {
  // Get all service categories
  getCategories: async (): Promise<ServiceCategory[]> => {
    const response = await api.get<{ categories: ServiceCategory[] }>('/opportunities/categories');
    return response.data.categories;
  },

  // Get all requests with optional filters
  getRequests: async (params?: {
    status?: string;
    urgency?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/opportunities', { params });
    return response.data;
  },

  // Get single request
  getRequest: async (id: string): Promise<Request> => {
    const response = await api.get<{ request: Request }>(`/opportunities/${id}`);
    return response.data.request;
  },

  // Create request (PIN only)
  createRequest: async (data: {
    categoryId: string;
    title: string;
    description: string;
    urgency?: 'LOW' | 'MEDIUM' | 'HIGH';
    dateNeeded?: string;
    location?: string;
  }): Promise<Request> => {
    const response = await api.post<{ request: Request }>('/opportunities', data);
    return response.data.request;
  },

  // Get my requests (PIN only)
  getMyRequests: async () => {
    const response = await api.get('/opportunities/my/requests');
    return response.data;
  },

  // Update request (PIN only)
  updateRequest: async (id: string, data: Partial<Request>) => {
    const response = await api.put(`/opportunities/${id}`, data);
    return response.data;
  },

  // Delete request (PIN only)
  deleteRequest: async (id: string) => {
    const response = await api.delete(`/opportunities/${id}`);
    return response.data;
  },
};

