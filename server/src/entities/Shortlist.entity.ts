import { Shortlist as PrismaShortlist } from '@prisma/client';
import { prisma } from '../config/database';
import { Request } from './Request.entity';

/**
 * Shortlist Class
 * 
 * Represents a CSR Rep's shortlisted request with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
 */
export class Shortlist implements PrismaShortlist {
  id: string;
  csrRepId: string;
  requestId: string;
  createdAt: Date;

  constructor(data: PrismaShortlist) {
    this.id = data.id;
    this.csrRepId = data.csrRepId;
    this.requestId = data.requestId;
    this.createdAt = data.createdAt;
  }

  /**
   * Get age of shortlist in days
   */
  getAgeInDays(): number {
    const now = new Date();
    const diff = now.getTime() - this.createdAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if recently added (< 7 days)
   */
  isRecent(): boolean {
    return this.getAgeInDays() < 7;
  }

  // ============================================
  // CRUD Methods (Static) - Database Operations
  // ============================================

  /**
   * Find shortlist by ID
   */
  static async findById(id: string) {
    const shortlist = await prisma.shortlist.findUnique({
      where: { id },
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
      },
    });
    // Return as object to preserve relations (request, csrRep)
    return shortlist ? {
      ...shortlist,
      request: shortlist.request,
    } : null;
  }

  /**
   * Get all shortlisted request IDs for a CSR Rep
   */
  static async getShortlistedRequestIds(csrRepId: string): Promise<string[]> {
    const shortlists = await prisma.shortlist.findMany({
      where: { csrRepId },
      select: { requestId: true },
    });
    return shortlists.map(s => s.requestId);
  }

  /**
   * Create a new shortlist
   */
  static async create(data: {
    csrRepId: string;
    requestId: string;
  }) {
    const shortlist = await prisma.shortlist.create({
      data,
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
      },
    });

    // Increment shortlist count for the request
    await Request.incrementShortlistCountDB(data.requestId);

    return new Shortlist(shortlist);
  }

  /**
   * Delete shortlist by CSR Rep and Request
   */
  static async deleteByCSRRepAndRequest(csrRepId: string, requestId: string): Promise<boolean> {
    await prisma.shortlist.delete({
      where: {
        csrRepId_requestId: { csrRepId, requestId },
      },
    });
    return true;
  }

  /**
   * Check if shortlist exists
   */
  static async exists(csrRepId: string, requestId: string): Promise<boolean> {
    const shortlist = await prisma.shortlist.findUnique({
      where: {
        csrRepId_requestId: { csrRepId, requestId },
      },
    });
    return !!shortlist;
  }

  /**
   * Search shortlists by CSR Rep with optional query filter
   * Filters by request title and description
   * @param csrRepId - CSR Rep ID
   * @param query - Search query (null/undefined = return all)
   */
  static async search(
    csrRepId: string,
    query: string | null = null
  ) {
    const where: any = { csrRepId };

    // Add search query filter if provided
    if (query && query.trim()) {
      where.request = {
        OR: [
          { title: { contains: query.trim(), mode: 'insensitive' } },
          { description: { contains: query.trim(), mode: 'insensitive' } },
        ],
      };
    }

    const shortlists = await prisma.shortlist.findMany({
      where,
      include: {
        request: {
          include: {
            pin: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return shortlists.map(s => ({
      ...s,
      request: s.request,
    }));
  }
}
