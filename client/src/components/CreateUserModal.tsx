import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { X, User, Building2, Mail, Lock, Phone, MapPin, Calendar, Settings, Shield } from 'lucide-react';
import api from '../config/api';
import { CreateUserData, AdminUser, UserProfile } from '../types';

interface CreateUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<any>({
    email: '',
    password: '',
    userProfileId: '',
    name: '',
    // Additional fields
    age: undefined,
    location: '',
    phoneNumber: '',
    accessibilityNeeds: '',
    companyName: '',
    companyRegistrationNumber: '',
    industry: '',
    contactPerson: '',
    companyAddress: '',
    department: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch available profiles
  const { data: profilesData } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const response = await api.get<{ profiles: UserProfile[] }>('/admin/profiles');
      return response.data;
    },
  });
  
  const profiles = profilesData?.profiles || [];
  
  // Get selected profile to determine which fields to show
  const selectedProfile = profiles.find(p => p.id === formData.userProfileId);

  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserData): Promise<AdminUser> => {
      // Direct API call to controller (Boundary -> Controller)
      const response = await api.post<{ user: AdminUser; message: string }>('/admin/users', userData);
      return response.data.user;
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to create user';
      setErrors({ general: errorMessage });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Common validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.userProfileId) {
      newErrors.userProfileId = 'Please select a user profile';
    }

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setErrors({});
    
    // Prepare data - send all form data
    const submitData: any = {
      email: formData.email,
      password: formData.password,
      userProfileId: formData.userProfileId,
      name: formData.name,
      ...(formData.age && { age: parseInt(formData.age.toString()) }),
      ...(formData.location && { location: formData.location }),
      ...(formData.phoneNumber && { phoneNumber: formData.phoneNumber }),
      ...(formData.accessibilityNeeds && { accessibilityNeeds: formData.accessibilityNeeds }),
      ...(formData.companyName && { companyName: formData.companyName }),
      ...(formData.companyRegistrationNumber && { companyRegistrationNumber: formData.companyRegistrationNumber }),
      ...(formData.industry && { industry: formData.industry }),
      ...(formData.contactPerson && { contactPerson: formData.contactPerson }),
      ...(formData.companyAddress && { companyAddress: formData.companyAddress }),
      ...(formData.fullName && { fullName: formData.fullName }),
      ...(formData.department && { department: formData.department }),
      ...(formData.phone && { phone: formData.phone }),
    };

    createUserMutation.mutate(submitData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Create New User</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          )}

          {/* User Profile Selection - Aesthetic Card Layout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select User Profile *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {profiles.map((profile) => (
                <label
                  key={profile.id}
                  className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    formData.userProfileId === profile.id
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-gray-300 bg-white hover:border-primary-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="userProfileId"
                    value={profile.id}
                    checked={formData.userProfileId === profile.id}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <Shield className={`h-5 w-5 mr-3 ${
                    formData.userProfileId === profile.id ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${
                      formData.userProfileId === profile.id ? 'text-primary-900' : 'text-gray-900'
                    }`}>
                      {profile.name}
                    </div>
                    {profile.description && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {profile.description}
                      </div>
                    )}
                  </div>
                  {formData.userProfileId === profile.id && (
                    <div className="absolute top-2 right-2">
                      <div className="h-2 w-2 bg-primary-600 rounded-full"></div>
                    </div>
                  )}
                </label>
              ))}
            </div>
            {errors.userProfileId && (
              <p className="mt-2 text-sm text-red-600">{errors.userProfileId}</p>
            )}
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                }`}
                placeholder="Enter full name"
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  }`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                    errors.password
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  }`}
                  placeholder="Enter password"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Dynamic Profile-Specific Fields */}
          {selectedProfile && (
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                {selectedProfile.name} Information
              </h4>
              <div>
              {/* Person in Need specific fields */}
              {(selectedProfile.name === 'Person in Need' || selectedProfile.name === 'PIN') && (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        id="age"
                        name="age"
                        type="number"
                        min="1"
                        max="120"
                        value={formData.age || ''}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Enter age"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Enter location"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="accessibilityNeeds" className="block text-sm font-medium text-gray-700 mb-2">
                      Accessibility Needs
                    </label>
                    <textarea
                      id="accessibilityNeeds"
                      name="accessibilityNeeds"
                      rows={2}
                      value={formData.accessibilityNeeds}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Describe any accessibility needs"
                    />
                  </div>
                </div>
                </>
              )}

              {/* CSR Representative specific fields */}
              {(selectedProfile.name === 'CSR Representative' || selectedProfile.name === 'CSR_REP') && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                        errors.companyName
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                      }`}
                      placeholder="Enter company name"
                    />
                  </div>
                  {errors.companyName && (
                    <p className="mt-2 text-sm text-red-600">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="companyRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number
                  </label>
                  <input
                    id="companyRegistrationNumber"
                    name="companyRegistrationNumber"
                    type="text"
                    value={formData.companyRegistrationNumber}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                      errors.companyRegistrationNumber
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                    placeholder="Enter registration number"
                  />
                  {errors.companyRegistrationNumber && (
                    <p className="mt-2 text-sm text-red-600">{errors.companyRegistrationNumber}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="contactPerson"
                      name="contactPerson"
                      type="text"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                        errors.contactPerson
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                      }`}
                      placeholder="Enter contact person name"
                    />
                  </div>
                  {errors.contactPerson && (
                    <p className="mt-2 text-sm text-red-600">{errors.contactPerson}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                        errors.phoneNumber
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                      }`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <input
                    id="industry"
                    name="industry"
                    type="text"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter industry"
                  />
                </div>

                <div>
                  <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="companyAddress"
                      name="companyAddress"
                      type="text"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Enter company address"
                    />
                  </div>
                </div>
              </div>
              </div>
              )}

              {/* Platform Manager specific fields */}
              {(selectedProfile.name === 'Platform Manager' || selectedProfile.name === 'PLATFORM_MANAGER') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      id="department"
                      name="department"
                      type="text"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Enter department"
                    />
                  </div>
                </div>
              )}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createUserMutation.isPending}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {createUserMutation.isPending ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
