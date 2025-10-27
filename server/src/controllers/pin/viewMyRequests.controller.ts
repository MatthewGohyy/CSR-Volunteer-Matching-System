import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { RequestEntity } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View My Requests Controller
 * 
 * Story #16: As a PIN, I want to view my requests so that I can monitor their status and progress.
 */
export class ViewMyRequestsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;

      const user = await UserAccountEntity.findByUserIdWithProfileName(userId, 'Person in Need');
      if (!user) {
        throw new AppError('PIN profile not found', 404);
      }

      const requests = await RequestEntity.findByPIN(user.id, 1, 100);
      const total = requests.length;

      res.json({ requests, total });
    } catch (error) {
      next(error);
    }
  }
}

