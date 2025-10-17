import { User as PrismaUser, UserType, UserStatus, PIN, CSRRep, PlatformManager } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * User Entity Class
 * 
 * Represents a user in the system with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
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

  // ============================================
  // CRUD Methods (Static) - Database Operations
  // ============================================

  /**
   * Find all users with pagination
   */
  static async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users.map(user => new UserEntity(user));
  }

  /**
   * Find user by ID
   */
  static async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
    });
    return user ? new UserEntity(user) : null;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
    });
    return user ? new UserEntity(user) : null;
  }

  /**
   * Find users by type
   */
  static async findByType(userType: UserType, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({
      where: { userType },
      skip,
      take: limit,
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users.map(user => new UserEntity(user));
  }

  /**
   * Find users by status
   */
  static async findByStatus(status: UserStatus, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({
      where: { status },
      skip,
      take: limit,
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users.map(user => new UserEntity(user));
  }

  /**
   * Create a new user
   */
  static async create(data: {
    email: string;
    password: string;
    userType: UserType;
    status?: UserStatus;
  }) {
    const user = await prisma.user.create({
      data: {
        ...data,
        status: data.status || UserStatus.ACTIVE,
      },
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
    });
    return new UserEntity(user);
  }

  /**
   * Update user
   */
  static async update(id: string, data: Partial<{
    email: string;
    password: string;
    userType: UserType;
    status: UserStatus;
  }>) {
    const user = await prisma.user.update({
      where: { id },
      data,
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
    });
    return new UserEntity(user);
  }

  /**
   * Delete user
   */
  static async delete(id: string): Promise<boolean> {
    await prisma.user.delete({
      where: { id },
    });
    return true;
  }

  /**
   * Count total users
   */
  static async count(): Promise<number> {
    return prisma.user.count();
  }

  /**
   * Count users by type
   */
  static async countByType(userType: UserType): Promise<number> {
    return prisma.user.count({
      where: { userType },
    });
  }

  /**
   * Count users by status
   */
  static async countByStatus(status: UserStatus): Promise<number> {
    return prisma.user.count({
      where: { status },
    });
  }

  /**
   * Search users
   */
  static async search(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { pin: { name: { contains: query, mode: 'insensitive' } } },
          { csrRep: { companyName: { contains: query, mode: 'insensitive' } } },
          { platformManager: { fullName: { contains: query, mode: 'insensitive' } } },
        ],
      },
      skip,
      take: limit,
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users.map(user => new UserEntity(user));
  }

  /**
   * Suspend user account
   */
  static async suspend(id: string) {
    return this.update(id, { status: UserStatus.SUSPENDED });
  }

  /**
   * Activate user account
   */
  static async activate(id: string) {
    return this.update(id, { status: UserStatus.ACTIVE });
  }

  /**
   * Deactivate user account
   */
  static async deactivate(id: string) {
    return this.update(id, { status: UserStatus.DEACTIVATED });
  }
}
