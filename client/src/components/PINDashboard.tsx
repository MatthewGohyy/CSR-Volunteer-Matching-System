import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Heart, LogOut, Plus, Search, Edit2, Trash2, Eye, Star, 
  Calendar, MapPin, AlertCircle, CheckCircle, Clock, History, Mail, Users 
} from 'lucide-react';
import api from '../config/api';
import type { User as UserType } from '../types';
import OffersList from './OffersList';
import MatchesList from './MatchesList';
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
  urgencyLevel?: 'LOW' | 'MEDIUM' | 'HIGH'; // Legacy field name
  location: string;
  preferredDate?: string;
  dateNeeded?: string | null;
  status: 'PENDING' | 'MATCHED' | 'COMPLETED' | 'CANCELLED';
  viewCount: number;
  shortlistCount: number;
  createdAt: string;
  updatedAt: string;
}

interface RequestCategory {
  id: string;
  name: string;
  description: string;
}

interface RequestsResponse {
  requests: Request[];
  total: number;
}

const PINDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'my-requests' | 'offers' | 'matches' | 'history'>('my-requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);
  const [selectedCompletedRequestId, setSelectedCompletedRequestId] = useState<string | null>(null);

  // Fetch user profile
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<UserType> => {
      const response = await api.get<{ user: UserType }>('/auth/profile');
      return response.data.user;
    },
  });

  // Fetch PIN's requests
  const { data: requestsData, isLoading: requestsLoading } = useQuery({
    queryKey: ['pin-requests', searchQuery],
    queryFn: async (): Promise<RequestsResponse> => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      const response = await api.get<RequestsResponse>(`/opportunities/my/requests?${params.toString()}`);
      return response.data;
    },
  });

  // Fetch completed requests history
  const { data: historyData } = useQuery({
    queryKey: ['pin-history', searchQuery],
    queryFn: async (): Promise<RequestsResponse> => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      const response = await api.get<RequestsResponse>(`/volunteers/requests/history?${params.toString()}`);
      return response.data;
    },
    enabled: activeTab === 'history',
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<RequestCategory[]> => {
      try {
        const response = await api.get<{ categories: RequestCategory[] }>('/opportunities/categories');
        return response.data.categories;
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw error;
      }
    },
    retry: 2, // Retry failed requests twice
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // Delete request mutation
  const deleteRequestMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/opportunities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pin-requests'] });
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'MATCHED': return <CheckCircle className="h-4 w-4" />;
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      case 'PENDING': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const displayRequests = activeTab === 'my-requests' ? requestsData?.requests : historyData?.requests;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Person in Need Dashboard
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
                onClick={() => setActiveTab('my-requests')}
                className={`${
                  activeTab === 'my-requests'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Plus className="h-4 w-4 mr-2" />
                My Requests ({requestsData?.total || 0})
              </button>
              <button
                onClick={() => setActiveTab('offers')}
                className={`${
                  activeTab === 'offers'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Mail className="h-4 w-4 mr-2" />
                Offers
              </button>
              <button
                onClick={() => setActiveTab('matches')}
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
                onClick={() => setActiveTab('history')}
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

        {/* Search and Create */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
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
          {activeTab === 'my-requests' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Request
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'offers' ? (
          <OffersList />
        ) : activeTab === 'matches' ? (
          <MatchesList userType="PIN" />
        ) : requestsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : displayRequests && displayRequests.length > 0 ? (
          <div className="grid gap-4">
            {displayRequests.map((request) => (
              <div 
                key={request.id} 
                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-shadow ${
                  activeTab === 'history' 
                    ? 'cursor-pointer hover:shadow-md' 
                    : 'hover:shadow-md'
                }`}
                onClick={activeTab === 'history' ? () => setSelectedCompletedRequestId(request.id) : undefined}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{request.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{request.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1">{request.status}</span>
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

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.location}
                      </div>
                      {(request.dateNeeded || request.preferredDate) && (
                        <div className="flex items-center" title="Date Needed">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="font-medium">Date:</span>
                          <span className="ml-1">{new Date(request.dateNeeded || request.preferredDate!).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {activeTab === 'my-requests' && request.status !== 'COMPLETED' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={async () => {
                          try {
                            const response = await api.get<{ request: Request }>(`/opportunities/my/requests/${request.id}`);
                            setEditingRequest(response.data.request);
                          } catch (error) {
                            console.error('Failed to fetch request:', error);
                            // Fallback to using list data if fetch fails
                            setEditingRequest(request);
                          }
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this request?')) {
                            deleteRequestMutation.mutate(request.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
                    <span>Created {new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'my-requests' ? 'No requests yet' : 'No completed requests'}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'my-requests' 
                ? 'Create your first request to get started'
                : 'Your completed requests will appear here'}
            </p>
            {activeTab === 'my-requests' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md"
              >
                Create Request
              </button>
            )}
          </div>
        )}
      </main>

      {/* View Completed Request Modal */}
      {selectedCompletedRequestId && (
        <RequestModal
          requestId={selectedCompletedRequestId}
          onClose={() => setSelectedCompletedRequestId(null)}
          type="completed"
        />
      )}

      {/* Create/Edit Request Modal */}
      {(showCreateModal || editingRequest) && (
        <CreateEditRequestModal
          request={editingRequest}
          categories={categories || []}
          categoriesLoading={categoriesLoading}
          categoriesError={categoriesError}
          onClose={() => {
            setShowCreateModal(false);
            setEditingRequest(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['pin-requests'] });
            setShowCreateModal(false);
            setEditingRequest(null);
          }}
        />
      )}
    </div>
  );
};

// Create/Edit Request Modal Component
interface CreateEditRequestModalProps {
  request: Request | null;
  categories: RequestCategory[];
  categoriesLoading?: boolean;
  categoriesError?: Error | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateEditRequestModal: React.FC<CreateEditRequestModalProps> = ({
  request,
  categories,
  categoriesLoading = false,
  categoriesError,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: request?.title || '',
    description: request?.description || '',
    categoryId: request?.categoryId || '',
    urgency: ((request?.urgency || request?.urgencyLevel) as 'LOW' | 'MEDIUM' | 'HIGH') || 'MEDIUM',
    location: request?.location || '',
    dateNeeded: request?.dateNeeded || request?.preferredDate ? (request.dateNeeded || request.preferredDate!).split('T')[0] : '',
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (request) {
        await api.put(`/opportunities/${request.id}`, data);
      } else {
        await api.post('/opportunities', data);
      }
    },
    onSuccess,
    onError: (error: any) => {
      console.error('Error creating/updating request:', error);
      // Error will be displayed via the mutation error state
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {request ? 'Edit Request' : 'Create New Request'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Need help with grocery shopping"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe what help you need..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  disabled={categoriesLoading || !!categoriesError}
                >
                  <option value="">
                    {categoriesLoading 
                      ? 'Loading categories...' 
                      : categoriesError 
                        ? 'Failed to load categories' 
                        : request?.categoryId 
                          ? `Current: ${request.category?.name || 'Category'}` 
                          : 'Select category'}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categoriesError && (
                  <p className="mt-1 text-sm text-yellow-600">
                    {request 
                      ? 'Cannot load categories. You can still save with current category.' 
                      : 'Failed to load categories. Please refresh the page and try again.'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency Level *
                </label>
                <select
                  required
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Downtown, City Center"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateNeeded}
                  onChange={(e) => setFormData({ ...formData, dateNeeded: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {createMutation.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="font-medium">Error:</p>
                <p className="text-sm">
                  {createMutation.error?.response?.data?.error || 
                   createMutation.error?.response?.data?.message || 
                   'Failed to create request. Please try again.'}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
              >
                {createMutation.isPending ? 'Saving...' : (request ? 'Update Request' : 'Create Request')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PINDashboard;

