import { Response, NextFunction } from 'express';
import { Match } from '../../entities/Match.entity';
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

      const matches = await Match.findByPIN(userId, 1, 100);

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
