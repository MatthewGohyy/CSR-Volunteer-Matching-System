import React from 'react';
import { X, User, Building2, Mail, Phone, MapPin, Calendar, Shield, CheckCircle, XCircle, AlertCircle, Settings } from 'lucide-react';
import { AdminUser, UserType, UserStatus } from '../types';

interface UserDetailsModalProps {
  user: AdminUser;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose }) => {
  const getStatusColor = (status: UserStatus) => {
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

  const getStatusIcon = (status: UserStatus) => {
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
                {user.pin?.name || user.csrRep?.companyName || user.platformManager?.fullName || user.email}
              </h4>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeColor(user.userType)}`}>
                  {user.userType}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
                {getStatusIcon(user.status)}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* PIN Profile */}
          {user.pin && (
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
                    <p className="text-sm font-medium text-gray-900">{user.pin.name}</p>
                  </div>
                </div>
                {user.pin.age && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="text-sm font-medium text-gray-900">{user.pin.age}</p>
                    </div>
                  </div>
                )}
                {user.pin.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">{user.pin.location}</p>
                    </div>
                  </div>
                )}
                {user.pin.phoneNumber && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{user.pin.phoneNumber}</p>
                    </div>
                  </div>
                )}
              </div>
              {user.pin.accessibilityNeeds && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">Accessibility Needs</p>
                  <p className="text-sm text-gray-900">{user.pin.accessibilityNeeds}</p>
                </div>
              )}
            </div>
          )}

          {/* CSR Rep Profile */}
          {user.csrRep && (
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
                    <p className="text-sm font-medium text-gray-900">{user.csrRep.companyName}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Registration Number</p>
                    <p className="text-sm font-medium text-gray-900">{user.csrRep.companyRegistrationNumber}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Contact Person</p>
                    <p className="text-sm font-medium text-gray-900">{user.csrRep.contactPerson}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-sm font-medium text-gray-900">{user.csrRep.phoneNumber}</p>
                  </div>
                </div>
                {user.csrRep.industry && (
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Industry</p>
                      <p className="text-sm font-medium text-gray-900">{user.csrRep.industry}</p>
                    </div>
                  </div>
                )}
                {user.csrRep.companyAddress && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Company Address</p>
                      <p className="text-sm font-medium text-gray-900">{user.csrRep.companyAddress}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Platform Manager Profile */}
          {user.platformManager && (
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
                    <p className="text-sm font-medium text-gray-900">{user.platformManager.fullName}</p>
                  </div>
                </div>
                {user.platformManager.department && (
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="text-sm font-medium text-gray-900">{user.platformManager.department}</p>
                    </div>
                  </div>
                )}
                {user.platformManager.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{user.platformManager.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-900 mb-3">Account Status</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                {getStatusIcon(user.status)}
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Current Status</p>
                  <p className="text-sm font-medium text-gray-900">{user.status}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </div>
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
    </div>
  );
};

export default UserDetailsModal;
