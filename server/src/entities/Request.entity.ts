import { Request as PrismaRequest, RequestStatus, UrgencyLevel, RequestCategory } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * Request Class
 * 
 * Represents a help request created by a PIN with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
 */
export class Request implements PrismaRequest {
  id: string;
  pinId: string;
  categoryId: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  dateNeeded: Date | null;
  location: string | null;
  status: RequestStatus;
  viewCount: number;
  shortlistCount: number;
  createdAt: Date;
  updatedAt: Date;

  // Related data
  category?: RequestCategory;
  pin?: any; // UserAccount with profile data

  constructor(data: PrismaRequest & {
    category?: RequestCategory;
    pin?: any;
  }) {
    this.id = data.id;
    this.pinId = data.pinId;
    this.categoryId = data.categoryId;
    this.title = data.title;
    this.description = data.description;
    this.urgency = data.urgency;
    this.dateNeeded = data.dateNeeded;
    this.location = data.location;
    this.status = data.status;
    this.viewCount = data.viewCount;
    this.shortlistCount = data.shortlistCount;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.category = data.category;
    this.pin = (data as any).pin;
  }

  /**
   * Check if request is active
   */
  isActive(): boolean {
    return this.status === RequestStatus.ACTIVE;
  }

  /**
   * Check if request is matched
   */
  isMatched(): boolean {
    return this.status === RequestStatus.MATCHED;
  }

  /**
   * Check if request is completed
   */
  isCompleted(): boolean {
    return this.status === RequestStatus.COMPLETED;
  }

  /**
   * Check if request is urgent
   */
  isUrgent(): boolean {
    return this.urgency === UrgencyLevel.HIGH;
  }

  /**
   * Check if request is overdue
   */
  isOverdue(): boolean {
    if (!this.dateNeeded) return false;
    return this.dateNeeded < new Date() && this.status === RequestStatus.ACTIVE;
  }

  /**
   * Serialize request for JSON response (ensures dates are formatted correctly)
   */
  toJSON() {
    return {
      id: this.id,
      pinId: this.pinId,
      categoryId: this.categoryId,
      title: this.title,
      description: this.description,
      urgency: this.urgency,
      dateNeeded: this.dateNeeded?.toISOString() || null,
      location: this.location,
      status: this.status,
      viewCount: this.viewCount,
      shortlistCount: this.shortlistCount,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      category: this.category,
      pin: this.pin ? {
        name: this.pin.name,
        location: this.pin.location || this.pin.address,
      } : null,
    };
  }

  // ============================================
  // CRUD Methods (Static) - Database Operations
  // ============================================

  /**
   * Find request by ID
   */
  static async findById(id: string) {
    const request = await prisma.request.findUnique({
      where: { id },
      include: {
        pin: true,
        category: true,
      },
    });
    return request ? new Request(request) : null;
  }

  /**
   * Search requests by PIN with optional filters
   * @param pinId - PIN ID
   * @param query - Search query (null/undefined = return all)
   * @param status - Request status filter (optional)
   * @param categoryId - Category filter (optional)
   * @param urgency - Urgency filter (optional)
   */
  static async searchByPIN(
    pinId: string,
    query: string | null = null,
    status?: RequestStatus,
    categoryId?: string,
    urgency?: UrgencyLevel
  ) {
    const where: any = { pinId };

    // Add status filter if provided
    if (status) {
      where.status = status;
    }

    // Add urgency filter
    if (urgency) {
      where.urgency = urgency;
    }

    // Add category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Add search query filter if provided
    if (query && query.trim()) {
      const searchOrCondition = [
        { title: { contains: query.trim(), mode: 'insensitive' } },
        { description: { contains: query.trim(), mode: 'insensitive' } },
        { location: { contains: query.trim(), mode: 'insensitive' } },
      ];

      // Build AND conditions array if we have status/urgency/category
      if (status || urgency || categoryId) {
        const andConditions: any[] = [
          { pinId },
          { OR: searchOrCondition },
        ];

        if (status) andConditions.push({ status });
        if (urgency) andConditions.push({ urgency });
        if (categoryId) andConditions.push({ categoryId });

        where.AND = andConditions;
        delete where.pinId;
        delete where.status;
        delete where.urgency;
        delete where.categoryId;
      } else {
        where.OR = searchOrCondition;
      }
    }

    const requests = await prisma.request.findMany({
      where,
      include: {
        pin: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return requests.map(request => new Request(request));
  }

  /**
   * Find requests by status
   */
  static async findByStatus(status: RequestStatus, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const requests = await prisma.request.findMany({
      where: { status },
      skip,
      take: limit,
      include: {
        pin: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return requests.map(request => new Request(request));
  }

  /**
   * Find requests by urgency
   */
  static async findByUrgency(urgency: UrgencyLevel, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const requests = await prisma.request.findMany({
      where: { urgency },
      skip,
      take: limit,
      include: {
        pin: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return requests.map(request => new Request(request));
  }

  /**
   * Create a new request
   */
  static async create(data: {
    pinId: string;
    categoryId: string;
    title: string;
    description: string;
    urgency?: UrgencyLevel;
    dateNeeded?: Date;
    location?: string;
    status?: RequestStatus;
  }) {
    const request = await prisma.request.create({
      data: {
        ...data,
        urgency: data.urgency || UrgencyLevel.MEDIUM,
        status: data.status || RequestStatus.ACTIVE,
      },
      include: {
        pin: true,
        category: true,
      },
    });
    return new Request(request);
  }

  /**
   * Update request
   */
  static async update(id: string, data: Partial<{
    title: string;
    description: string;
    urgency: UrgencyLevel;
    dateNeeded: Date;
    location: string;
    status: RequestStatus;
  }>) {
    const request = await prisma.request.update({
      where: { id },
      data,
      include: {
        pin: true,
        category: true,
      },
    });
    return new Request(request);
  }

  /**
   * Delete request
   */
  static async delete(id: string): Promise<boolean> {
    await prisma.request.delete({
      where: { id },
    });
    return true;
  }

  /**
   * Count total requests
   */
  static async count(): Promise<number> {
    return prisma.request.count();
  }

  /**
   * Count requests by status
   */
  static async countByStatus(status: RequestStatus): Promise<number> {
    return prisma.request.count({
      where: { status },
    });
  }

  /**
   * Search requests with optional filters
   * @param query - Search query (null/undefined = return all matching status)
   * @param status - Request status filter (default: ACTIVE)
   * @param categoryId - Category filter (optional)
   * @param urgency - Urgency filter (optional)
   */
  static async search(
    query: string | null = null,
    status: RequestStatus = RequestStatus.ACTIVE,
    categoryId?: string,
    urgency?: UrgencyLevel
  ) {
    const where: any = {
      status, // Default to ACTIVE, but can be overridden
    };

    // Add urgency filter
    if (urgency) {
      where.urgency = urgency;
    }

    // Add category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Add search query filter if provided
    if (query && query.trim()) {
      const searchOrCondition = [
        { title: { contains: query.trim(), mode: 'insensitive' } },
        { description: { contains: query.trim(), mode: 'insensitive' } },
        { location: { contains: query.trim(), mode: 'insensitive' } },
      ];

      // Build AND conditions array to combine status + search + other filters
      const andConditions: any[] = [
        { status },
        { OR: searchOrCondition },
      ];

      if (urgency) {
        andConditions.push({ urgency });
      }
      if (categoryId) {
        andConditions.push({ categoryId });
      }

      where.AND = andConditions;
      // Remove the direct properties since we're using AND
      delete where.status;
      delete where.urgency;
      delete where.categoryId;
    }

    const requests = await prisma.request.findMany({
      where,
      include: {
        pin: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return requests.map(request => new Request(request));
  }

  /**
   * Increment view count (static method for database operation)
   */
  static async incrementViewCountDB(id: string) {
    const request = await prisma.request.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      include: {
        pin: true,
        category: true,
      },
    });
    return new Request(request);
  }

  /**
   * Increment shortlist count (static method for database operation)
   */
  static async incrementShortlistCountDB(id: string) {
    const request = await prisma.request.update({
      where: { id },
      data: {
        shortlistCount: {
          increment: 1,
        },
      },
      include: {
        pin: true,
        category: true,
      },
    });
    return new Request(request);
  }

}
