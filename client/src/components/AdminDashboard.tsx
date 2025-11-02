import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  UserPlus, 
  Shield, 
  CheckCircle,
  XCircle, 
  AlertCircle,
  Search,
  Eye,
  LogOut,
  User,
  Building2,
  Settings
} from 'lucide-react';
import api from '../config/api';
import { UserRole, UserStatus, AdminUser, UsersResponse, UserProfilesResponse, UserProfile } from '../types';
import CreateUserModal from './CreateUserModal';
import CreateUserProfileModal from './CreateUserProfileModal';
import UserDetailsModal from './UserDetailsModal';
import UserProfileDetailsModal from './UserProfileDetailsModal';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'profiles'>('accounts');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
  const [profileStatusFilter, setProfileStatusFilter] = useState<boolean | 'ALL'>('ALL');
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const queryClient = useQueryClient();

  // Fetch user accounts - Direct API call to controller (Boundary -> Controller)
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['admin-users', currentPage],
    queryFn: async (): Promise<UsersResponse> => {
      const response = await api.get<UsersResponse>(`/admin/users?page=${currentPage}&limit=10`);
      return response.data;
    },
    enabled: activeTab === 'accounts',
  });

  // Fetch user profiles (role definitions) - Direct API call to controller
  const { data: profilesData, isLoading: isLoadingProfiles, error: profilesError } = useQuery({
    queryKey: ['admin-profiles', currentPage, profileStatusFilter, searchTerm],
    queryFn: async (): Promise<UserProfilesResponse> => {
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.append('query', searchTerm.trim());
      }
      if (profileStatusFilter !== 'ALL') {
        params.append('isActive', profileStatusFilter.toString());
      }
      const queryString = params.toString();
      const url = `/admin/profiles${queryString ? `?${queryString}` : ''}`;
      const response = await api.get<UserProfilesResponse>(url);
      return response.data;
    },
    enabled: activeTab === 'profiles',
  });

  const activeUsersData = activeTab === 'accounts' ? usersData : null;
  const activeProfilesData = activeTab === 'profiles' ? profilesData : null;
  const activeIsLoading = activeTab === 'accounts' ? isLoading : isLoadingProfiles;
  const activeError = activeTab === 'accounts' ? error : profilesError;



  // Filter users based on search and status (for accounts tab)
  const filteredUsers = activeUsersData?.users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.pin?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.csrRep?.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  // Profiles are already filtered server-side, use them directly
  const filteredProfiles = activeProfilesData?.profiles || [];


  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100';
      case 'SUSPENDED':
        return 'text-red-600 bg-red-100';
      case 'DELETED':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getUserTypeColor = (role: UserRole | string) => {
    switch (role) {
      case 'Person in Need':
      case 'Pin':
      case 'pin':
      case 'PIN':
        return 'text-blue-600 bg-blue-100';
      case 'CSR Representative':
      case 'CsrRep':
      case 'csr_rep':
      case 'CSR_REP':
        return 'text-purple-600 bg-purple-100';
      case 'User Administrator':
      case 'UserAdmin':
      case 'user_admin':
      case 'USER_ADMIN':
        return 'text-orange-600 bg-orange-100';
      case 'Platform Manager':
      case 'PlatformManager':
      case 'platform_manager':
      case 'PLATFORM_MANAGER':
        return 'text-indigo-600 bg-indigo-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (activeIsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (activeError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Users</h2>
          <p className="text-gray-600">Failed to load user data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
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
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => {
                setActiveTab('accounts');
                setCurrentPage(1);
              }}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'accounts'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Account Management
            </button>
            <button
              onClick={() => {
                setActiveTab('profiles');
                setCurrentPage(1);
              }}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'profiles'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Profile Management
            </button>
          </nav>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total {activeTab === 'accounts' ? 'Accounts' : 'Profiles'}</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {activeTab === 'accounts' ? activeUsersData?.total : activeProfilesData?.profiles.length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active {activeTab === 'accounts' ? 'Accounts' : 'Profiles'}</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {activeTab === 'accounts' 
                        ? activeUsersData?.users.filter(u => u.status === 'ACTIVE').length || 0
                        : activeProfilesData?.profiles.filter(p => p.isActive).length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{activeTab === 'accounts' ? 'Suspended Accounts' : 'Inactive Profiles'}</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {activeTab === 'accounts' 
                        ? activeUsersData?.users.filter(u => u.status === 'SUSPENDED').length || 0
                        : activeProfilesData?.profiles.filter(p => !p.isActive).length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Users Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {activeTab === 'accounts' ? 'User Account Management' : 'User Profile Management'}
              </h3>
              <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-4">
                {/* Create Buttons */}
                {activeTab === 'accounts' ? (
                  <button
                    onClick={() => setShowCreateAccountModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create User Account
                  </button>
                ) : (
                  <button
                    onClick={() => setShowCreateProfileModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create User Profile
                  </button>
                )}
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                {/* Status Filter - Show different options for accounts vs profiles */}
                {activeTab === 'accounts' ? (
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'ALL')}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="DELETED">Deleted</option>
                  </select>
                ) : (
                  <select
                    value={profileStatusFilter === 'ALL' ? 'ALL' : profileStatusFilter.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      setProfileStatusFilter(value === 'ALL' ? 'ALL' : value === 'true');
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="ALL">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          <ul className="divide-y divide-gray-200">
            {activeTab === 'accounts' ? (
              // User Accounts List
              filteredUsers.map((user) => (
                <li key={user.id} className="px-4 py-4 sm:px-6">
                  <div 
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors duration-150"
                    onClick={async () => {
                      try {
                        const response = await api.get<{ user: AdminUser }>(`/admin/users/${user.id}`);
                        setSelectedUser(response.data.user);
                        setShowUserModal(true);
                      } catch (error) {
                        console.error('Failed to fetch user:', error);
                        // Fallback to using list data if fetch fails
                        setSelectedUser(user);
                        setShowUserModal(true);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {user.pin?.name || user.csrRep?.companyName || user.platformManager?.fullName || user.email}
                        </p>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeColor(user.role)}`}>
                            {user.role}
                          </span>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.csrRep && (
                          <p className="text-sm text-gray-500">{user.csrRep.contactPerson}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </li>
              ))
            ) : (
              // User Profiles (Role Definitions) List
              filteredProfiles.map((profile) => (
                <li 
                  key={profile.id} 
                  className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={async () => {
                    try {
                      const response = await api.get<{ profile: UserProfile }>(`/admin/profiles/${profile.id}`);
                      setSelectedProfile(response.data.profile);
                      setShowProfileModal(true);
                    } catch (error) {
                      console.error('Failed to fetch profile:', error);
                      // Fallback to using list data if fetch fails
                      setSelectedProfile(profile);
                      setShowProfileModal(true);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{profile.name}</p>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            profile.isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                          }`}>
                            {profile.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{profile.description || 'No description'}</p>
                        <p className="text-xs text-gray-400 mt-1">Created: {new Date(profile.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">View Details</span>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>

          {/* Pagination - Only show for accounts */}
          {activeTab === 'accounts' && activeUsersData && activeUsersData.total > 10 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(Math.ceil(activeUsersData.total / 10), currentPage + 1))}
                      disabled={currentPage >= Math.ceil(activeUsersData.total / 10)}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * 10, activeUsersData.total)}
                    </span>{' '}
                    of <span className="font-medium">{activeUsersData.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(Math.ceil(activeUsersData.total / 10), currentPage + 1))}
                      disabled={currentPage >= Math.ceil(activeUsersData.total / 10)}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create User Account Modal */}
      {showCreateAccountModal && (
        <CreateUserModal
          onClose={() => setShowCreateAccountModal(false)}
          onSuccess={() => {
            setShowCreateAccountModal(false);
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
          }}
        />
      )}

      {/* Create User Profile Modal */}
      {showCreateProfileModal && (
        <CreateUserProfileModal
          onClose={() => setShowCreateProfileModal(false)}
          onSuccess={() => {
            setShowCreateProfileModal(false);
            queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
          }}
        />
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          onUpdate={() => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
          }}
        />
      )}

      {/* User Profile Details Modal */}
      {showProfileModal && selectedProfile && (
        <UserProfileDetailsModal
          profile={selectedProfile}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedProfile(null);
          }}
          onUpdate={() => {
            queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
