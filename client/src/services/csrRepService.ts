import api from '../config/api';

export const csrRepService = {
  // Shortlist a request
  shortlistRequest: async (requestId: string) => {
    const response = await api.post('/organizations/shortlist', { requestId });
    return response.data;
  },

  // Remove from shortlist
  removeShortlist: async (requestId: string) => {
    const response = await api.delete(`/organizations/shortlist/${requestId}`);
    return response.data;
  },

  // Get shortlisted requests
  getShortlists: async () => {
    const response = await api.get('/organizations/shortlists');
    return response.data;
  },

  // Submit volunteer offer
  submitOffer: async (requestId: string, message?: string) => {
    const response = await api.post('/organizations/offers', { requestId, message });
    return response.data;
  },

  // Get my offers
  getMyOffers: async () => {
    const response = await api.get('/organizations/offers');
    return response.data;
  },

  // Get my matches
  getMyMatches: async () => {
    const response = await api.get('/organizations/matches');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: {
    industry?: string;
    contactPerson?: string;
    phoneNumber?: string;
    companyAddress?: string;
    companyLogo?: string;
  }) => {
    const response = await api.put('/organizations/profile', data);
    return response.data;
  },
};

