import { Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { MatchEntity } from '../../entities/Match.entity';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for viewing PIN's matched requests
 * User Story: View my matched volunteer opportunities
 */
export class ViewMatchesController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      const user = await UserAccountEntity.findByUserIdWithProfileName(userId, 'Person in Need');
      if (!user) {
        throw new AppError('PIN profile not found', 404);
      }

      const matches = await MatchEntity.findByPIN(user.id, 1, 100);

      // Calculate statistics
      const total = matches.length;
      const active = matches.filter(m => m.status === 'ACTIVE').length;
      const completed = matches.filter(m => m.status === 'COMPLETED').length;
      const cancelled = matches.filter(m => m.status === 'CANCELLED').length;

      res.json({ 
        matches,
        total,
        active,
        completed,
        cancelled
      });
    } catch (error) {
      next(error);
    }
  }
}
