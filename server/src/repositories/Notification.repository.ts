import { prisma } from '../config/database';
import { NotificationEntity } from '../entities/Notification.entity';
import { NotificationType } from '@prisma/client';

/**
 * Notification Repository
 * 
 * Handles all database operations for Notification entity.
 */
export class NotificationRepository {
  async findById(id: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });
    return notification ? new NotificationEntity(notification) : null;
  }

  async findByUserId(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return notifications.map(n => new NotificationEntity(n));
  }

  async findUnreadByUserId(userId: string) {
    const notifications = await prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
    });
    return notifications.map(n => new NotificationEntity(n));
  }

  async create(data: {
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

  async markAsRead(id: string) {
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return new NotificationEntity(notification);
  }

  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return true;
  }

  async countUnread(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.notification.delete({ where: { id } });
    return true;
  }
}
