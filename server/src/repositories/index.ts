import { User, Volunteer, Organization, CSROpportunity, VolunteerRequest, Matching } from '@/entities';

// Repository: User
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  findAll(limit?: number, offset?: number): Promise<User[]>;
}

// Repository: Volunteer
export interface VolunteerRepository {
  findById(id: string): Promise<Volunteer | null>;
  findByEmail(email: string): Promise<Volunteer | null>;
  create(volunteer: Omit<Volunteer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Volunteer>;
  update(id: string, updates: Partial<Volunteer>): Promise<Volunteer | null>;
  delete(id: string): Promise<boolean>;
  findAll(limit?: number, offset?: number): Promise<Volunteer[]>;
  findBySkills(skills: string[]): Promise<Volunteer[]>;
  findByLocation(location: string): Promise<Volunteer[]>;
}

// Repository: Organization
export interface OrganizationRepository {
  findById(id: string): Promise<Organization | null>;
  findByEmail(email: string): Promise<Organization | null>;
  create(organization: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Promise<Organization>;
  update(id: string, updates: Partial<Organization>): Promise<Organization | null>;
  delete(id: string): Promise<boolean>;
  findAll(limit?: number, offset?: number): Promise<Organization[]>;
  findByLocation(location: string): Promise<Organization[]>;
  findVerified(): Promise<Organization[]>;
}

// Repository: CSR Opportunity
export interface CSROpportunityRepository {
  findById(id: string): Promise<CSROpportunity | null>;
  create(opportunity: Omit<CSROpportunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CSROpportunity>;
  update(id: string, updates: Partial<CSROpportunity>): Promise<CSROpportunity | null>;
  delete(id: string): Promise<boolean>;
  findAll(limit?: number, offset?: number): Promise<CSROpportunity[]>;
  findByOrganization(organizationId: string): Promise<CSROpportunity[]>;
  findBySkills(skills: string[]): Promise<CSROpportunity[]>;
  findByLocation(location: string): Promise<CSROpportunity[]>;
  findActive(): Promise<CSROpportunity[]>;
}

// Repository: Volunteer Request
export interface VolunteerRequestRepository {
  findById(id: string): Promise<VolunteerRequest | null>;
  create(request: Omit<VolunteerRequest, 'id' | 'appliedAt'>): Promise<VolunteerRequest>;
  update(id: string, updates: Partial<VolunteerRequest>): Promise<VolunteerRequest | null>;
  delete(id: string): Promise<boolean>;
  findAll(limit?: number, offset?: number): Promise<VolunteerRequest[]>;
  findByVolunteer(volunteerId: string): Promise<VolunteerRequest[]>;
  findByOpportunity(opportunityId: string): Promise<VolunteerRequest[]>;
  findByStatus(status: string): Promise<VolunteerRequest[]>;
}

// Repository: Matching
export interface MatchingRepository {
  findById(id: string): Promise<Matching | null>;
  create(matching: Omit<Matching, 'id' | 'createdAt'>): Promise<Matching>;
  update(id: string, updates: Partial<Matching>): Promise<Matching | null>;
  delete(id: string): Promise<boolean>;
  findAll(limit?: number, offset?: number): Promise<Matching[]>;
  findByVolunteer(volunteerId: string): Promise<Matching[]>;
  findByOpportunity(opportunityId: string): Promise<Matching[]>;
  findTopMatches(volunteerId: string, limit?: number): Promise<Matching[]>;
}
