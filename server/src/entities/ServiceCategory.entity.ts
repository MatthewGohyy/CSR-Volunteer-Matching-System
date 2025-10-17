import { ServiceCategory as PrismaServiceCategory } from '@prisma/client';

/**
 * Service Category Entity Class
 * 
 * Represents a service category for requests.
 * Maps to the Prisma ServiceCategory model.
 */
export class ServiceCategoryEntity implements PrismaServiceCategory {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: PrismaServiceCategory) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.iconUrl = data.iconUrl;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * Check if category is active
   */
  isActiveCategory(): boolean {
    return this.isActive;
  }

  /**
   * Check if has icon
   */
  hasIcon(): boolean {
    return !!this.iconUrl;
  }

  /**
   * Check if has description
   */
  hasDescription(): boolean {
    return !!this.description;
  }
}
