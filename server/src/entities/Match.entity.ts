import { Match as PrismaMatch, MatchStatus } from '@prisma/client';

/**
 * Match Entity Class
 * 
 * Represents a match between a PIN request and CSR Rep.
 * Maps to the Prisma Match model.
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

  constructor(data: PrismaMatch) {
    this.id = data.id;
    this.requestId = data.requestId;
    this.csrRepId = data.csrRepId;
    this.pinId = data.pinId;
    this.status = data.status;
    this.matchedAt = data.matchedAt;
    this.completedAt = data.completedAt;
    this.cancellationReason = data.cancellationReason;
    this.updatedAt = data.updatedAt;
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
}
