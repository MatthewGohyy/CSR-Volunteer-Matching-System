import { CSRRep as PrismaCSRRep } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * CSR Representative Entity Class
 * 
 * Represents a CSR company representative profile with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
 */
export class CSRRepEntity implements PrismaCSRRep {
  id: string;
  userId: string;
  companyName: string;
  companyRegistrationNumber: string;
  industry: string | null;
  contactPerson: string;
  phoneNumber: string;
  companyAddress: string | null;
  companyLogo: string | null;

  constructor(data: PrismaCSRRep) {
    this.id = data.id;
    this.userId = data.userId;
    this.companyName = data.companyName;
    this.companyRegistrationNumber = data.companyRegistrationNumber;
    this.industry = data.industry;
    this.contactPerson = data.contactPerson;
    this.phoneNumber = data.phoneNumber;
    this.companyAddress = data.companyAddress;
    this.companyLogo = data.companyLogo;
  }

  /**
   * Check if profile is complete
   */
  isProfileComplete(): boolean {
    return !!(
      this.companyName &&
      this.companyRegistrationNumber &&
      this.contactPerson &&
      this.phoneNumber
    );
  }

  /**
   * Get company display name
   */
  getDisplayName(): string {
    return this.companyName;
  }

  /**
   * Check if has logo
   */
  hasLogo(): boolean {
    return !!this.companyLogo;
  }

  // ============================================
  // CRUD Methods (Static) - Database Operations
  // ============================================

  /**
   * Find CSR Rep by ID
   */
  static async findById(id: string) {
    const csrRep = await prisma.cSRRep.findUnique({
      where: { id },
    });
    return csrRep ? new CSRRepEntity(csrRep) : null;
  }

  /**
   * Find CSR Rep by user ID
   */
  static async findByUserId(userId: string) {
    const csrRep = await prisma.cSRRep.findUnique({
      where: { userId },
    });
    return csrRep ? new CSRRepEntity(csrRep) : null;
  }

  /**
   * Create a new CSR Rep profile
   */
  static async create(data: {
    userId: string;
    companyName: string;
    companyRegistrationNumber: string;
    industry?: string;
    contactPerson: string;
    phoneNumber: string;
    companyAddress?: string;
    companyLogo?: string;
  }) {
    const csrRep = await prisma.cSRRep.create({
      data,
    });
    return new CSRRepEntity(csrRep);
  }

  /**
   * Update CSR Rep profile by ID
   */
  static async update(id: string, data: Partial<{
    companyName: string;
    industry: string;
    contactPerson: string;
    phoneNumber: string;
    companyAddress: string;
    companyLogo: string;
  }>) {
    const csrRep = await prisma.cSRRep.update({
      where: { id },
      data,
    });
    return new CSRRepEntity(csrRep);
  }

  /**
   * Update CSR Rep profile by user ID
   */
  static async updateByUserId(userId: string, data: Partial<{
    companyName: string;
    industry: string;
    contactPerson: string;
    phoneNumber: string;
    companyAddress: string;
    companyLogo: string;
  }>) {
    const csrRep = await prisma.cSRRep.update({
      where: { userId },
      data,
    });
    return new CSRRepEntity(csrRep);
  }

  /**
   * Delete CSR Rep profile
   */
  static async delete(id: string): Promise<boolean> {
    await prisma.cSRRep.delete({ where: { id } });
    return true;
  }
}
