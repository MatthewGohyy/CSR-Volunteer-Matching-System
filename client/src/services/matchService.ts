import api from '../config/api';

export const matchService = {
  // Get offers for my requests (PIN only)
  getOffersForMyRequests: async () => {
    const response = await api.get('/matches/offers');
    return response.data;
  },

  // Accept offer (PIN only)
  acceptOffer: async (offerId: string) => {
    const response = await api.post(`/matches/offers/${offerId}/accept`);
    return response.data;
  },

  // Decline offer (PIN only)
  declineOffer: async (offerId: string) => {
    const response = await api.post(`/matches/offers/${offerId}/decline`);
    return response.data;
  },

  // Complete match
  completeMatch: async (matchId: string) => {
    const response = await api.put(`/matches/${matchId}/complete`);
    return response.data;
  },

  // Cancel match
  cancelMatch: async (matchId: string, reason: string) => {
    const response = await api.put(`/matches/${matchId}/cancel`, { reason });
    return response.data;
  },
};

