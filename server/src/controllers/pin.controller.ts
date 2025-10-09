import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export class PINController {
  // Get my profile
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      const pin = await prisma.pIN.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              email: true,
              status: true,
              createdAt: true,
            },
          },
        },
      });

      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      res.json({ profile: pin });
    } catch (error) {
      next(error);
    }
  }

  // Update profile
  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { name, age, location, phoneNumber, accessibilityNeeds, profilePhoto } = req.body;

      // Get PIN profile
      const pin = await prisma.pIN.findUnique({ where: { userId } });
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      // Update profile
      const updated = await prisma.pIN.update({
        where: { id: pin.id },
        data: {
          ...(name && { name }),
          ...(age !== undefined && { age }),
          ...(location && { location }),
          ...(phoneNumber && { phoneNumber }),
          ...(accessibilityNeeds !== undefined && { accessibilityNeeds }),
          ...(profilePhoto && { profilePhoto }),
        },
      });

      res.json({
        message: 'Profile updated successfully',
        profile: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get my matches
  static async getMyMatches(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      // Get PIN profile
      const pin = await prisma.pIN.findUnique({ where: { userId } });
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      const matches = await prisma.match.findMany({
        where: { pinId: pin.id },
        include: {
          request: {
            include: {
              category: true,
            },
          },
          csrRep: {
            select: {
              companyName: true,
              contactPerson: true,
              phoneNumber: true,
              industry: true,
              companyAddress: true,
            },
          },
        },
        orderBy: {
          matchedAt: 'desc',
        },
      });

      res.json({ matches });
    } catch (error) {
      next(error);
    }
  }

  // Get notifications
  static async getNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50, // Limit to recent 50 notifications
      });

      res.json({ notifications });
    } catch (error) {
      next(error);
    }
  }

  // Mark notification as read
  static async markNotificationRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { notificationId } = req.params;

      // Verify notification belongs to user
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification) {
        throw new AppError('Notification not found', 404);
      }

      if (notification.userId !== userId) {
        throw new AppError('Unauthorized', 403);
      }

      // Mark as read
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });

      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  }

  // Mark all notifications as read
  static async markAllNotificationsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: { isRead: true },
      });

      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }
}

