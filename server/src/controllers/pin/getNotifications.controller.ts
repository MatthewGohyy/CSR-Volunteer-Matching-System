import { Response, NextFunction } from 'express';
import { UserProfileRole } from "@prisma/client";
import { NotificationEntity } from '../../entities/Notification.entity';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for viewing PIN's notifications
 * User Story: View my notifications
 */
export class GetNotificationsController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      const notifications = await NotificationEntity.findByUserId(userId, 1, 50);

      res.json({ notifications });
    } catch (error) {
      next(error);
    }
  }
}
