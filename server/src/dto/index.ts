// DTO: Create User
export interface CreateUserDTO {
  email: string;
  name: string;
  phone?: string;
  role: string;
}

// DTO: Create Volunteer
export interface CreateVolunteerDTO extends CreateUserDTO {
  skills: string[];
  interests: string[];
  availability: AvailabilityDTO[];
  location?: LocationDTO;
  bio?: string;
}

// DTO: Create Organization
export interface CreateOrganizationDTO extends CreateUserDTO {
  organizationName: string;
  description: string;
  website?: string;
  location: LocationDTO;
}

// DTO: Create CSR Opportunity
export interface CreateCSROpportunityDTO {
  organizationId: string;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  location: LocationDTO;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  maxVolunteers: number;
}

// DTO: Create Volunteer Request
export interface CreateVolunteerRequestDTO {
  volunteerId: string;
  opportunityId: string;
  message?: string;
}

// DTO: Update User
export interface UpdateUserDTO {
  name?: string;
  phone?: string;
}

// DTO: Update Volunteer
export interface UpdateVolunteerDTO extends UpdateUserDTO {
  skills?: string[];
  interests?: string[];
  availability?: AvailabilityDTO[];
  location?: LocationDTO;
  bio?: string;
}

// DTO: Update Organization
export interface UpdateOrganizationDTO extends UpdateUserDTO {
  organizationName?: string;
  description?: string;
  website?: string;
  location?: LocationDTO;
}

// DTO: Update CSR Opportunity
export interface UpdateCSROpportunityDTO {
  title?: string;
  description?: string;
  requirements?: string[];
  skills?: string[];
  location?: LocationDTO;
  startDate?: string;
  endDate?: string;
  maxVolunteers?: number;
  status?: string;
}

// Supporting DTOs
export interface LocationDTO {
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

export interface AvailabilityDTO {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

// DTO: Login
export interface LoginDTO {
  email: string;
  password: string;
}

// DTO: Register
export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  role: string;
}

// DTO: Auth Response
export interface AuthResponseDTO {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

// DTO: API Response
export interface ApiResponseDTO<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
