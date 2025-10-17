import { Request as PrismaRequest, RequestStatus, UrgencyLevel, PIN, ServiceCategory } from '@prisma/client';

/**
 * Request Entity Class
 * 
 * Represents a help request created by a PIN.
 * Maps to the Prisma Request model.
 */
export class RequestEntity implements PrismaRequest {
  id: string;
  pinId: string;
  categoryId: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  dateNeeded: Date | null;
  location: string | null;
  status: RequestStatus;
  viewCount: number;
  shortlistCount: number;
  createdAt: Date;
  updatedAt: Date;

  // Related data
  pin?: PIN;
  category?: ServiceCategory;

  constructor(data: PrismaRequest & {
    pin?: PIN;
    category?: ServiceCategory;
  }) {
    this.id = data.id;
    this.pinId = data.pinId;
    this.categoryId = data.categoryId;
    this.title = data.title;
    this.description = data.description;
    this.urgency = data.urgency;
    this.dateNeeded = data.dateNeeded;
    this.location = data.location;
    this.status = data.status;
    this.viewCount = data.viewCount;
    this.shortlistCount = data.shortlistCount;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.pin = data.pin;
    this.category = data.category;
  }

  /**
   * Check if request is active
   */
  isActive(): boolean {
    return this.status === RequestStatus.ACTIVE;
  }

  /**
   * Check if request is matched
   */
  isMatched(): boolean {
    return this.status === RequestStatus.MATCHED;
  }

  /**
   * Check if request is completed
   */
  isCompleted(): boolean {
    return this.status === RequestStatus.COMPLETED;
  }

  /**
   * Check if request is urgent
   */
  isUrgent(): boolean {
    return this.urgency === UrgencyLevel.HIGH;
  }

  /**
   * Check if request is overdue
   */
  isOverdue(): boolean {
    if (!this.dateNeeded) return false;
    return this.dateNeeded < new Date() && this.status === RequestStatus.ACTIVE;
  }

  /**
   * Increment view count
   */
  incrementViewCount(): number {
    return this.viewCount + 1;
  }

  /**
   * Increment shortlist count
   */
  incrementShortlistCount(): number {
    return this.shortlistCount + 1;
  }
}
