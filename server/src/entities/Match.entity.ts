import { Match as PrismaMatch, MatchStatus } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * Match Class
 * 
 * Represents a match between a PIN request and CSR Rep with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
 */
export class Match implements PrismaMatch {
  id: string;
  requestId: string;
  csrRepId: string;
  pinId: string;
  status: MatchStatus;
  matchedAt: Date;
  completedAt: Date | null;
  cancellationReason: string | null;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.requestId = data.requestId;
    this.csrRepId = data.csrRepId;
    this.pinId = data.pinId;
    this.status = data.status;
    this.matchedAt = data.matchedAt;
    this.completedAt = data.completedAt;
    this.cancellationReason = data.cancellationReason;
    this.updatedAt = data.updatedAt;
    
    // Preserve related data if included
    if (data.request) {
      (this as any).request = data.request;
    }
    if (data.csrRep) {
      (this as any).csrRep = data.csrRep;
    }
    if (data.pin) {
      (this as any).pin = data.pin;
    }
  }

  // ============================================
  // CRUD Methods (Static) - Database Operations
  // ============================================

  /**
   * Find match by ID
   */
  static async findById(id: string) {
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
        pin: true,
      },
    });
    return match ? new Match(match) : null;
  }

  /**
   * Search matches by PIN with optional query filter
   * Filters by request title and description
   * @param pinId - PIN ID
   * @param query - Search query (null/undefined = return all)
   */
  static async searchByPIN(
    pinId: string,
    query: string | null = null
  ) {
    const where: any = { pinId };

    // Add search query filter if provided
    if (query && query.trim()) {
      where.request = {
        OR: [
          { title: { contains: query.trim(), mode: 'insensitive' } },
          { description: { contains: query.trim(), mode: 'insensitive' } },
        ],
      };
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
      },
      orderBy: { matchedAt: 'desc' },
    });
    return matches.map(m => new Match(m));
  }

  /**
   * Search matches by CSR Rep with optional query and status filter
   * Filters by request title and description
   * @param csrRepId - CSR Rep ID
   * @param query - Search query (null/undefined = return all matching status)
   * @param status - Match status filter (default: COMPLETED for history)
   */
  static async search(
    csrRepId: string,
    query: string | null = null,
    status: MatchStatus | null = null
  ) {
    const where: any = { csrRepId };

    // Add status filter if provided
    if (status) {
      where.status = status;
    }

    // Add search query filter if provided
    if (query && query.trim()) {
      where.request = {
        OR: [
          { title: { contains: query.trim(), mode: 'insensitive' } },
          { description: { contains: query.trim(), mode: 'insensitive' } },
        ],
      };
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        request: { include: { pin: true, category: true } },
        pin: true,
      },
      orderBy: { matchedAt: 'desc' },
    });
    return matches.map(m => new Match(m));
  }

  /**
   * Create a new match
   */
  static async create(data: {
    requestId: string;
    csrRepId: string;
    pinId: string;
    status?: MatchStatus;
  }) {
    const match = await prisma.match.create({
      data: {
        ...data,
        status: data.status || MatchStatus.ACTIVE,
      },
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
        pin: true,
      },
    });
    return new Match(match);
  }

  /**
   * Update match
   */
  static async update(id: string, data: Partial<{
    status: MatchStatus;
    completedAt: Date;
    cancellationReason: string;
  }>) {
    const match = await prisma.match.update({
      where: { id },
      data,
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
        pin: true,
      },
    });
    return new Match(match);
  }

  /**
   * Delete match
   */
  static async delete(id: string): Promise<boolean> {
    await prisma.match.delete({ where: { id } });
    return true;
  }

  /**
   * Count total matches
   */
  static async count(): Promise<number> {
    return prisma.match.count();
  }
}
