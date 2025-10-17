import { CSRRep as PrismaCSRRep } from '@prisma/client';

/**
 * CSR Representative Entity Class
 * 
 * Represents a CSR company representative profile.
 * Maps to the Prisma CSRRep model.
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
}
