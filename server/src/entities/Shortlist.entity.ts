import { Shortlist as PrismaShortlist } from '@prisma/client';
import { prisma } from '../config/database';

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
    return shortlist ? new Shortlist(shortlist) : null;
  }

  /**
   * Find shortlists by CSR Rep
   */
  static async findByCSRRep(csrRepId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const shortlists = await prisma.shortlist.findMany({
      where: { csrRepId },
      skip,
      take: limit,
      include: {
        request: { 
          include: { 
            pin: true, 
            category: true 
          } 
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return shortlists.map(s => ({
      ...s,
      request: s.request,
    }));
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
   * Find shortlists by request
   */
  static async findByRequest(requestId: string) {
    const shortlists = await prisma.shortlist.findMany({
      where: { requestId },
      include: {
        csrRep: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return shortlists.map(s => new Shortlist(s));
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
    return new Shortlist(shortlist);
  }

  /**
   * Delete shortlist by ID
   */
  static async delete(id: string): Promise<boolean> {
    await prisma.shortlist.delete({ where: { id } });
    return true;
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
   * Count shortlists by CSR Rep
   */
  static async countByCSRRep(csrRepId: string): Promise<number> {
    return prisma.shortlist.count({ where: { csrRepId } });
  }

  /**
   * Count shortlists by request
   */
  static async countByRequest(requestId: string): Promise<number> {
    return prisma.shortlist.count({ where: { requestId } });
  }
}
