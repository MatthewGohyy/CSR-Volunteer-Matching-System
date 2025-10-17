import { VolunteerOffer as PrismaVolunteerOffer, OfferStatus } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * Volunteer Offer Entity Class
 * 
 * Represents a volunteer offer from a CSR Rep to a PIN request with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
 */
export class VolunteerOfferEntity implements PrismaVolunteerOffer {
  id: string;
  csrRepId: string;
  requestId: string;
  message: string | null;
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: PrismaVolunteerOffer) {
    this.id = data.id;
    this.csrRepId = data.csrRepId;
    this.requestId = data.requestId;
    this.message = data.message;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * Check if offer is pending
   */
  isPending(): boolean {
    return this.status === OfferStatus.PENDING;
  }

  /**
   * Check if offer is accepted
   */
  isAccepted(): boolean {
    return this.status === OfferStatus.ACCEPTED;
  }

  /**
   * Check if offer is declined
   */
  isDeclined(): boolean {
    return this.status === OfferStatus.DECLINED;
  }

  /**
   * Check if has message
   */
  hasMessage(): boolean {
    return !!this.message;
  }

  /**
   * Get age in hours
   */
  getAgeInHours(): number {
    const now = new Date();
    const diff = now.getTime() - this.createdAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60));
  }

  // ============================================
  // CRUD Methods (Static) - Database Operations
  // ============================================

  /**
   * Find offer by ID
   */
  static async findById(id: string) {
    const offer = await prisma.volunteerOffer.findUnique({
      where: { id },
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
      },
    });
    return offer ? new VolunteerOfferEntity(offer) : null;
  }

  /**
   * Find offers by CSR Rep
   */
  static async findByCSRRep(csrRepId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const offers = await prisma.volunteerOffer.findMany({
      where: { csrRepId },
      skip,
      take: limit,
      include: {
        request: { include: { pin: true, category: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return offers.map(o => new VolunteerOfferEntity(o));
  }

  /**
   * Find offers by request
   */
  static async findByRequest(requestId: string) {
    const offers = await prisma.volunteerOffer.findMany({
      where: { requestId },
      include: {
        csrRep: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return offers.map(o => new VolunteerOfferEntity(o));
  }

  /**
   * Find offers by status
   */
  static async findByStatus(status: OfferStatus, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const offers = await prisma.volunteerOffer.findMany({
      where: { status },
      skip,
      take: limit,
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return offers.map(o => new VolunteerOfferEntity(o));
  }

  /**
   * Create a new volunteer offer
   */
  static async create(data: {
    csrRepId: string;
    requestId: string;
    message?: string;
  }) {
    const offer = await prisma.volunteerOffer.create({
      data: {
        ...data,
        status: OfferStatus.PENDING,
      },
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
      },
    });
    return new VolunteerOfferEntity(offer);
  }

  /**
   * Update volunteer offer
   */
  static async update(id: string, data: Partial<{
    message: string;
    status: OfferStatus;
  }>) {
    const offer = await prisma.volunteerOffer.update({
      where: { id },
      data,
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
      },
    });
    return new VolunteerOfferEntity(offer);
  }

  /**
   * Delete volunteer offer
   */
  static async delete(id: string): Promise<boolean> {
    await prisma.volunteerOffer.delete({ where: { id } });
    return true;
  }

  /**
   * Count offers by CSR Rep
   */
  static async countByCSRRep(csrRepId: string): Promise<number> {
    return prisma.volunteerOffer.count({ where: { csrRepId } });
  }

  /**
   * Count offers by request
   */
  static async countByRequest(requestId: string): Promise<number> {
    return prisma.volunteerOffer.count({ where: { requestId } });
  }

  /**
   * Count offers by status
   */
  static async countByStatus(status: OfferStatus): Promise<number> {
    return prisma.volunteerOffer.count({ where: { status } });
  }
}
