import { 
  User, Volunteer, Organization, CSROpportunity, Matching,
  UserRole, OpportunityStatus 
} from '@/entities';
import { 
  CreateUserDTO, CreateVolunteerDTO, CreateOrganizationDTO, CreateCSROpportunityDTO,
  UpdateUserDTO, UpdateVolunteerDTO, UpdateOrganizationDTO,
  UpdateCSROpportunityDTO, ApiResponseDTO 
} from '@/dto';
import { 
  UserRepository, VolunteerRepository, OrganizationRepository, 
  CSROpportunityRepository, MatchingRepository 
} from '@/repositories';

// Service: User Service (Control)
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userData: CreateUserDTO): Promise<ApiResponseDTO<User>> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists'
        };
      }

      const user = await this.userRepository.create({
        ...userData,
        role: userData.role as UserRole
      });

      return {
        success: true,
        data: user,
        message: 'User created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create user'
      };
    }
  }

  async getUserById(id: string): Promise<ApiResponseDTO<User>> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to retrieve user'
      };
    }
  }

  async updateUser(id: string, updates: UpdateUserDTO): Promise<ApiResponseDTO<User>> {
    try {
      const user = await this.userRepository.update(id, {
        ...updates,
        updatedAt: new Date()
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        data: user,
        message: 'User updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update user'
      };
    }
  }

  async deleteUser(id: string): Promise<ApiResponseDTO<boolean>> {
    try {
      const deleted = await this.userRepository.delete(id);
      if (!deleted) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        data: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete user'
      };
    }
  }

  async getAllUsers(limit?: number, offset?: number): Promise<ApiResponseDTO<User[]>> {
    try {
      const users = await this.userRepository.findAll(limit, offset);
      return {
        success: true,
        data: users
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to retrieve users'
      };
    }
  }
}

// Service: Volunteer Service (Control)
export class VolunteerService {
  constructor(private volunteerRepository: VolunteerRepository) {}

  async createVolunteer(volunteerData: CreateVolunteerDTO): Promise<ApiResponseDTO<Volunteer>> {
    try {
      const volunteer = await this.volunteerRepository.create({
        ...volunteerData,
        role: UserRole.VOLUNTEER
      });

      return {
        success: true,
        data: volunteer,
        message: 'Volunteer created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create volunteer'
      };
    }
  }

  async getVolunteerById(id: string): Promise<ApiResponseDTO<Volunteer>> {
    try {
      const volunteer = await this.volunteerRepository.findById(id);
      if (!volunteer) {
        return {
          success: false,
          error: 'Volunteer not found'
        };
      }

      return {
        success: true,
        data: volunteer
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to retrieve volunteer'
      };
    }
  }

  async updateVolunteer(id: string, updates: UpdateVolunteerDTO): Promise<ApiResponseDTO<Volunteer>> {
    try {
      const volunteer = await this.volunteerRepository.update(id, {
        ...updates,
        updatedAt: new Date()
      });

      if (!volunteer) {
        return {
          success: false,
          error: 'Volunteer not found'
        };
      }

      return {
        success: true,
        data: volunteer,
        message: 'Volunteer updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update volunteer'
      };
    }
  }

  async findVolunteersBySkills(skills: string[]): Promise<ApiResponseDTO<Volunteer[]>> {
    try {
      const volunteers = await this.volunteerRepository.findBySkills(skills);
      return {
        success: true,
        data: volunteers
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to find volunteers by skills'
      };
    }
  }
}

// Service: Organization Service (Control)
export class OrganizationService {
  constructor(private organizationRepository: OrganizationRepository) {}

  async createOrganization(orgData: CreateOrganizationDTO): Promise<ApiResponseDTO<Organization>> {
    try {
      const organization = await this.organizationRepository.create({
        ...orgData,
        role: UserRole.ORGANIZATION,
        verified: false
      });

      return {
        success: true,
        data: organization,
        message: 'Organization created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create organization'
      };
    }
  }

  async getOrganizationById(id: string): Promise<ApiResponseDTO<Organization>> {
    try {
      const organization = await this.organizationRepository.findById(id);
      if (!organization) {
        return {
          success: false,
          error: 'Organization not found'
        };
      }

      return {
        success: true,
        data: organization
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to retrieve organization'
      };
    }
  }

  async updateOrganization(id: string, updates: UpdateOrganizationDTO): Promise<ApiResponseDTO<Organization>> {
    try {
      const organization = await this.organizationRepository.update(id, {
        ...updates,
        updatedAt: new Date()
      });

      if (!organization) {
        return {
          success: false,
          error: 'Organization not found'
        };
      }

      return {
        success: true,
        data: organization,
        message: 'Organization updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update organization'
      };
    }
  }

  async getVerifiedOrganizations(): Promise<ApiResponseDTO<Organization[]>> {
    try {
      const organizations = await this.organizationRepository.findVerified();
      return {
        success: true,
        data: organizations
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to retrieve verified organizations'
      };
    }
  }
}

// Service: CSR Opportunity Service (Control)
export class CSROpportunityService {
  constructor(
    private opportunityRepository: CSROpportunityRepository,
    private organizationRepository: OrganizationRepository
  ) {}

  async createOpportunity(opportunityData: CreateCSROpportunityDTO): Promise<ApiResponseDTO<CSROpportunity>> {
    try {
      // Verify organization exists
      const organization = await this.organizationRepository.findById(opportunityData.organizationId);
      if (!organization) {
        return {
          success: false,
          error: 'Organization not found'
        };
      }

      const opportunity = await this.opportunityRepository.create({
        ...opportunityData,
        startDate: new Date(opportunityData.startDate),
        endDate: new Date(opportunityData.endDate),
        currentVolunteers: 0,
        status: OpportunityStatus.ACTIVE
      });

      return {
        success: true,
        data: opportunity,
        message: 'CSR opportunity created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create CSR opportunity'
      };
    }
  }

  async getOpportunityById(id: string): Promise<ApiResponseDTO<CSROpportunity>> {
    try {
      const opportunity = await this.opportunityRepository.findById(id);
      if (!opportunity) {
        return {
          success: false,
          error: 'Opportunity not found'
        };
      }

      return {
        success: true,
        data: opportunity
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to retrieve opportunity'
      };
    }
  }

  async updateOpportunity(id: string, updates: UpdateCSROpportunityDTO): Promise<ApiResponseDTO<CSROpportunity>> {
    try {
      const opportunity = await this.opportunityRepository.update(id, {
        ...updates,
        startDate: updates.startDate ? new Date(updates.startDate) : undefined,
        endDate: updates.endDate ? new Date(updates.endDate) : undefined,
        updatedAt: new Date()
      } as Partial<CSROpportunity>);

      if (!opportunity) {
        return {
          success: false,
          error: 'Opportunity not found'
        };
      }

      return {
        success: true,
        data: opportunity,
        message: 'Opportunity updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update opportunity'
      };
    }
  }

  async getActiveOpportunities(): Promise<ApiResponseDTO<CSROpportunity[]>> {
    try {
      const opportunities = await this.opportunityRepository.findActive();
      return {
        success: true,
        data: opportunities
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to retrieve active opportunities'
      };
    }
  }
}

// Service: Matching Service (Control)
export class MatchingService {
  constructor(
    private _matchingRepository: MatchingRepository,
    private volunteerRepository: VolunteerRepository,
    private opportunityRepository: CSROpportunityRepository
  ) {}

  async findMatchesForVolunteer(volunteerId: string): Promise<ApiResponseDTO<Matching[]>> {
    try {
      const volunteer = await this.volunteerRepository.findById(volunteerId);
      if (!volunteer) {
        return {
          success: false,
          error: 'Volunteer not found'
        };
      }

      const opportunities = await this.opportunityRepository.findActive();
      const matches: Matching[] = [];

      for (const opportunity of opportunities) {
        const score = this.calculateMatchScore(volunteer, opportunity);
        if (score > 0.5) { // Only include matches with score > 50%
          const reasons = this.generateMatchReasons(volunteer, opportunity);
          matches.push({
            id: '', // Will be set by repository
            volunteerId,
            opportunityId: opportunity.id,
            score,
            reasons,
            createdAt: new Date()
          });
        }
        // Use opportunity variable to avoid unused variable warning
        console.log('Processing opportunity:', opportunity.title);
      }

      // Sort by score descending
      matches.sort((a, b) => b.score - a.score);

      return {
        success: true,
        data: matches
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to find matches'
      };
    }
  }

  private calculateMatchScore(volunteer: Volunteer, opportunity: CSROpportunity): number {
    let score = 0;
    let factors = 0;

    // Skill matching (40% weight)
    const skillMatches = volunteer.skills.filter(skill => 
      opportunity.skills.includes(skill)
    ).length;
    if (opportunity.skills.length > 0) {
      score += (skillMatches / opportunity.skills.length) * 0.4;
      factors++;
    }

    // Interest matching (30% weight)
    const interestMatches = volunteer.interests.filter(interest =>
      opportunity.description.toLowerCase().includes(interest.toLowerCase())
    ).length;
    if (volunteer.interests.length > 0) {
      score += (interestMatches / volunteer.interests.length) * 0.3;
      factors++;
    }

    // Location matching (20% weight)
    if (volunteer.location && opportunity.location) {
      const locationMatch = this.calculateLocationMatch(volunteer.location, opportunity.location);
      score += locationMatch * 0.2;
      factors++;
    }

    // Availability matching (10% weight)
    const availabilityMatch = this.calculateAvailabilityMatch(volunteer.availability, opportunity);
    score += availabilityMatch * 0.1;
    factors++;

    return factors > 0 ? score / factors : 0;
  }

  private calculateLocationMatch(volunteerLocation: any, opportunityLocation: any): number {
    // Simple city matching - can be enhanced with distance calculation
    return volunteerLocation.city === opportunityLocation.city ? 1 : 0.5;
  }

  private calculateAvailabilityMatch(availability: any[], opportunity: CSROpportunity): number {
    // Simple check - can be enhanced with actual date/time matching
    return availability.length > 0 ? 1 : 0;
  }

  private generateMatchReasons(volunteer: Volunteer, opportunity: CSROpportunity): string[] {
    const reasons: string[] = [];

    const skillMatches = volunteer.skills.filter(skill => 
      opportunity.skills.includes(skill)
    );
    if (skillMatches.length > 0) {
      reasons.push(`Skills match: ${skillMatches.join(', ')}`);
    }

    const interestMatches = volunteer.interests.filter(interest =>
      opportunity.description.toLowerCase().includes(interest.toLowerCase())
    );
    if (interestMatches.length > 0) {
      reasons.push(`Interests align: ${interestMatches.join(', ')}`);
    }

    if (volunteer.location && opportunity.location && 
        volunteer.location.city === opportunity.location.city) {
      reasons.push('Same city location');
    }

    return reasons;
  }
}
