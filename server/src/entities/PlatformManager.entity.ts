import { PlatformManager as PrismaPlatformManager, ProfileStatus } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * Platform Manager Entity Class
 * 
 * Represents a Platform Manager profile with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
 */
export class PlatformManagerEntity implements PrismaPlatformManager {
  id: string;
  userId: string;
  fullName: string;
  department: string | null;
  phone: string | null;
  status: ProfileStatus;

  constructor(data: PrismaPlatformManager) {
    this.id = data.id;
    this.userId = data.userId;
    this.fullName = data.fullName;
    this.department = data.department;
    this.phone = data.phone;
    this.status = data.status;
  }

  /**
   * Check if profile is complete
   */
  isProfileComplete(): boolean {
    return !!(this.fullName && this.phone);
  }

  /**
   * Get display name
   */
  getDisplayName(): string {
    return this.fullName;
  }

  /**
   * Check if profile is active
   */
  isActive(): boolean {
    return this.status === ProfileStatus.ACTIVE;
  }

  /**
   * Check if profile is suspended
   */
  isSuspended(): boolean {
    return this.status === ProfileStatus.SUSPENDED;
  }

  // ============================================
  // CRUD Methods (Static) - Database Operations
  // ============================================

  /**
   * Find Platform Manager by ID
   */
  static async findById(id: string) {
    const platformManager = await prisma.platformManager.findUnique({
      where: { id },
    });
    return platformManager ? new PlatformManagerEntity(platformManager) : null;
  }

  /**
   * Find Platform Manager by user ID
   */
  static async findByUserId(userId: string) {
    const platformManager = await prisma.platformManager.findUnique({
      where: { userId },
    });
    return platformManager ? new PlatformManagerEntity(platformManager) : null;
  }

  /**
   * Create a new Platform Manager profile
   */
  static async create(data: {
    userId: string;
    fullName: string;
    department?: string;
    phone?: string;
    status?: ProfileStatus;
  }) {
    const platformManager = await prisma.platformManager.create({
      data: {
        ...data,
        status: data.status || ProfileStatus.ACTIVE,
      },
    });
    return new PlatformManagerEntity(platformManager);
  }

  /**
   * Update Platform Manager profile by ID
   */
  static async update(id: string, data: Partial<{
    fullName: string;
    department: string;
    phone: string;
    status: ProfileStatus;
  }>) {
    const platformManager = await prisma.platformManager.update({
      where: { id },
      data,
    });
    return new PlatformManagerEntity(platformManager);
  }

  /**
   * Update Platform Manager profile by user ID
   */
  static async updateByUserId(userId: string, data: Partial<{
    fullName: string;
    department: string;
    phone: string;
    status: ProfileStatus;
  }>) {
    const platformManager = await prisma.platformManager.update({
      where: { userId },
      data,
    });
    return new PlatformManagerEntity(platformManager);
  }

  /**
   * Suspend Platform Manager profile
   */
  static async suspend(id: string) {
    return this.update(id, { status: ProfileStatus.SUSPENDED });
  }

  /**
   * Suspend Platform Manager profile by user ID
   */
  static async suspendByUserId(userId: string) {
    return this.updateByUserId(userId, { status: ProfileStatus.SUSPENDED });
  }

  /**
   * Activate Platform Manager profile
   */
  static async activate(id: string) {
    return this.update(id, { status: ProfileStatus.ACTIVE });
  }

  /**
   * Activate Platform Manager profile by user ID
   */
  static async activateByUserId(userId: string) {
    return this.updateByUserId(userId, { status: ProfileStatus.ACTIVE });
  }

  /**
   * Delete Platform Manager profile
   */
  static async delete(id: string): Promise<boolean> {
    await prisma.platformManager.delete({ where: { id } });
    return true;
  }
}

