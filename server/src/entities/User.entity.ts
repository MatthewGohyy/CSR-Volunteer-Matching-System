import { User as PrismaUser, UserType, UserStatus, PIN, CSRRep, PlatformManager } from '@prisma/client';

/**
 * User Entity Class
 * 
 * Represents a user in the system with business logic methods.
 * Maps to the Prisma User model.
 */
export class UserEntity implements PrismaUser {
  id: string;
  email: string;
  password: string;
  userType: UserType;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;

  // Related profiles
  pin?: PIN | null;
  csrRep?: CSRRep | null;
  platformManager?: PlatformManager | null;

  constructor(data: PrismaUser & {
    pin?: PIN | null;
    csrRep?: CSRRep | null;
    platformManager?: PlatformManager | null;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.userType = data.userType;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.pin = data.pin;
    this.csrRep = data.csrRep;
    this.platformManager = data.platformManager;
  }

  /**
   * Check if user is active
   */
  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  /**
   * Check if user is suspended
   */
  isSuspended(): boolean {
    return this.status === UserStatus.SUSPENDED;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.userType === UserType.ADMIN;
  }

  /**
   * Check if user is PIN (Person In Need)
   */
  isPIN(): boolean {
    return this.userType === UserType.PIN;
  }

  /**
   * Check if user is CSR Representative
   */
  isCSRRep(): boolean {
    return this.userType === UserType.CSR_REP;
  }

  /**
   * Check if user is Platform Manager
   */
  isPlatformManager(): boolean {
    return this.userType === UserType.PLATFORM_MANAGER;
  }

  /**
   * Get user's profile based on type
   */
  getProfile(): PIN | CSRRep | PlatformManager | null {
    return this.pin || this.csrRep || this.platformManager || null;
  }

  /**
   * Get user data without password (for API responses)
   */
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
