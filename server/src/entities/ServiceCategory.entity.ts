import { ServiceCategory as PrismaServiceCategory } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * Service Category Entity Class
 * 
 * Represents a service category for requests with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
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

  // ============================================
  // CRUD Methods (Static) - Database Operations
  // ============================================

  /**
   * Find all categories with pagination
   */
  static async findAll(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const categories = await prisma.serviceCategory.findMany({
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    });
    return categories.map(c => new ServiceCategoryEntity(c));
  }

  /**
   * Find active categories
   */
  static async findActive() {
    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return categories.map(c => new ServiceCategoryEntity(c));
  }

  /**
   * Find category by ID
   */
  static async findById(id: string) {
    const category = await prisma.serviceCategory.findUnique({
      where: { id },
    });
    return category ? new ServiceCategoryEntity(category) : null;
  }

  /**
   * Create a new category
   */
  static async create(data: {
    name: string;
    description?: string;
    iconUrl?: string;
    isActive?: boolean;
  }) {
    const category = await prisma.serviceCategory.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
      },
    });
    return new ServiceCategoryEntity(category);
  }

  /**
   * Update category
   */
  static async update(id: string, data: Partial<{
    name: string;
    description: string;
    iconUrl: string;
    isActive: boolean;
  }>) {
    const category = await prisma.serviceCategory.update({
      where: { id },
      data,
    });
    return new ServiceCategoryEntity(category);
  }

  /**
   * Delete category
   */
  static async delete(id: string): Promise<boolean> {
    await prisma.serviceCategory.delete({ where: { id } });
    return true;
  }

  /**
   * Search categories
   */
  static async search(query: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const categories = await prisma.serviceCategory.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    });
    return categories.map(c => new ServiceCategoryEntity(c));
  }

  /**
   * Count total categories
   */
  static async count(): Promise<number> {
    return prisma.serviceCategory.count();
  }
}
