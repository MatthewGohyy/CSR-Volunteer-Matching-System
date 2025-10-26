import { UserProfile as PrismaUserProfile, UserProfileRole } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * UserProfile Entity Class
 * 
 * Represents a user profile/role in the system.
 * Expected to have exactly 4 records (one for each role).
 * 
 * Follows the BCE framework - Entity handles all database operations.
 */
export class UserProfileEntity implements PrismaUserProfile {
  id: string;
  role: UserProfileRole;
  name: string;
  description: string | null;
  permissions: any; // Json type
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: PrismaUserProfile) {
    this.id = data.id;
    this.role = data.role;
    this.name = data.name;
    this.description = data.description;
    this.permissions = data.permissions;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * Check if profile is active
   */
  isActiveProfile(): boolean {
    return this.isActive;
  }

  /**
   * Check if this is CSR Rep profile
   */
  isCSRRep(): boolean {
    return this.role === UserProfileRole.CSR_REP;
  }

  /**
   * Check if this is PIN profile
   */
  isPIN(): boolean {
    return this.role === UserProfileRole.PIN;
  }

  /**
   * Check if this is User Admin profile
   */
  isUserAdmin(): boolean {
    return this.role === UserProfileRole.USER_ADMIN;
  }

  /**
   * Check if this is Platform Manager profile
   */
  isPlatformManager(): boolean {
    return this.role === UserProfileRole.PLATFORM_MANAGER;
  }

  // ============================================
  // CRUD Methods (Static) - Database Operations
  // ============================================

  /**
   * Find all profiles
   */
  static async findAll() {
    const profiles = await prisma.userProfile.findMany({
      orderBy: {
        role: 'asc',
      },
    });
    return profiles.map(profile => new UserProfileEntity(profile));
  }

  /**
   * Find profile by ID
   */
  static async findById(id: string) {
    const profile = await prisma.userProfile.findUnique({
      where: { id },
    });
    return profile ? new UserProfileEntity(profile) : null;
  }

  /**
   * Find profile by role
   */
  static async findByRole(role: UserProfileRole) {
    const profile = await prisma.userProfile.findUnique({
      where: { role },
    });
    return profile ? new UserProfileEntity(profile) : null;
  }

  /**
   * Find active profiles only
   */
  static async findActive() {
    const profiles = await prisma.userProfile.findMany({
      where: { isActive: true },
      orderBy: {
        role: 'asc',
      },
    });
    return profiles.map(profile => new UserProfileEntity(profile));
  }

  /**
   * Create a new profile
   */
  static async create(data: {
    role: UserProfileRole;
    name: string;
    description?: string;
    permissions?: any;
    isActive?: boolean;
  }) {
    const profile = await prisma.userProfile.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
      },
    });
    return new UserProfileEntity(profile);
  }

  /**
   * Update profile
   */
  static async update(id: string, data: Partial<{
    name: string;
    description: string;
    permissions: any;
    isActive: boolean;
  }>) {
    const profile = await prisma.userProfile.update({
      where: { id },
      data,
    });
    return new UserProfileEntity(profile);
  }

  /**
   * Count total profiles
   */
  static async count(): Promise<number> {
    return prisma.userProfile.count();
  }

  /**
   * Count active profiles
   */
  static async countActive(): Promise<number> {
    return prisma.userProfile.count({
      where: { isActive: true },
    });
  }
}
