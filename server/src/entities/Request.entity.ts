import { Request as PrismaRequest, RequestStatus, UrgencyLevel, ServiceCategory } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * Request Entity Class
 * 
 * Represents a help request created by a PIN with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
 */
export class RequestEntity implements PrismaRequest {
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
  category?: ServiceCategory;

  constructor(data: PrismaRequest & {
    category?: ServiceCategory;
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
   * Increment view count
   */
  incrementViewCount(): number {
    return this.viewCount + 1;
  }

  /**
   * Increment shortlist count
   */
  incrementShortlistCount(): number {
    return this.shortlistCount + 1;
  }

  // ============================================
  // CRUD Methods (Static) - Database Operations
  // ============================================

  /**
   * Find all requests with pagination
   */
  static async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const requests = await prisma.request.findMany({
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
    return requests.map(request => new RequestEntity(request));
  }

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
    return request ? new RequestEntity(request) : null;
  }

  /**
   * Find requests by PIN
   */
  static async findByPIN(pinId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const requests = await prisma.request.findMany({
      where: { pinId },
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
    return requests.map(request => new RequestEntity(request));
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
    return requests.map(request => new RequestEntity(request));
  }

  /**
   * Find requests by category
   */
  static async findByCategory(categoryId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const requests = await prisma.request.findMany({
      where: { categoryId },
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
    return requests.map(request => new RequestEntity(request));
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
    return requests.map(request => new RequestEntity(request));
  }

  /**
   * Find active requests
   */
  static async findActive(page: number = 1, limit: number = 10) {
    return this.findByStatus(RequestStatus.ACTIVE, page, limit);
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
    return new RequestEntity(request);
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
    return new RequestEntity(request);
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
   * Count requests by PIN
   */
  static async countByPIN(pinId: string): Promise<number> {
    return prisma.request.count({
      where: { pinId },
    });
  }

  /**
   * Search requests
   */
  static async search(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const requests = await prisma.request.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { location: { contains: query, mode: 'insensitive' } },
        ],
      },
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
    return requests.map(request => new RequestEntity(request));
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
    return new RequestEntity(request);
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
    return new RequestEntity(request);
  }

  /**
   * Change request status
   */
  static async changeStatus(id: string, status: RequestStatus) {
    return this.update(id, { status });
  }
}
