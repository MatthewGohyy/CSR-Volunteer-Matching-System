import { PIN as PrismaPIN } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * PIN (Person In Need) Entity Class
 * 
 * Represents a PIN profile with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
 */
export class PINEntity implements PrismaPIN {
  id: string;
  userId: string;
  name: string;
  age: number | null;
  location: string | null;
  phoneNumber: string | null;
  accessibilityNeeds: string | null;
  profilePhoto: string | null;

  constructor(data: PrismaPIN) {
    this.id = data.id;
    this.userId = data.userId;
    this.name = data.name;
    this.age = data.age;
    this.location = data.location;
    this.phoneNumber = data.phoneNumber;
    this.accessibilityNeeds = data.accessibilityNeeds;
    this.profilePhoto = data.profilePhoto;
  }

  /**
   * Check if PIN has accessibility needs
   */
  hasAccessibilityNeeds(): boolean {
    return !!this.accessibilityNeeds;
  }

  /**
   * Check if profile is complete
   */
  isProfileComplete(): boolean {
    return !!(this.name && this.location && this.phoneNumber);
  }

  /**
   * Get display name
   */
  getDisplayName(): string {
    return this.name;
  }

  /**
   * Check if senior (65+)
   */
  isSenior(): boolean {
    return this.age !== null && this.age >= 65;
  }

  // ============================================
  // CRUD Methods (Static) - Database Operations
  // ============================================

  /**
   * Find PIN by ID
   */
  static async findById(id: string) {
    const pin = await prisma.pIN.findUnique({
      where: { id },
    });
    return pin ? new PINEntity(pin) : null;
  }

  /**
   * Find PIN by user ID
   */
  static async findByUserId(userId: string) {
    const pin = await prisma.pIN.findUnique({
      where: { userId },
    });
    return pin ? new PINEntity(pin) : null;
  }

  /**
   * Create a new PIN profile
   */
  static async create(data: {
    userId: string;
    name: string;
    age?: number;
    location?: string;
    phoneNumber?: string;
    accessibilityNeeds?: string;
    profilePhoto?: string;
  }) {
    const pin = await prisma.pIN.create({
      data,
    });
    return new PINEntity(pin);
  }

  /**
   * Update PIN profile by ID
   */
  static async update(id: string, data: Partial<{
    name: string;
    age: number;
    location: string;
    phoneNumber: string;
    accessibilityNeeds: string;
    profilePhoto: string;
  }>) {
    const pin = await prisma.pIN.update({
      where: { id },
      data,
    });
    return new PINEntity(pin);
  }

  /**
   * Update PIN profile by user ID
   */
  static async updateByUserId(userId: string, data: Partial<{
    name: string;
    age: number;
    location: string;
    phoneNumber: string;
    accessibilityNeeds: string;
    profilePhoto: string;
  }>) {
    const pin = await prisma.pIN.update({
      where: { userId },
      data,
    });
    return new PINEntity(pin);
  }

  /**
   * Delete PIN profile
   */
  static async delete(id: string): Promise<boolean> {
    await prisma.pIN.delete({ where: { id } });
    return true;
  }
}
