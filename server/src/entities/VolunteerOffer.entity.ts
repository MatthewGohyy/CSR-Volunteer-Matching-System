import { VolunteerOffer as PrismaVolunteerOffer, OfferStatus } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * Volunteer Offer Class
 * 
 * Represents a volunteer offer from a CSR Rep to a PIN request with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
 */
export class VolunteerOffer implements PrismaVolunteerOffer {
  id: string;
  csrRepId: string;
  requestId: string;
  message: string | null;
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.csrRepId = data.csrRepId;
    this.requestId = data.requestId;
    this.message = data.message;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    
    // Preserve related data if included
    if (data.request) {
      (this as any).request = data.request;
    }
    if (data.csrRep) {
      (this as any).csrRep = data.csrRep;
    }
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
    return offer ? new VolunteerOffer(offer) : null;
  }

  /**
   * Check if offer exists for CSR Rep and request
   */
  static async exists(csrRepId: string, requestId: string): Promise<boolean> {
    const offer = await prisma.volunteerOffer.findFirst({
      where: {
        csrRepId,
        requestId,
      },
    });
    return !!offer;
  }

  /**
   * Search offers by CSR Rep with optional query filter
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

    const offers = await prisma.volunteerOffer.findMany({
      where,
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return offers.map(o => new VolunteerOffer(o));
  }

  /**
   * Create a new volunteer offer
   */
  static async create(data: {
    csrRepId: string;
    requestId: string;
    message?: string;
  }) {
    // Check if offer already exists
    const exists = await this.exists(data.csrRepId, data.requestId);
    if (exists) {
      throw new Error('Offer already submitted');
    }

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
    return new VolunteerOffer(offer);
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
    return new VolunteerOffer(offer);
  }

}
