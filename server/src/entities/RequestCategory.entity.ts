import { RequestCategory as PrismaRequestCategory } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * Request Category Entity Class
 * 
 * Represents a request category for requests with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
 */
export class RequestCategoryEntity implements PrismaRequestCategory {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: PrismaRequestCategory) {
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
   * Find all categories (simplified - pagination handled on frontend)
   */
  static async findAll() {
    const categories = await prisma.requestCategory.findMany({
      orderBy: { name: 'asc' },
    });
    return categories.map(c => new RequestCategoryEntity(c));
  }

  /**
   * Find active categories only (simplified - pagination handled on frontend)
   */
  static async findActive() {
    const categories = await prisma.requestCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return categories.map(c => new RequestCategoryEntity(c));
  }

  /**
   * Find category by ID
   */
  static async findById(id: string) {
    const category = await prisma.requestCategory.findUnique({
      where: { id },
    });
    return category ? new RequestCategoryEntity(category) : null;
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
    const category = await prisma.requestCategory.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
      },
    });
    return new RequestCategoryEntity(category);
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
    const category = await prisma.requestCategory.update({
      where: { id },
      data,
    });
    return new RequestCategoryEntity(category);
  }

  /**
   * Delete category
   */
  static async delete(id: string): Promise<boolean> {
    await prisma.requestCategory.delete({ where: { id } });
    return true;
  }

  /**
   * Search categories (simplified - no pagination)
   */
  static async search(query: string) {
    const categories = await prisma.requestCategory.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } } // ,
          // { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'asc' },
    });
    return categories.map(c => new RequestCategoryEntity(c));
  }

  /**
   * Count total categories
   */
  static async count(): Promise<number> {
    return prisma.requestCategory.count();
  }
}

