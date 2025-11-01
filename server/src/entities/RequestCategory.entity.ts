import { RequestCategory as PrismaRequestCategory } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * Request Category Class
 * 
 * Represents a request category for requests with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
 */
export class RequestCategory implements PrismaRequestCategory {
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
    return categories.map(c => new RequestCategory(c));
  }

  /**
   * Find active categories only (simplified - pagination handled on frontend)
   */
  static async findActive() {
    const categories = await prisma.requestCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return categories.map(c => new RequestCategory(c));
  }

  /**
   * Find category by ID
   */
  static async findById(id: string) {
    const category = await prisma.requestCategory.findUnique({
      where: { id },
    });
    return category ? new RequestCategory(category) : null;
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
    return new RequestCategory(category);
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
    return new RequestCategory(category);
  }

  /**
   * Delete category
   */
  static async delete(id: string): Promise<boolean> {
    await prisma.requestCategory.delete({ where: { id } });
    return true;
  }

  /**
   * Search categories with optional query and active status filter
   * Encapsulates all search and filtering logic
   * @param query - Search query (null/undefined = return all matching filters)
   * @param includeInactive - If true, include inactive categories (default: false)
   */
  static async search(query: string | null = null, includeInactive: boolean = false) {
    const where: any = {};

    // Add active status filter if not including inactive
    if (!includeInactive) {
      where.isActive = true;
    }

    // Add search query filter if provided
    if (query && query.trim()) {
      const searchOrCondition = [
        { name: { contains: query.trim(), mode: 'insensitive' } },
        // { description: { contains: query.trim(), mode: 'insensitive' } },
      ];

      // If we already have isActive filter, combine with AND
      if (where.isActive !== undefined) {
        where.AND = [
          { isActive: true },
          { OR: searchOrCondition },
        ];
        delete where.isActive;
      } else {
        where.OR = searchOrCondition;
      }
    }

    const categories = await prisma.requestCategory.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    return categories.map(c => new RequestCategory(c));
  }

  /**
   * Count total categories
   */
  static async count(): Promise<number> {
    return prisma.requestCategory.count();
  }
}

