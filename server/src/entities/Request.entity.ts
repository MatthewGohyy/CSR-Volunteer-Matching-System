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
   * By default, excludes COMPLETED and MATCHED requests (they appear in history/separate tabs)
   * @param pinId - PIN ID
   * @param query - Search query (null/undefined = return all)
   * @param status - Request status filter (optional). If not provided, excludes COMPLETED and MATCHED
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
    } else {
      // By default, exclude COMPLETED and MATCHED requests from "my requests"
      // These should only appear in history/matches tabs
      where.status = {
        notIn: [RequestStatus.COMPLETED, RequestStatus.MATCHED],
      };
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

      // Build AND conditions array if we have status/urgency/category filters or default status exclusion
      if (status || urgency || categoryId || where.status?.notIn) {
        const andConditions: any[] = [
          { pinId },
          { OR: searchOrCondition },
        ];

        if (status) {
          andConditions.push({ status });
        } else if (where.status?.notIn) {
          // Include the default status exclusion
          andConditions.push({ status: { notIn: where.status.notIn } });
        }
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
   * Find completed requests by PIN (COMPLETED status only)
   * Used for viewing/searching request history
   * Note: MATCHED requests are active matches, not completed. Only COMPLETED requests should appear in history.
   * @param pinId - PIN ID
   * @param query - Search query (null/undefined = return all)
   * @returns Array of completed requests
   */
  static async findCompletedByPIN(
    pinId: string,
    query: string | null = null
  ) {
    const where: any = {
      pinId,
      status: RequestStatus.COMPLETED, // Only COMPLETED, not MATCHED
    };

    // Add search query filter if provided
    if (query && query.trim()) {
      const searchOrCondition = [
        { title: { contains: query.trim(), mode: 'insensitive' } },
        { description: { contains: query.trim(), mode: 'insensitive' } },
        { location: { contains: query.trim(), mode: 'insensitive' } },
      ];

      where.AND = [
        { pinId },
        { status: RequestStatus.COMPLETED }, // Only COMPLETED, not MATCHED
        { OR: searchOrCondition },
      ];
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

  /**
   * Get view count for a request owned by a PIN
   * Story #20: View request views count
   * @param pinId - PIN ID (for authorization)
   * @param requestId - Request ID
   * @returns View count of the request
   */
  static async getViewCount(pinId: string, requestId: string): Promise<number> {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      select: { pinId: true, viewCount: true },
    });

    if (!request) {
      throw new Error('Request not found');
    }

    if (request.pinId !== pinId) {
      throw new Error('Unauthorized access to this request');
    }

    return request.viewCount;
  }

  /**
   * Get shortlist count for a request owned by a PIN
   * Story #21: View request shortlists count
   * @param pinId - PIN ID (for authorization)
   * @param requestId - Request ID
   * @returns Shortlist count of the request
   */
  static async getShortlistCount(pinId: string, requestId: string): Promise<number> {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      select: { pinId: true, shortlistCount: true },
    });

    if (!request) {
      throw new Error('Request not found');
    }

    if (request.pinId !== pinId) {
      throw new Error('Unauthorized access to this request');
    }

    return request.shortlistCount;
  }
}
