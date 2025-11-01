import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users, CheckCircle, XCircle, Calendar, MapPin, Building2, User, Clock
} from 'lucide-react';
import api from '../config/api';

interface Match {
  id: string;
  requestId: string;
  csrRepId: string;
  pinId: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  matchedAt: string;
  completedAt?: string | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  request: {
    id: string;
    title: string;
    description: string;
    location: string;
    categoryId: string;
    category?: {
      name: string;
    };
  };
  csrRep?: {
    id: string;
    name: string;
    email: string;
    companyName: string;
  };
  pin?: {
    id: string;
    name: string;
    email: string;
    location?: string;
  };
}

interface MatchesResponse {
  matches: Match[];
  total: number;
  active: number;
  completed: number;
  cancelled: number;
}

interface MatchesListProps {
  userType: 'PIN' | 'CSR_REP';
}

const MatchesList: React.FC<MatchesListProps> = ({ userType }) => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [cancelReason, setCancelReason] = useState('');
  const [cancellingMatchId, setCancellingMatchId] = useState<string | null>(null);

  const endpoint = userType === 'PIN' ? '/volunteers/matches' : '/organizations/matches';

  // Fetch matches
  const { data: matchesData, isLoading } = useQuery<MatchesResponse>({
    queryKey: ['matches', userType],
    queryFn: async () => {
      const response = await api.get<MatchesResponse>(endpoint);
      return response.data;
    },
  });

  // Complete match mutation
  const completeMutation = useMutation({
    mutationFn: async (matchId: string) => {
      const response = await api.put(`/matches/${matchId}/complete`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      alert('✅ Match completed successfully!');
    },
    onError: (error: any) => {
      alert(`❌ Error: ${error.response?.data?.error || 'Failed to complete match'}`);
    },
  });

  // Cancel match mutation
  const cancelMutation = useMutation({
    mutationFn: async ({ matchId, reason }: { matchId: string; reason: string }) => {
      const response = await api.put(`/matches/${matchId}/cancel`, { reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['pin-requests'] });
      setCancellingMatchId(null);
      setCancelReason('');
      alert('✅ Match cancelled successfully. Request has been reopened.');
    },
    onError: (error: any) => {
      alert(`❌ Error: ${error.response?.data?.error || 'Failed to cancel match'}`);
    },
  });

  const handleComplete = (matchId: string) => {
    if (window.confirm('Mark this match as completed?')) {
      completeMutation.mutate(matchId);
    }
  };

  const handleCancelClick = (matchId: string) => {
    setCancellingMatchId(matchId);
  };

  const handleCancelConfirm = (matchId: string) => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }
    cancelMutation.mutate({ matchId, reason: cancelReason });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const matches = matchesData?.matches || [];
  const filteredMatches = filter === 'all'
    ? matches
    : matches.filter(m => m.status === filter.toUpperCase());

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    const icons = {
      ACTIVE: Clock,
      COMPLETED: CheckCircle,
      CANCELLED: XCircle,
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
          <div className="text-2xl font-bold text-gray-900">{matchesData?.total || 0}</div>
          <div className="text-sm text-gray-600">Total Matches</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-900">{matchesData?.active || 0}</div>
          <div className="text-sm text-blue-700">Active</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-900">{matchesData?.completed || 0}</div>
          <div className="text-sm text-green-700">Completed</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-900">{matchesData?.cancelled || 0}</div>
          <div className="text-sm text-red-700">Cancelled</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['all', 'active', 'completed', 'cancelled'] as const).map((f) => (
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

      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-600">
            {filter === 'all'
              ? "You don't have any matches yet."
              : `No ${filter} matches.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {match.request.title}
                    </h3>
                    {getStatusBadge(match.status)}
                  </div>
                  {match.request.category && (
                    <span className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {match.request.category.name}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Matched: {new Date(match.matchedAt).toLocaleDateString()}
                </div>
              </div>

              {/* Request Details */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 mb-2">{match.request.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {match.request.location}
                </div>
              </div>

              {/* Matched Party Info */}
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {userType === 'PIN' ? 'Volunteer Organization:' : 'Person in Need:'}
                </p>
                {userType === 'PIN' && match.csrRep && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">{match.csrRep.companyName}</p>
                      <p className="text-sm text-gray-700">Contact: {match.csrRep.name}</p>
                      <p className="text-sm text-gray-600">{match.csrRep.email}</p>
                    </div>
                  </div>
                )}
                {userType === 'CSR_REP' && match.pin && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">{match.pin.name}</p>
                      <p className="text-sm text-gray-600">{match.pin.email}</p>
                      {match.pin.location && (
                        <p className="text-sm text-gray-600">Location: {match.pin.location}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Completion/Cancellation Info */}
              {match.status === 'COMPLETED' && match.completedAt && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Completed on {new Date(match.completedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {match.status === 'CANCELLED' && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700 flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4" />
                    Cancelled on {match.cancelledAt ? new Date(match.cancelledAt).toLocaleDateString() : 'N/A'}
                  </p>
                  {match.cancellationReason && (
                    <p className="text-sm text-red-600">
                      Reason: {match.cancellationReason}
                    </p>
                  )}
                </div>
              )}

              {/* Actions for Active Matches */}
              {match.status === 'ACTIVE' && (
                <div className="pt-4 border-t border-gray-200">
                  {cancellingMatchId === match.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reason for cancellation:
                        </label>
                        <textarea
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder="Please provide a reason..."
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleCancelConfirm(match.id)}
                          disabled={cancelMutation.isPending}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {cancelMutation.isPending ? 'Cancelling...' : 'Confirm Cancellation'}
                        </button>
                        <button
                          onClick={() => {
                            setCancellingMatchId(null);
                            setCancelReason('');
                          }}
                          className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleComplete(match.id)}
                        disabled={completeMutation.isPending}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <CheckCircle className="w-5 h-5" />
                        {completeMutation.isPending ? 'Completing...' : 'Mark as Completed'}
                      </button>
                      <button
                        onClick={() => handleCancelClick(match.id)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Cancel Match
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesList;
