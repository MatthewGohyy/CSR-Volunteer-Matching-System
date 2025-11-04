import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Building2, Calendar, CheckCircle, XCircle, Clock, AlertCircle,
  MessageSquare
} from 'lucide-react';
import api from '../config/api';

interface Offer {
  id: string;
  requestId: string;
  csrRep: {
    id: string;
    name: string;
    email: string;
    companyName: string;
  };
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
  request: {
    id: string;
    title: string;
    description: string;
  };
}

interface OffersResponse {
  offers: Offer[];
  total: number;
  pending: number;
  accepted: number;
  declined: number;
}

interface OffersListProps {
  searchQuery?: string;
}

const OffersList: React.FC<OffersListProps> = ({ searchQuery = '' }) => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  // Fetch offers
  const { data: offersData, isLoading } = useQuery<OffersResponse>({
    queryKey: ['pin-offers'],
    queryFn: async () => {
      const response = await api.get<OffersResponse>('/volunteers/offers');
      return response.data;
    },
  });

  // Accept offer mutation
  const acceptMutation = useMutation({
    mutationFn: async (offerId: string) => {
      const response = await api.put(`/volunteers/offers/${offerId}/accept`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pin-offers'] });
      queryClient.invalidateQueries({ queryKey: ['pin-requests'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      alert(`✅ Offer accepted! Match created successfully.`);
    },
    onError: (error: any) => {
      alert(`❌ Error: ${error.response?.data?.error || 'Failed to accept offer'}`);
    },
  });

  // Decline offer mutation
  const declineMutation = useMutation({
    mutationFn: async (offerId: string) => {
      const response = await api.put(`/volunteers/offers/${offerId}/decline`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pin-offers'] });
      alert('✅ Offer declined successfully');
    },
    onError: (error: any) => {
      alert(`❌ Error: ${error.response?.data?.error || 'Failed to decline offer'}`);
    },
  });

  const handleAccept = (offerId: string) => {
    if (window.confirm('Accept this offer? This will create a match and decline other pending offers.')) {
      acceptMutation.mutate(offerId);
    }
  };

  const handleDecline = (offerId: string) => {
    if (window.confirm('Decline this offer?')) {
      declineMutation.mutate(offerId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const offers = offersData?.offers || [];
  
  // Filter by status
  let filteredOffers = filter === 'all' 
    ? offers 
    : offers.filter(o => o.status === filter.toUpperCase());

  // Filter by search query (search in request title, description, and CSR name/company)
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filteredOffers = filteredOffers.filter(offer => 
      offer.request.title.toLowerCase().includes(query) ||
      offer.request.description.toLowerCase().includes(query) ||
      offer.csrRep.name.toLowerCase().includes(query) ||
      offer.csrRep.companyName.toLowerCase().includes(query)
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-green-100 text-green-800',
      DECLINED: 'bg-red-100 text-red-800',
    };
    const icons = {
      PENDING: Clock,
      ACCEPTED: CheckCircle,
      DECLINED: XCircle,
    };
    const Icon = icons[status as keyof typeof icons];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-4 h-4" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{offersData?.total || 0}</div>
          <div className="text-sm text-gray-600">Total Offers</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-900">{offersData?.pending || 0}</div>
          <div className="text-sm text-yellow-700">Pending</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-900">{offersData?.accepted || 0}</div>
          <div className="text-sm text-green-700">Accepted</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-900">{offersData?.declined || 0}</div>
          <div className="text-sm text-red-700">Declined</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['all', 'pending', 'accepted', 'declined'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              filter === f
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Offers List */}
      {filteredOffers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "You haven't received any volunteer offers yet." 
              : `No ${filter} offers.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {offer.csrRep.companyName}
                    </h3>
                    {getStatusBadge(offer.status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    Contact: {offer.csrRep.name} ({offer.csrRep.email})
                  </p>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(offer.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Request Info */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">For Request:</p>
                <p className="font-semibold text-gray-900">{offer.request.title}</p>
              </div>

              {/* Offer Message */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  <p className="text-sm font-medium text-gray-700">Volunteer Message:</p>
                </div>
                <p className="text-gray-900 bg-blue-50 p-3 rounded-lg">{offer.message}</p>
              </div>

              {/* Actions */}
              {offer.status === 'PENDING' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleAccept(offer.id)}
                    disabled={acceptMutation.isPending}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {acceptMutation.isPending ? 'Accepting...' : 'Accept Offer'}
                  </button>
                  <button
                    onClick={() => handleDecline(offer.id)}
                    disabled={declineMutation.isPending}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-5 h-5" />
                    {declineMutation.isPending ? 'Declining...' : 'Decline Offer'}
                  </button>
                </div>
              )}

              {offer.status === 'ACCEPTED' && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                    ✅ You accepted this offer. A match has been created!
                  </p>
                </div>
              )}

              {offer.status === 'DECLINED' && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                    ❌ You declined this offer.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersList;
