import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, MapPin, Calendar, Clock, Eye, Star, User, Tag, AlertCircle } from 'lucide-react';
import api from '../config/api';

interface RequestModalProps {
  requestId: string;
  onClose: () => void;
  type?: 'request' | 'shortlist' | 'match' | 'offer';
}

interface Request {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH';
  urgencyLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  location: string;
  dateNeeded?: string | null;
  status: 'PENDING' | 'ACTIVE' | 'MATCHED' | 'COMPLETED' | 'CANCELLED';
  viewCount: number;
  shortlistCount: number;
  createdAt: string;
  pin?: {
    name: string;
    location?: string;
  };
}

interface Shortlist {
  id: string;
  request: Request;
  createdAt: string;
}

interface Match {
  id: string;
  request: Request;
  pin?: {
    name: string;
    location?: string;
  };
  status: string;
  matchedAt: string;
  completedAt?: string | null;
}

interface Offer {
  id: string;
  request: Request;
  message?: string | null;
  status: string;
  createdAt: string;
}

const RequestModal: React.FC<RequestModalProps> = ({ requestId, onClose, type = 'request' }) => {
  // Determine the endpoint based on type
  const getEndpoint = () => {
    switch (type) {
      case 'shortlist':
        return `/organizations/shortlists/${requestId}`;
      case 'match':
        return `/organizations/matches/${requestId}`;
      case 'offer':
        return `/organizations/offers/${requestId}`;
      default:
        return `/opportunities/${requestId}`;
    }
  };

  // Fetch request data
  const { data, isLoading, error } = useQuery({
    queryKey: ['request', type, requestId],
    queryFn: async () => {
      const response = await api.get(getEndpoint());
      
      // Handle different response structures
      if (type === 'shortlist' && response.data.shortlist) {
        return response.data.shortlist.request;
      } else if (type === 'match' && response.data.match) {
        return response.data.match.request;
      } else if (type === 'offer' && response.data.offer) {
        return response.data.offer.request;
      } else if (response.data.request) {
        return response.data.request;
      }
      
      throw new Error('Invalid response structure');
    },
    enabled: !!requestId,
  });

  const request: Request | undefined = data;

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      LOW: 'bg-blue-100 text-blue-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-orange-100 text-orange-800',
    };
    return colors[urgency as keyof typeof colors] || colors.MEDIUM;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-gray-100 text-gray-800',
      ACTIVE: 'bg-green-100 text-green-800',
      MATCHED: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-purple-100 text-purple-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center text-red-600 mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
            Error Loading Request
          </h3>
          <p className="text-gray-600 text-center mb-4">
            {error instanceof Error ? error.message : 'Failed to load request details'}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{request.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
              {request.status}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(request.urgency || request.urgencyLevel || 'MEDIUM')}`}>
              {request.urgency || request.urgencyLevel || 'MEDIUM'} Priority
            </span>
            {request.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                <Tag className="h-4 w-4 mr-1" />
                {request.category.name}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {request.location && (
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900">{request.location}</p>
                </div>
              </div>
            )}

            {request.dateNeeded && (
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date Needed</p>
                  <p className="text-gray-900">
                    {new Date(request.dateNeeded).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}

            {request.pin && (
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Requested By</p>
                  <p className="text-gray-900">{request.pin.name}</p>
                  {request.pin.location && (
                    <p className="text-sm text-gray-500">{request.pin.location}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Posted</p>
                <p className="text-gray-900">
                  {new Date(request.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <Eye className="h-4 w-4 mr-2" />
              <span>{request.viewCount} views</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-4 w-4 mr-2" />
              <span>{request.shortlistCount} shortlisted</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;

