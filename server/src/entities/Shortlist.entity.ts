import { Shortlist as PrismaShortlist } from '@prisma/client';

/**
 * Shortlist Entity Class
 * 
 * Represents a CSR Rep's shortlisted request.
 * Maps to the Prisma Shortlist model.
 */
export class ShortlistEntity implements PrismaShortlist {
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
}
