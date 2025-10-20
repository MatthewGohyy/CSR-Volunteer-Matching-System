import { Response, NextFunction } from 'express';
import { PINEntity } from '../../entities/PIN.entity';
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

      const pin = await PINEntity.findByUserId(userId);
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      const matches = await MatchEntity.findByPIN(pin.id, 1, 100);

      res.json({ matches });
    } catch (error) {
      next(error);
    }
  }
}
