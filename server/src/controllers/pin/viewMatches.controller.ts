import { Response, NextFunction } from 'express';
import { PINRepository } from '../../repositories/PIN.repository';
import { MatchRepository } from '../../repositories/Match.repository';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for viewing PIN's matched requests
 * User Story: View my matched volunteer opportunities
 */
export class ViewMatchesController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const pinRepository = new PINRepository();
      const matchRepository = new MatchRepository();
      const userId = req.user!.userId;

      const pin = await pinRepository.findByUserId(userId);
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      const matches = await matchRepository.findByPIN(pin.id, 1, 100);

      res.json({ matches });
    } catch (error) {
      next(error);
    }
  }
}
