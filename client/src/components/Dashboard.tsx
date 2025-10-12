import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, LogOut, User, Building2 } from 'lucide-react';
import { authService } from '../services/authService';

interface DashboardProps {
  userType: 'PIN' | 'CSR_REP' | 'ADMIN';
}

const Dashboard: React.FC<DashboardProps> = ({ userType }) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
  });

  const handleLogout = () => {
    authService.logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const getDashboardTitle = () => {
    switch (userType) {
      case 'PIN':
        return 'Person in Need Dashboard';
      case 'CSR_REP':
        return 'CSR Representative Dashboard';
      case 'ADMIN':
        return 'Admin Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const getDashboardIcon = () => {
    switch (userType) {
      case 'PIN':
        return <User className="h-8 w-8 text-primary-600" />;
      case 'CSR_REP':
        return <Building2 className="h-8 w-8 text-primary-600" />;
      case 'ADMIN':
        return <Heart className="h-8 w-8 text-primary-600" />;
      default:
        return <Heart className="h-8 w-8 text-primary-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {getDashboardIcon()}
              <span className="ml-2 text-xl font-bold text-gray-900">
                {getDashboardTitle()}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to your dashboard!
              </h2>
              <p className="text-gray-600 mb-6">
                You are logged in as a <span className="font-semibold text-primary-600">{userType}</span>
              </p>
              
              {userType === 'PIN' && (
                <div className="space-y-4">
                  <p className="text-gray-700">
                    As a Person in Need, you can:
                  </p>
                  <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
                    <li>• Create service requests</li>
                    <li>• View volunteer offers</li>
                    <li>• Manage your profile</li>
                    <li>• Track request status</li>
                  </ul>
                </div>
              )}

              {userType === 'CSR_REP' && (
                <div className="space-y-4">
                  <p className="text-gray-700">
                    As a CSR Representative, you can:
                  </p>
                  <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
                    <li>• Browse service requests</li>
                    <li>• Submit volunteer offers</li>
                    <li>• Manage company profile</li>
                    <li>• Track volunteer activities</li>
                  </ul>
                </div>
              )}

              {userType === 'ADMIN' && (
                <div className="space-y-4">
                  <p className="text-gray-700">
                    As an Admin, you can:
                  </p>
                  <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
                    <li>• Manage user accounts</li>
                    <li>• Approve CSR representatives</li>
                    <li>• Monitor system activity</li>
                    <li>• Manage service categories</li>
                  </ul>
                </div>
              )}

              <div className="mt-8">
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
