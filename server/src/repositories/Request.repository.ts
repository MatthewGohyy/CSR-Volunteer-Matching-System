import { prisma } from '../config/database';
import { RequestEntity } from '../entities/Request.entity';
import { RequestStatus, UrgencyLevel } from '@prisma/client';

/**
 * Request Repository
 * 
 * Handles all database operations for Request entity.
 * Controllers should call these methods instead of using Prisma directly.
 */
export class RequestRepository {
  /**
   * Find all requests with pagination
   */
  async findAll(page: number = 1, limit: number = 10) {
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
  async findById(id: string) {
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
  async findByPIN(pinId: string, page: number = 1, limit: number = 10) {
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
  async findByStatus(status: RequestStatus, page: number = 1, limit: number = 10) {
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
  async findByCategory(categoryId: string, page: number = 1, limit: number = 10) {
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
  async findByUrgency(urgency: UrgencyLevel, page: number = 1, limit: number = 10) {
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
  async findActive(page: number = 1, limit: number = 10) {
    return this.findByStatus(RequestStatus.ACTIVE, page, limit);
  }

  /**
   * Create a new request
   */
  async create(data: {
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
  async update(id: string, data: Partial<{
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
  async delete(id: string): Promise<boolean> {
    await prisma.request.delete({
      where: { id },
    });
    return true;
  }

  /**
   * Count total requests
   */
  async count(): Promise<number> {
    return prisma.request.count();
  }

  /**
   * Count requests by status
   */
  async countByStatus(status: RequestStatus): Promise<number> {
    return prisma.request.count({
      where: { status },
    });
  }

  /**
   * Count requests by PIN
   */
  async countByPIN(pinId: string): Promise<number> {
    return prisma.request.count({
      where: { pinId },
    });
  }

  /**
   * Search requests
   */
  async search(query: string, page: number = 1, limit: number = 10) {
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
   * Increment view count
   */
  async incrementViewCount(id: string) {
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
   * Increment shortlist count
   */
  async incrementShortlistCount(id: string) {
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
  async changeStatus(id: string, status: RequestStatus) {
    return this.update(id, { status });
  }
}
