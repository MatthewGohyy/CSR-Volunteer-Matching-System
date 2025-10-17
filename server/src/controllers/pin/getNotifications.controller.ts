import { Response, NextFunction } from 'express';
import { NotificationRepository } from '../../repositories/Notification.repository';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for viewing PIN's notifications
 * User Story: View my notifications
 */
export class GetNotificationsController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const notificationRepository = new NotificationRepository();
      const userId = req.user!.userId;

      const notifications = await notificationRepository.findByUserId(userId, 1, 50);

      res.json({ notifications });
    } catch (error) {
      next(error);
    }
  }
}
