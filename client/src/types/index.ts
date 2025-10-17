// User Types
export type UserType = 'PIN' | 'CSR_REP' | 'ADMIN' | 'PLATFORM_MANAGER';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

export interface User {
  id: string;
  email: string;
  userType: UserType;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PINProfile {
  id: string;
  userId: string;
  name: string;
  age?: number;
  location?: string;
  phoneNumber?: string;
  accessibilityNeeds?: string;
  profilePhoto?: string;
}

export interface CSRRepProfile {
  id: string;
  userId: string;
  companyName: string;
  companyRegistrationNumber: string;
  industry?: string;
  contactPerson: string;
  phoneNumber: string;
  companyAddress?: string;
  companyLogo?: string;
}

export interface PlatformManagerProfile {
  id: string;
  userId: string;
  fullName: string;
  department?: string;
  phone?: string;
}

// Request/Opportunity Types
export type RequestStatus = 'ACTIVE' | 'MATCHED' | 'COMPLETED' | 'CANCELLED';
export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Request {
  id: string;
  pinId: string;
  categoryId: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  dateNeeded?: string;
  location?: string;
  status: RequestStatus;
  viewCount: number;
  shortlistCount: number;
  createdAt: string;
  updatedAt: string;
  category?: ServiceCategory;
  pin?: PINProfile;
}

// Match Types
export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';
export type MatchStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface VolunteerOffer {
  id: string;
  csrRepId: string;
  requestId: string;
  message?: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
  csrRep?: CSRRepProfile;
  request?: Request;
}

export interface Match {
  id: string;
  requestId: string;
  csrRepId: string;
  pinId: string;
  status: MatchStatus;
  matchedAt: string;
  completedAt?: string;
  cancellationReason?: string;
  updatedAt: string;
  request?: Request;
  csrRep?: CSRRepProfile;
  pin?: PINProfile;
}

// Notification Types
export type NotificationType = 
  | 'VOLUNTEER_OFFER'
  | 'OFFER_ACCEPTED'
  | 'OFFER_DECLINED'
  | 'MATCH_CONFIRMED'
  | 'MATCH_CANCELLED'
  | 'REQUEST_UPDATED';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPINData {
  email: string;
  password: string;
  name: string;
  age?: number;
  location?: string;
  phoneNumber?: string;
  accessibilityNeeds?: string;
}

export interface RegisterCSRRepData {
  email: string;
  password: string;
  companyName: string;
  companyRegistrationNumber: string;
  industry?: string;
  contactPerson: string;
  phoneNumber: string;
  companyAddress?: string;
}

export interface RegisterPlatformManagerData {
  email: string;
  password: string;
  fullName: string;
  department?: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    userType: UserType;
    profile: PINProfile | CSRRepProfile | PlatformManagerProfile | null;
  };
  token: string;
}

