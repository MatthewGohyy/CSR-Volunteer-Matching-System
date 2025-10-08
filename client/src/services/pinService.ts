import api from '../config/api';

export const pinService = {
  // Get my profile (PIN only)
  getProfile: async () => {
    const response = await api.get('/volunteers/profile');
    return response.data;
  },

  // Update profile (PIN only)
  updateProfile: async (data: {
    name?: string;
    age?: number;
    location?: string;
    phoneNumber?: string;
    accessibilityNeeds?: string;
    profilePhoto?: string;
  }) => {
    const response = await api.put('/volunteers/profile', data);
    return response.data;
  },

  // Get my matches (PIN only)
  getMyMatches: async () => {
    const response = await api.get('/volunteers/matches');
    return response.data;
  },

  // Get notifications
  getNotifications: async () => {
    const response = await api.get('/volunteers/notifications');
    return response.data;
  },

  // Mark notification as read
  markNotificationRead: async (notificationId: string) => {
    const response = await api.put(`/volunteers/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    const response = await api.put('/volunteers/notifications/read-all');
    return response.data;
  },
};

