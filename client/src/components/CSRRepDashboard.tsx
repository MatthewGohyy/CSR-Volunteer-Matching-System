import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Building2, LogOut, Search, Star, History, Eye, MapPin,
  Calendar, AlertCircle, Clock, X, Mail, Users
} from 'lucide-react';
import api from '../config/api';
import type { User as UserType } from '../types';
import CSROffersList from './CSROffersList';
import MatchesList from './MatchesList';
import SubmitOfferModal from './SubmitOfferModal';
import RequestModal from './RequestModal';

// Types
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
  preferredDate?: string;
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

interface RequestsResponse {
  requests: Request[];
  total: number;
}

interface Shortlist {
  id: string;
  request: Request;
  createdAt: string;
}

const CSRRepDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'browse' | 'shortlist' | 'offers' | 'matches' | 'history'>('browse');
  const [offerModalRequest, setOfferModalRequest] = useState<Request | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // Fetch user profile
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<UserType> => {
      const response = await api.get<{ user: UserType }>('/auth/profile');
      return response.data.user;
    },
  });

  // Fetch available requests
  const { data: requestsData, isLoading: requestsLoading } = useQuery({
    queryKey: ['available-requests', searchQuery, categoryFilter, urgencyFilter],
    queryFn: async (): Promise<RequestsResponse> => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (categoryFilter) params.append('categoryId', categoryFilter);
      if (urgencyFilter) params.append('urgency', urgencyFilter);
      const response = await api.get<RequestsResponse>(`/opportunities?${params.toString()}`);
      return response.data;
    },
    enabled: activeTab === 'browse',
  });

  // Fetch shortlist
  const { data: shortlistData, isLoading: shortlistLoading } = useQuery({
    queryKey: ['shortlist', searchQuery],
    queryFn: async (): Promise<{ shortlist: Shortlist[]; total: number }> => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      const response = await api.get(`/organizations/shortlists?${params.toString()}`);
      return response.data;
    },
    enabled: activeTab === 'shortlist',
  });

  // Fetch completed requests history
  const { data: historyData } = useQuery({
    queryKey: ['csr-history', searchQuery],
    queryFn: async (): Promise<{ matches: any[]; total: number }> => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      const response = await api.get(`/organizations/requests/history?${params.toString()}`);
      // Transform matches to requests for display
      const matches = response.data.matches || [];
      return {
        matches,
        total: matches.length,
      };
    },
    enabled: activeTab === 'history',
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/opportunities/categories');
      return response.data.categories;
    },
  });

  // Fetch submitted offers to track which requests already have offers
  const { data: submittedOffers } = useQuery({
    queryKey: ['csr-offers-list'],
    queryFn: async () => {
      const response = await api.get('/organizations/offers');
      return response.data.offers || [];
    },
  });

  // Create a set of request IDs that already have offers
  const requestsWithOffers = new Set(
    submittedOffers?.map((offer: any) => offer.requestId) || []
  );

  // Fetch shortlisted IDs
  const { data: shortlistedIds } = useQuery({
    queryKey: ['shortlisted-ids'],
    queryFn: async (): Promise<string[]> => {
      const response = await api.get('/organizations/shortlist/ids');
      return response.data.shortlistedIds;
    },
  });

  // Save to shortlist mutation
  const saveToShortlistMutation = useMutation({
    mutationFn: async (requestId: string) => {
      await api.post('/organizations/shortlist', { requestId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-requests'] });
      queryClient.invalidateQueries({ queryKey: ['shortlist'] });
      queryClient.invalidateQueries({ queryKey: ['shortlisted-ids'] });
    },
    onError: (error: any) => {
      console.error('Error saving to shortlist:', error);
    },
  });

  // Remove from shortlist mutation
  const removeFromShortlistMutation = useMutation({
    mutationFn: async (requestId: string) => {
      await api.delete(`/organizations/shortlist/${requestId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-requests'] });
      queryClient.invalidateQueries({ queryKey: ['shortlist'] });
      queryClient.invalidateQueries({ queryKey: ['shortlisted-ids'] });
    },
    onError: (error: any) => {
      console.error('Error removing from shortlist:', error);
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      LOW: 'bg-blue-100 text-blue-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-orange-100 text-orange-800',
    };
    return colors[urgency as keyof typeof colors] || colors.LOW;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-gray-100 text-gray-800',
      MATCHED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const isLoading = requestsLoading || shortlistLoading;
  let displayRequests: Request[] = [];

  if (activeTab === 'browse') {
    displayRequests = requestsData?.requests || [];
  } else if (activeTab === 'shortlist') {
    // Keep shortlist items with their IDs for modal access
    displayRequests = shortlistData?.shortlist
      ?.filter(s => s.request) // Filter out any null/undefined requests
      .map(s => ({ ...s.request, shortlistId: s.id })) || [];
  } else if (activeTab === 'history') {
    // Transform matches to requests for display, keeping matchId for modal
    displayRequests = historyData?.matches
      ?.filter((m: any) => m.request)
      .map((m: any) => ({ ...m.request, matchId: m.id })) || [];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                CSR Representative Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => {
                  setActiveTab('browse');
                  setSearchQuery('');
                }}
                className={`${
                  activeTab === 'browse'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Eye className="h-4 w-4 mr-2" />
                Browse Requests ({requestsData?.total || 0})
              </button>
              <button
                onClick={() => {
                  setActiveTab('shortlist');
                  setSearchQuery('');
                }}
                className={`${
                  activeTab === 'shortlist'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Star className="h-4 w-4 mr-2" />
                My Shortlist ({shortlistData?.total || 0})
              </button>
              <button
                onClick={() => {
                  setActiveTab('offers');
                  setSearchQuery('');
                }}
                className={`${
                  activeTab === 'offers'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Mail className="h-4 w-4 mr-2" />
                My Offers
              </button>
              <button
                onClick={() => {
                  setActiveTab('matches');
                  setSearchQuery('');
                }}
                className={`${
                  activeTab === 'matches'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Users className="h-4 w-4 mr-2" />
                Matches
              </button>
              <button
                onClick={() => {
                  setActiveTab('history');
                  setSearchQuery('');
                }}
                className={`${
                  activeTab === 'history'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <History className="h-4 w-4 mr-2" />
                Completed History ({historyData?.total || 0})
              </button>
            </nav>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {activeTab === 'browse' && (
              <>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Urgency</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </>
            )}
          </div>

          {(categoryFilter || urgencyFilter) && (
            <div className="flex gap-2">
              {categoryFilter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  {categories?.find((c: any) => c.id === categoryFilter)?.name}
                  <button
                    onClick={() => setCategoryFilter('')}
                    className="ml-2 hover:text-primary-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {urgencyFilter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  {urgencyFilter}
                  <button
                    onClick={() => setUrgencyFilter('')}
                    className="ml-2 hover:text-primary-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'offers' ? (
          <CSROffersList />
        ) : activeTab === 'matches' ? (
          <MatchesList userType="CSR_REP" searchQuery={searchQuery} />
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : displayRequests.length > 0 ? (
          <div className="grid gap-4">
            {displayRequests.map((request) => (
              <div 
                key={request.id} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={(e) => {
                  // Prevent clicking on star button from opening modal
                  if ((e.target as HTMLElement).closest('button')) {
                    return;
                  }
                  
                  // For shortlist, use shortlistId; for history, use matchId; for browse, use request.id
                  const idToUse = (request as any).shortlistId || (request as any).matchId || request.id;
                  setSelectedRequestId(idToUse);
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{request.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{request.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency || request.urgencyLevel || 'MEDIUM')}`}>
                        {request.urgency || request.urgencyLevel || 'MEDIUM'}
                      </span>
                      {request.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {request.category.name}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.location}
                      </div>
                      {(request.dateNeeded || request.preferredDate) && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(request.dateNeeded || request.preferredDate!).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {request.pin && (
                      <div className="text-sm text-gray-600">
                        <strong>Requested by:</strong> {request.pin.name}
                        {request.pin.location && ` • ${request.pin.location}`}
                      </div>
                    )}
                  </div>

                  {activeTab !== 'history' && request.status === 'ACTIVE' && (
                    <div className="ml-4 flex gap-2">
                      {requestsWithOffers.has(request.id) ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed text-sm font-medium"
                          title="You already submitted an offer on this request"
                        >
                          ✓ Offer Submitted
                        </button>
                      ) : (
                        <button
                          onClick={() => setOfferModalRequest(request)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                          title="Submit volunteer offer"
                        >
                          Submit Offer
                        </button>
                      )}
                      {activeTab === 'shortlist' ? (
                        <button
                          onClick={() => removeFromShortlistMutation.mutate(request.id)}
                          disabled={removeFromShortlistMutation.isPending}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-md"
                          title="Remove from shortlist"
                        >
                          <Star className="h-5 w-5 fill-current" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const isShortlisted = shortlistedIds?.includes(request.id);
                            if (isShortlisted) {
                              removeFromShortlistMutation.mutate(request.id);
                            } else {
                              saveToShortlistMutation.mutate(request.id);
                            }
                          }}
                          disabled={saveToShortlistMutation.isPending || removeFromShortlistMutation.isPending}
                          className={`p-2 rounded-md transition-colors ${
                            shortlistedIds?.includes(request.id)
                              ? 'text-blue-600 hover:bg-blue-50'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                          }`}
                          title={shortlistedIds?.includes(request.id) ? 'Remove from shortlist' : 'Save to shortlist'}
                        >
                          <Star className={`h-5 w-5 ${shortlistedIds?.includes(request.id) ? 'fill-current' : ''}`} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{request.viewCount} views</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 mr-1" />
                    <span>{request.shortlistCount} shortlisted</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Posted {new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'browse' && 'No requests available'}
              {activeTab === 'shortlist' && 'No saved requests'}
              {activeTab === 'history' && 'No completed requests'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'browse' && 'Check back later for new volunteer opportunities'}
              {activeTab === 'shortlist' && 'Browse requests and save them to your shortlist'}
              {activeTab === 'history' && 'Your completed volunteer activities will appear here'}
            </p>
          </div>
        )}
      </main>

      {/* Submit Offer Modal */}
      {offerModalRequest && (
        <SubmitOfferModal
          request={offerModalRequest}
          onClose={() => setOfferModalRequest(null)}
        />
      )}

      {/* Request Detail Modal */}
      {selectedRequestId && (
        <RequestModal
          requestId={selectedRequestId}
          type={
            activeTab === 'shortlist' ? 'shortlist' :
            activeTab === 'history' ? 'csrHistory' :
            'request'
          }
          onClose={() => setSelectedRequestId(null)}
        />
      )}
    </div>
  );
};

export default CSRRepDashboard;

