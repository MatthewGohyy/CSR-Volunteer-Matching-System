// Export entity classes
export { UserAccountEntity } from './UserAccount.entity';
export { UserProfileEntity } from './UserProfile.entity';

// Legacy exports for backwards compatibility (to be deprecated)
export { UserAccountEntity as UserEntity } from './UserAccount.entity';

// Legacy exports (to be deprecated)
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  VOLUNTEER = 'volunteer',
  ORGANIZATION = 'organization',
  ADMIN = 'admin'
}

// Entity: Volunteer
export interface Volunteer extends User {
  role: UserRole.VOLUNTEER;
  skills: string[];
  interests: string[];
  availability: Availability[];
  location?: Location;
  bio?: string;
}

// Entity: Organization
export interface Organization extends User {
  role: UserRole.ORGANIZATION;
  organizationName: string;
  description: string;
  website?: string;
  location: Location;
  verified: boolean;
}

// Entity: CSR Opportunity
export interface CSROpportunity {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  location: Location;
  startDate: Date;
  endDate: Date;
  maxVolunteers: number;
  currentVolunteers: number;
  status: OpportunityStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum OpportunityStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  FULL = 'full',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Entity: Volunteer Request
export interface VolunteerRequest {
  id: string;
  volunteerId: string;
  opportunityId: string;
  status: RequestStatus;
  message?: string;
  appliedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

// Entity: Matching
export interface Matching {
  id: string;
  volunteerId: string;
  opportunityId: string;
  score: number;
  reasons: string[];
  createdAt: Date;
}

// Supporting Types
export interface Location {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Availability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
}
