import { Notification as PrismaNotification, NotificationType } from '@prisma/client';

/**
 * Notification Entity Class
 * 
 * Represents a user notification.
 * Maps to the Prisma Notification model.
 */
export class NotificationEntity implements PrismaNotification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;

  constructor(data: PrismaNotification) {
    this.id = data.id;
    this.userId = data.userId;
    this.type = data.type;
    this.message = data.message;
    this.isRead = data.isRead;
    this.createdAt = data.createdAt;
  }

  /**
   * Check if notification is unread
   */
  isUnread(): boolean {
    return !this.isRead;
  }

  /**
   * Check if notification is about a match
   */
  isMatchNotification(): boolean {
    return this.type === NotificationType.MATCH_CONFIRMED || 
           this.type === NotificationType.MATCH_CANCELLED;
  }

  /**
   * Check if notification is about an offer
   */
  isOfferNotification(): boolean {
    return this.type === NotificationType.VOLUNTEER_OFFER ||
           this.type === NotificationType.OFFER_ACCEPTED ||
           this.type === NotificationType.OFFER_DECLINED;
  }

  /**
   * Get notification age in hours
   */
  getAgeInHours(): number {
    const now = new Date();
    const diff = now.getTime() - this.createdAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60));
  }

  /**
   * Check if notification is recent (< 24 hours)
   */
  isRecent(): boolean {
    return this.getAgeInHours() < 24;
  }
}
