import { PIN as PrismaPIN } from '@prisma/client';

/**
 * PIN (Person In Need) Entity Class
 * 
 * Represents a PIN profile with business logic methods.
 * Maps to the Prisma PIN model.
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
}
