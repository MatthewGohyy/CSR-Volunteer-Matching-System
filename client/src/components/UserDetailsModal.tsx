import React, { useState } from 'react';
import { X, User, Building2, Mail, Phone, MapPin, Calendar, Shield, CheckCircle, XCircle, AlertCircle, Settings, Lock, UserCheck } from 'lucide-react';
import { AdminUser, UserType, UserStatus, ProfileStatus } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
      case 'DEACTIVATED':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getUserTypeColor = (userType: UserType) => {
    switch (userType) {
      case 'PIN':
        return 'text-blue-600 bg-blue-100';
      case 'CSR_REP':
        return 'text-purple-600 bg-purple-100';
      case 'ADMIN':
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
      case 'DEACTIVATED':
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
                {user.userType === 'PIN' ? (
                  <User className="h-8 w-8 text-gray-600" />
                ) : user.userType === 'CSR_REP' ? (
                  <Building2 className="h-8 w-8 text-gray-600" />
                ) : user.userType === 'PLATFORM_MANAGER' ? (
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
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeColor(currentUser.userType)}`}>
                  {currentUser.userType}
                </span>
              </div>
            </div>
          </div>

          {/* === USER ACCOUNT SECTION === */}
          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-base font-semibold text-gray-900 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-blue-600" />
                User Account (Authentication)
              </h5>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(currentUser.status)}`}>
                  {currentUser.status}
                </span>
                {getStatusIcon(currentUser.status)}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {currentUser.status === 'SUSPENDED' 
                ? '⚠️ User cannot login - Account is suspended' 
                : currentUser.status === 'ACTIVE'
                ? '✓ User can login - Account is active'
                : 'Account is deactivated'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{currentUser.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(currentUser.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Account Action Buttons */}
            <div className="flex space-x-2 pt-2 border-t border-blue-200">
              {currentUser.status === 'ACTIVE' ? (
                <button
                  onClick={() => handleAccountStatusChange('SUSPENDED')}
                  disabled={isProcessing}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Suspend Account (Block Login)
                </button>
              ) : (
                <button
                  onClick={() => handleAccountStatusChange('ACTIVE')}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activate Account (Allow Login)
                </button>
              )}
            </div>
          </div>

          {/* === USER PROFILE SECTION === */}
          {currentUser.userType !== 'ADMIN' && profile && (
            <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-base font-semibold text-gray-900 flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-purple-600" />
                  User Profile (Role & Permissions)
                </h5>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(profileStatus)}`}>
                    {profileStatus}
                  </span>
                  {getStatusIcon(profileStatus)}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {profileStatus === 'SUSPENDED'
                  ? '⚠️ User can login but cannot perform role-specific tasks - Profile is suspended'
                  : profileStatus === 'ACTIVE'
                  ? '✓ User can perform all role-specific tasks - Profile is active'
                  : 'Profile is deactivated'}
              </p>

              {/* Profile Action Buttons */}
              <div className="flex space-x-2 pt-2 border-t border-purple-200">
                {profileStatus === 'ACTIVE' ? (
                  <button
                    onClick={() => handleProfileStatusChange('SUSPENDED')}
                    disabled={isProcessing}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Suspend Profile (Disable Tasks)
                  </button>
                ) : (
                  <button
                    onClick={() => handleProfileStatusChange('ACTIVE')}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate Profile (Enable Tasks)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* PIN Profile */}
          {currentUser.pin && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Person in Need Profile
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">{currentUser.pin.name}</p>
                  </div>
                </div>
                {currentUser.pin.age && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="text-sm font-medium text-gray-900">{currentUser.pin.age}</p>
                    </div>
                  </div>
                )}
                {currentUser.pin.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">{currentUser.pin.location}</p>
                    </div>
                  </div>
                )}
                {currentUser.pin.phoneNumber && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{currentUser.pin.phoneNumber}</p>
                    </div>
                  </div>
                )}
              </div>
              {currentUser.pin.accessibilityNeeds && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">Accessibility Needs</p>
                  <p className="text-sm text-gray-900">{currentUser.pin.accessibilityNeeds}</p>
                </div>
              )}
            </div>
          )}

          {/* CSR Rep Profile */}
          {currentUser.csrRep && (
            <div className="bg-purple-50 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                CSR Representative Profile
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Company Name</p>
                    <p className="text-sm font-medium text-gray-900">{currentUser.csrRep.companyName}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Registration Number</p>
                    <p className="text-sm font-medium text-gray-900">{currentUser.csrRep.companyRegistrationNumber}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Contact Person</p>
                    <p className="text-sm font-medium text-gray-900">{currentUser.csrRep.contactPerson}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-sm font-medium text-gray-900">{currentUser.csrRep.phoneNumber}</p>
                  </div>
                </div>
                {currentUser.csrRep.industry && (
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Industry</p>
                      <p className="text-sm font-medium text-gray-900">{currentUser.csrRep.industry}</p>
                    </div>
                  </div>
                )}
                {currentUser.csrRep.companyAddress && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Company Address</p>
                      <p className="text-sm font-medium text-gray-900">{currentUser.csrRep.companyAddress}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Platform Manager Profile */}
          {currentUser.platformManager && (
            <div className="bg-indigo-50 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Platform Manager Profile
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">{currentUser.platformManager.fullName}</p>
                  </div>
                </div>
                {currentUser.platformManager.department && (
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="text-sm font-medium text-gray-900">{currentUser.platformManager.department}</p>
                    </div>
                  </div>
                )}
                {currentUser.platformManager.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{currentUser.platformManager.phone}</p>
                    </div>
                  </div>
                )}
              </div>
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
