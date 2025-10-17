import { Response, NextFunction } from 'express';
import { CSRRepRepository } from '../../repositories/CSRRep.repository';
import { MatchRepository } from '../../repositories/Match.repository';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for viewing CSR Rep's matched requests
 * User Story: View my matched volunteer opportunities
 */
export class ViewMatchesController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      // Get CSR Rep profile
      const csrRepRepository = new CSRRepRepository();
      const matchRepository = new MatchRepository();

      const csrRep = await csrRepRepository.findByUserId(userId);
      if (!csrRep) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      const matches = await matchRepository.findByCSRRep(csrRep.id, 1, 100);

      res.json({ matches });
    } catch (error) {
      next(error);
    }
  }
}
