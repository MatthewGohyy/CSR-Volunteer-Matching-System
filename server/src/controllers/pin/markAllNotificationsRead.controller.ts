import { Response, NextFunction } from 'express';
import { Notification } from '../../entities/Notification.entity';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for marking all notifications as read
 * User Story: Mark all notifications as read
 */
export class MarkAllNotificationsReadController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      await Notification.markAllAsRead(userId);

      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }
}
