import { VolunteerOffer as PrismaVolunteerOffer, OfferStatus } from '@prisma/client';

/**
 * Volunteer Offer Entity Class
 * 
 * Represents a volunteer offer from a CSR Rep to a PIN request.
 * Maps to the Prisma VolunteerOffer model.
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
}
