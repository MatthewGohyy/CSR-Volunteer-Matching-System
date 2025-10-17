import { Notification as PrismaNotification, NotificationType } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * Notification Entity Class
 * 
 * Represents a user notification with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
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

  // ============================================
  // CRUD Methods (Static) - Database Operations
  // ============================================

  /**
   * Find notification by ID
   */
  static async findById(id: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });
    return notification ? new NotificationEntity(notification) : null;
  }

  /**
   * Find notifications by user ID with pagination
   */
  static async findByUserId(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return notifications.map(n => new NotificationEntity(n));
  }

  /**
   * Find unread notifications by user ID
   */
  static async findUnreadByUserId(userId: string) {
    const notifications = await prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
    });
    return notifications.map(n => new NotificationEntity(n));
  }

  /**
   * Create a new notification
   */
  static async create(data: {
    userId: string;
    type: NotificationType;
    message: string;
  }) {
    const notification = await prisma.notification.create({
      data: {
        ...data,
        isRead: false,
      },
    });
    return new NotificationEntity(notification);
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id: string) {
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return new NotificationEntity(notification);
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return true;
  }

  /**
   * Count unread notifications for a user
   */
  static async countUnread(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  /**
   * Delete notification
   */
  static async delete(id: string): Promise<boolean> {
    await prisma.notification.delete({ where: { id } });
    return true;
  }
}
