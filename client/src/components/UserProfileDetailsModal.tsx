import React, { useState } from 'react';
import { X, Shield, CheckCircle, XCircle, AlertCircle, Edit3, Save, X as XIcon, Calendar, FileText } from 'lucide-react';
import { UserProfile } from '../types';
import { useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
import Toast, { ToastType } from './Toast';

interface UserProfileDetailsModalProps {
  profile: UserProfile;
  onClose: () => void;
  onUpdate?: () => void;
}

const UserProfileDetailsModal: React.FC<UserProfileDetailsModalProps> = ({ profile, onClose, onUpdate }) => {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    description: string;
    isActive: boolean;
  }>({
    name: profile.name,
    description: profile.description || '',
    isActive: profile.isActive,
  });

  const closeToast = () => {
    setToast(null);
  };

  // Function to refresh profile data
  const refreshProfileData = async () => {
    try {
      const response = await api.get<{ profile: UserProfile }>(`/admin/profiles/${profile.id}`);
      setCurrentProfile(response.data.profile);
      setEditFormData({
        name: response.data.profile.name,
        description: response.data.profile.description || '',
        isActive: response.data.profile.isActive,
      });
    } catch (error) {
      console.error('Failed to refresh profile data:', error);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  // Suspend/Activate User Profile
  const handleProfileStatusChange = async (newStatus: boolean) => {
    if (isProcessing) return;
    
    const action = newStatus ? 'activate' : 'suspend';
    const confirmMessage = newStatus
      ? 'Are you sure you want to activate this user profile? This role will be enabled for all users.'
      : 'Are you sure you want to suspend this user profile? This role will be disabled for all users.';
    
    if (!window.confirm(confirmMessage)) return;

    setIsProcessing(true);
    try {
      if (newStatus) {
        await api.put(`/admin/profiles/${profile.id}/activate`);
      } else {
        await api.put(`/admin/profiles/${profile.id}/suspend`);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
      if (onUpdate) onUpdate();
      
      // Refresh profile data to show updated status
      await refreshProfileData();
      
      setToast({
        message: `User profile ${action}d successfully`,
        type: 'success'
      });
    } catch (error: any) {
      alert(error.response?.data?.error || `Failed to ${action} user profile`);
    } finally {
      setIsProcessing(false);
    }
  };

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
  const startEditing = () => {
    setIsEditing(true);
    setEditFormData({
      name: currentProfile.name,
      description: currentProfile.description || '',
      isActive: currentProfile.isActive,
    });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditFormData({
      name: currentProfile.name,
      description: currentProfile.description || '',
      isActive: currentProfile.isActive,
    });
  };

  const saveChanges = async () => {
    setIsProcessing(true);
    try {
      // Build update payload - only send fields that can be updated
      const updatePayload: Partial<{
        name: string;
        description: string;
        isActive: boolean;
      }> = {};

      if (editFormData.name !== currentProfile.name) {
        updatePayload.name = editFormData.name;
      }
      if (editFormData.description !== (currentProfile.description || '')) {
        updatePayload.description = editFormData.description;
      }
      if (editFormData.isActive !== currentProfile.isActive) {
        updatePayload.isActive = editFormData.isActive;
      }

      await api.put(`/admin/profiles/${profile.id}`, updatePayload);
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
      if (onUpdate) onUpdate();
      
      await refreshProfileData();
      setIsEditing(false);
      
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
          <h3 className="text-lg font-medium text-gray-900">User Profile Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="text-xl font-semibold text-gray-900">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      className="px-2 py-1 border border-gray-300 rounded-md text-xl font-semibold w-full max-w-md"
                    />
                  ) : (
                    currentProfile.name
                  )}
                </h4>
                {!isEditing && (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(currentProfile.isActive)}`}>
                    {currentProfile.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                )}
              </div>
              {!isEditing && (
                <div className="flex items-center space-x-2 mt-2">
                  {getStatusIcon(currentProfile.isActive)}
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            {/* Profile Header */}
            <div className="flex items-center justify-between">
              <h5 className="text-lg font-medium text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary-600" />
                Profile Information
              </h5>
              <div className="flex items-center space-x-2">
                {!isEditing ? (
                  <button
                    onClick={startEditing}
                    className="flex items-center px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={saveChanges}
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

            {/* Profile Details Card */}
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Profile Name</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900">{currentProfile.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Profile Created</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(currentProfile.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900">
                      {currentProfile.updatedAt ? formatDate(currentProfile.updatedAt) : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Status</p>
                    {isEditing ? (
                      <select
                        value={editFormData.isActive ? 'true' : 'false'}
                        onChange={(e) => setEditFormData({...editFormData, isActive: e.target.value === 'true'})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(currentProfile.isActive)}`}>
                          {currentProfile.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                        {getStatusIcon(currentProfile.isActive)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start md:col-span-2">
                  <FileText className="h-4 w-4 text-gray-400 mr-3 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Description</p>
                    {isEditing ? (
                      <textarea
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {currentProfile.description || 'No description provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Actions */}
            {!isEditing && (
              <div className="flex space-x-2">
                {currentProfile.isActive ? (
                  <button
                    onClick={() => handleProfileStatusChange(false)}
                    disabled={isProcessing}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Suspend Profile
                  </button>
                ) : (
                  <button
                    onClick={() => handleProfileStatusChange(true)}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate Profile
                  </button>
                )}
              </div>
            )}
          </div>
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

export default UserProfileDetailsModal;

