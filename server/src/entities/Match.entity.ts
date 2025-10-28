import { Match as PrismaMatch, MatchStatus } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * Match Entity Class
 * 
 * Represents a match between a PIN request and CSR Rep with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
 */
export class MatchEntity implements PrismaMatch {
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

  /**
   * Check if match is active
   */
  isActive(): boolean {
    return this.status === MatchStatus.ACTIVE;
  }

  /**
   * Check if match is completed
   */
  isCompleted(): boolean {
    return this.status === MatchStatus.COMPLETED;
  }

  /**
   * Check if match is cancelled
   */
  isCancelled(): boolean {
    return this.status === MatchStatus.CANCELLED;
  }

  /**
   * Get match duration in days
   */
  getDurationInDays(): number | null {
    if (!this.completedAt) return null;
    const diff = this.completedAt.getTime() - this.matchedAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
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
    return match ? new MatchEntity(match) : null;
  }

  /**
   * Find match by request ID
   */
  static async findByRequestId(requestId: string) {
    const match = await prisma.match.findUnique({
      where: { requestId },
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
        pin: true,
      },
    });
    return match ? new MatchEntity(match) : null;
  }

  /**
   * Find matches by PIN
   */
  static async findByPIN(pinId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const matches = await prisma.match.findMany({
      where: { pinId },
      skip,
      take: limit,
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
      },
      orderBy: { matchedAt: 'desc' },
    });
    return matches.map(m => new MatchEntity(m));
  }

  /**
   * Find matches by CSR Rep
   */
  static async findByCSRRep(csrRepId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const matches = await prisma.match.findMany({
      where: { csrRepId },
      skip,
      take: limit,
      include: {
        request: { include: { pin: true, category: true } },
        pin: true,
      },
      orderBy: { matchedAt: 'desc' },
    });
    return matches.map(m => new MatchEntity(m));
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
    return new MatchEntity(match);
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
    return new MatchEntity(match);
  }

  /**
   * Delete match
   */
  static async delete(id: string): Promise<boolean> {
    await prisma.match.delete({ where: { id } });
    return true;
  }

  /**
   * Count matches by PIN
   */
  static async countByPIN(pinId: string): Promise<number> {
    return prisma.match.count({ where: { pinId } });
  }

  /**
   * Count matches by CSR Rep
   */
  static async countByCSRRep(csrRepId: string): Promise<number> {
    return prisma.match.count({ where: { csrRepId } });
  }

  /**
   * Count total matches
   */
  static async count(): Promise<number> {
    return prisma.match.count();
  }
}
