import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Heart, Calendar, Clock, CheckCircle, XCircle, User
} from 'lucide-react';
import api from '../config/api';

interface Offer {
  id: string;
  requestId: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
  request: {
    id: string;
    title: string;
    description: string;
    location: string;
    category?: {
      name: string;
    };
    pin: {
      name: string;
      email: string;
    };
  };
}

interface OffersResponse {
  offers: Offer[];
  total: number;
  pending: number;
  accepted: number;
  declined: number;
}

const CSROffersList: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  // Fetch CSR's submitted offers
  const { data: offersData, isLoading } = useQuery<OffersResponse>({
    queryKey: ['csr-offers'],
    queryFn: async () => {
      const response = await api.get<OffersResponse>('/organizations/offers');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const offers = offersData?.offers || [];
  const filteredOffers = filter === 'all'
    ? offers
    : offers.filter(o => o.status === filter.toUpperCase());

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
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
          <p className="text-gray-600">
            {filter === 'all'
              ? "You haven't submitted any volunteer offers yet."
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
                    <h3 className="text-lg font-semibold text-gray-900">
                      {offer.request?.title || 'Request Details Unavailable'}
                    </h3>
                    {getStatusBadge(offer.status)}
                  </div>
                  {offer.request?.category && (
                    <span className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded mr-2">
                      {offer.request.category.name}
                    </span>
                  )}
                  {offer.request?.location && (
                    <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {offer.request.location}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(offer.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Request Info */}
              {offer.request && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">{offer.request.description}</p>
                  {offer.request.pin && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>Requested by: {offer.request.pin.name} ({offer.request.pin.email})</span>
                    </div>
                  )}
                </div>
              )}

              {/* Your Offer Message */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Your Offer:</p>
                <p className="text-gray-900 bg-blue-50 p-3 rounded-lg">{offer.message}</p>
              </div>

              {/* Status Info */}
              {offer.status === 'PENDING' && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Waiting for the person in need to respond to your offer
                  </p>
                </div>
              )}

              {offer.status === 'ACCEPTED' && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    ✅ Offer accepted! A match has been created. Check the "Matches" tab.
                  </p>
                </div>
              )}

              {offer.status === 'DECLINED' && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    This offer was declined
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

export default CSROffersList;
