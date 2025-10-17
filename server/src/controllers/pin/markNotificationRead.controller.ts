import { Response, NextFunction } from 'express';
import { NotificationEntity } from '../../entities/Notification.entity';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for marking a notification as read
 * User Story: Mark notification as read
 */
export class MarkNotificationReadController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { notificationId } = req.params;

      const notification = await NotificationEntity.findById(notificationId);

      if (!notification) {
        throw new AppError('Notification not found', 404);
      }

      if (notification.userId !== userId) {
        throw new AppError('Unauthorized', 403);
      }

      await NotificationEntity.markAsRead(notificationId);

      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  }
}
