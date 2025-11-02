import { UserProfile as PrismaUserProfile } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * UserProfile Class
 * 
 * Represents a user profile in the system.
 * Profiles are dynamically created - name serves as the unique identifier.
 * 
 * Follows the BCE framework - Entity handles all database operations.
 */
export class UserProfile implements PrismaUserProfile {
  id: string;
  name: string;
  description: string | null;
  permissions: any; // Json type
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: PrismaUserProfile) {
    this.id = data.id;
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

  // ============================================
  // CRUD Methods (Static) - Database Operations
  // ============================================

  /**
   * Find all profiles
   */
  static async findAll() {
    const profiles = await prisma.userProfile.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return profiles.map(profile => new UserProfile(profile));
  }

  /**
   * Find profile by ID
   */
  static async findById(id: string) {
    const profile = await prisma.userProfile.findUnique({
      where: { id },
    });
    return profile ? new UserProfile(profile) : null;
  }

  /**
   * Find profile by name (name is now the unique identifier)
   */
  static async findByName(name: string) {
    const profile = await prisma.userProfile.findUnique({
      where: { name },
    });
    return profile ? new UserProfile(profile) : null;
  }

  /**
   * Find active profiles only
   */
  static async findActive() {
    const profiles = await prisma.userProfile.findMany({
      where: { isActive: true },
      orderBy: {
        name: 'asc',
      },
    });
    return profiles.map(profile => new UserProfile(profile));
  }

  /**
   * Create a new profile
   */
  static async create(data: {
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
    return new UserProfile(profile);
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
    return new UserProfile(profile);
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

  /**
   * Search profiles by query string
   * Supports searching by name and description
   * @param query - Search query string (optional)
   * @param isActive - Filter by active status (optional, undefined = all profiles)
   */
  static async search(query?: string | null, isActive?: boolean | null) {
    const where: any = {};

    // Add isActive filter only if explicitly provided
    if (isActive !== undefined && isActive !== null) {
      where.isActive = isActive;
    }

    if (query && query.trim()) {
      const searchOrCondition = [
        { name: { contains: query.trim(), mode: 'insensitive' } },
        { description: { contains: query.trim(), mode: 'insensitive' } },
      ];

      if (isActive !== undefined && isActive !== null) {
        where.AND = [
          { isActive },
          { OR: searchOrCondition },
        ];
        delete where.isActive;
      } else {
        where.OR = searchOrCondition;
      }
    }

    const profiles = await prisma.userProfile.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });
    return profiles.map(profile => new UserProfile(profile));
  }
}
