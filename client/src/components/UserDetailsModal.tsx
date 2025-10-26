import React, { useState } from 'react';
import { X, User, Building2, Mail, Calendar, Shield, CheckCircle, XCircle, AlertCircle, Settings, Lock, UserCheck, Edit3, Save, X as XIcon } from 'lucide-react';
import { AdminUser, UserType, UserRole, UserStatus, ProfileStatus } from '../types';
import { useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
import Toast, { ToastType } from './Toast';

interface UserDetailsModalProps {
  user: AdminUser;
  onClose: () => void;
  onUpdate?: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose, onUpdate }) => {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUser>(user);
  const [activeTab, setActiveTab] = useState<'account' | 'profile'>('account');
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  const closeToast = () => {
    setToast(null);
  };

  // Function to refresh user data
  const refreshUserData = async () => {
    try {
      const response = await api.get<{ user: AdminUser }>(`/admin/users/${user.id}`);
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const getStatusColor = (status: UserStatus | ProfileStatus) => {
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

  const getUserTypeColor = (role: UserRole) => {
    switch (role) {
      case 'PIN':
        return 'text-blue-600 bg-blue-100';
      case 'CSR_REP':
        return 'text-purple-600 bg-purple-100';
      case 'USER_ADMIN':
        return 'text-orange-600 bg-orange-100';
      case 'PLATFORM_MANAGER':
        return 'text-indigo-600 bg-indigo-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: UserStatus | ProfileStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'SUSPENDED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'DELETED':
        return <XCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  // Suspend/Activate User Account
  const handleAccountStatusChange = async (newStatus: UserStatus) => {
    if (isProcessing) return;
    
    const action = newStatus === 'SUSPENDED' ? 'suspend' : 'activate';
    const confirmMessage = newStatus === 'SUSPENDED' 
      ? 'Are you sure you want to suspend this user account? The user will not be able to login.'
      : 'Are you sure you want to activate this user account? The user will be able to login again.';
    
    if (!window.confirm(confirmMessage)) return;

    setIsProcessing(true);
    try {
      if (newStatus === 'SUSPENDED') {
        // Use the suspend route
        await api.put(`/admin/users/${user.id}/suspend`);
      } else {
        // Use the dedicated activate route
        await api.put(`/admin/users/${user.id}/activate`);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      if (onUpdate) onUpdate();
      
      // Refresh user data to show updated status
      await refreshUserData();
      
      // Show success toast instead of alert
      setToast({
        message: `User account ${action}ed successfully`,
        type: 'success'
      });
      
      // Don't close modal automatically
    } catch (error: any) {
      // Keep error alerts as they are (non-disappearing)
      alert(error.response?.data?.error || `Failed to ${action} user account`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Suspend/Activate User Profile
  const handleProfileStatusChange = async (newStatus: ProfileStatus) => {
    if (isProcessing) return;
    
    const action = newStatus === 'SUSPENDED' ? 'suspend' : 'activate';
    const confirmMessage = newStatus === 'SUSPENDED'
      ? 'Are you sure you want to suspend this user profile? The user can still login but cannot perform role-specific tasks.'
      : 'Are you sure you want to activate this user profile? The user will be able to perform role-specific tasks again.';
    
    if (!window.confirm(confirmMessage)) return;

    setIsProcessing(true);
    try {
      await api.put(`/admin/profiles/${user.id}/${action}`);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      if (onUpdate) onUpdate();
      
      // Refresh user data to show updated status
      await refreshUserData();
      
      // Show success toast instead of alert
      setToast({
        message: `User profile ${action}ed successfully`,
        type: 'success'
      });
      
      // Don't close modal automatically
    } catch (error: any) {
      // Keep error alerts as they are (non-disappearing)
      alert(error.response?.data?.error || `Failed to ${action} user profile`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getProfile = () => currentUser.pin || currentUser.csrRep || currentUser.platformManager;
  const profile = getProfile();
  const profileStatus = profile?.status || 'ACTIVE';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Edit functions
  const startEditingAccount = () => {
    setIsEditingAccount(true);
    setEditFormData({
      email: currentUser.email,
      status: currentUser.status
    });
  };

  const startEditingProfile = () => {
    setIsEditingProfile(true);
    const profileData = profile ? { ...profile } : {};
    setEditFormData(profileData);
  };

  const cancelEditing = () => {
    setIsEditingAccount(false);
    setIsEditingProfile(false);
    setEditFormData({});
  };

  const saveAccountChanges = async () => {
    setIsProcessing(true);
    try {
      await api.put(`/admin/users/${user.id}`, {
        email: editFormData.email,
        status: editFormData.status
      });
      await refreshUserData();
      setIsEditingAccount(false);
      setToast({
        message: 'Account updated successfully',
        type: 'success'
      });
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update account');
    } finally {
      setIsProcessing(false);
    }
  };

  const saveProfileChanges = async () => {
    setIsProcessing(true);
    try {
      await api.put(`/admin/profiles/${user.id}`, editFormData);
      await refreshUserData();
      setIsEditingProfile(false);
      setToast({
        message: 'Profile updated successfully',
        type: 'success'
      });
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">User Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                {user.role === 'PIN' ? (
                  <User className="h-8 w-8 text-gray-600" />
                ) : user.role === 'CSR_REP' ? (
                  <Building2 className="h-8 w-8 text-gray-600" />
                ) : user.role === 'PLATFORM_MANAGER' ? (
                  <Settings className="h-8 w-8 text-gray-600" />
                ) : (
                  <Shield className="h-8 w-8 text-gray-600" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-900">
                {currentUser.pin?.name || currentUser.csrRep?.companyName || currentUser.platformManager?.fullName || currentUser.email}
              </h4>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeColor(currentUser.role)}`}>
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('account')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'account'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Account
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Profile
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              {/* Account Header */}
              <div className="flex items-center justify-between">
                <h5 className="text-lg font-medium text-gray-900 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-blue-600" />
                  Account Information
                </h5>
                <div className="flex items-center space-x-2">
                  {!isEditingAccount ? (
                    <button
                      onClick={startEditingAccount}
                      className="flex items-center px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={saveAccountChanges}
                        disabled={isProcessing}
                        className="flex items-center px-3 py-1 text-sm font-medium text-green-600 hover:text-green-500 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex items-center px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-500"
                      >
                        <XIcon className="h-4 w-4 mr-1" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Email</p>
                      {isEditingAccount ? (
                        <input
                          type="email"
                          value={editFormData.email || ''}
                          onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{currentUser.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Account Created</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(currentUser.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Status</p>
                      {isEditingAccount ? (
                        <select
                          value={editFormData.status || ''}
                          onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="SUSPENDED">Suspended</option>
                          <option value="DEACTIVATED">Deactivated</option>
                        </select>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(currentUser.status)}`}>
                            {currentUser.status}
                          </span>
                          {getStatusIcon(currentUser.status)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              {!isEditingAccount && (
                <div className="flex space-x-2">
                  {currentUser.status === 'ACTIVE' ? (
                    <button
                      onClick={() => handleAccountStatusChange('SUSPENDED')}
                      disabled={isProcessing}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Suspend Account
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAccountStatusChange('ACTIVE')}
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate Account
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Profile Header */}
              <div className="flex items-center justify-between">
                <h5 className="text-lg font-medium text-gray-900 flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-purple-600" />
                  Profile Information
                </h5>
                <div className="flex items-center space-x-2">
                  {profile ? (
                    !isEditingProfile ? (
                      <button
                        onClick={startEditingProfile}
                        className="flex items-center px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-500"
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={saveProfileChanges}
                          disabled={isProcessing}
                          className="flex items-center px-3 py-1 text-sm font-medium text-green-600 hover:text-green-500 disabled:opacity-50"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="flex items-center px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-500"
                        >
                          <XIcon className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    )
                  ) : (
                    <p className="text-sm text-gray-500">No profile created yet</p>
                  )}
                </div>
              </div>

              {/* Profile Content */}
              {profile ? (
                <div className="space-y-4">
                  {/* Profile Status */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(profileStatus)}`}>
                          {profileStatus}
                        </span>
                        {getStatusIcon(profileStatus)}
                      </div>
                      {!isEditingProfile && (
                        <div className="flex space-x-2">
                          {profileStatus === 'ACTIVE' ? (
                            <button
                              onClick={() => handleProfileStatusChange('SUSPENDED')}
                              disabled={isProcessing}
                              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Suspend Profile
                            </button>
                          ) : (
                            <button
                              onClick={() => handleProfileStatusChange('ACTIVE')}
                              disabled={isProcessing}
                              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Activate Profile
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PIN Profile */}
                  {currentUser.pin && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h6 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Person in Need Profile
                      </h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              value={editFormData.name || ''}
                              onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-gray-900">{currentUser.pin.name}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Age</p>
                          {isEditingProfile ? (
                            <input
                              type="number"
                              value={editFormData.age || ''}
                              onChange={(e) => setEditFormData({...editFormData, age: parseInt(e.target.value)})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-gray-900">{currentUser.pin.age}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              value={editFormData.location || ''}
                              onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-gray-900">{currentUser.pin.location}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          {isEditingProfile ? (
                            <input
                              type="tel"
                              value={editFormData.phoneNumber || ''}
                              onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-gray-900">{currentUser.pin.phoneNumber}</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Accessibility Needs</p>
                        {isEditingProfile ? (
                          <textarea
                            value={editFormData.accessibilityNeeds || ''}
                            onChange={(e) => setEditFormData({...editFormData, accessibilityNeeds: e.target.value})}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            rows={3}
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{currentUser.pin.accessibilityNeeds}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CSR Rep Profile */}
                  {currentUser.csrRep && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h6 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <Building2 className="h-4 w-4 mr-2" />
                        CSR Representative Profile
                      </h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Company Name</p>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              value={editFormData.companyName || ''}
                              onChange={(e) => setEditFormData({...editFormData, companyName: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-gray-900">{currentUser.csrRep.companyName}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Registration Number</p>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              value={editFormData.companyRegistrationNumber || ''}
                              onChange={(e) => setEditFormData({...editFormData, companyRegistrationNumber: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-gray-900">{currentUser.csrRep.companyRegistrationNumber}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Contact Person</p>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              value={editFormData.contactPerson || ''}
                              onChange={(e) => setEditFormData({...editFormData, contactPerson: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-gray-900">{currentUser.csrRep.contactPerson}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          {isEditingProfile ? (
                            <input
                              type="tel"
                              value={editFormData.phoneNumber || ''}
                              onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-gray-900">{currentUser.csrRep.phoneNumber}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Industry</p>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              value={editFormData.industry || ''}
                              onChange={(e) => setEditFormData({...editFormData, industry: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-gray-900">{currentUser.csrRep.industry}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Company Address</p>
                          {isEditingProfile ? (
                            <textarea
                              value={editFormData.companyAddress || ''}
                              onChange={(e) => setEditFormData({...editFormData, companyAddress: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              rows={2}
                            />
                          ) : (
                            <p className="text-sm font-medium text-gray-900">{currentUser.csrRep.companyAddress}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Platform Manager Profile */}
                  {currentUser.platformManager && (
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h6 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Platform Manager Profile
                      </h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              value={editFormData.fullName || ''}
                              onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-gray-900">{currentUser.platformManager.fullName}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Department</p>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              value={editFormData.department || ''}
                              onChange={(e) => setEditFormData({...editFormData, department: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-gray-900">{currentUser.platformManager.department}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          {isEditingProfile ? (
                            <input
                              type="tel"
                              value={editFormData.phone || ''}
                              onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-gray-900">{currentUser.platformManager.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-4">
                    No profile has been created for this user yet.
                  </p>
                  <p className="text-xs text-gray-500">
                    Create a profile to enable role-specific functionality.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Close
          </button>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default UserDetailsModal;
