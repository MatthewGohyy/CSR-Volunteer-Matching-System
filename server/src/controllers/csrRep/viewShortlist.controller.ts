import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { ShortlistEntity } from '../../entities/Shortlist.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View Shortlist Controller
 * Story #30: As a CSR Rep, I want to view my shortlist
 */
export class ViewShortlistController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;


      const user = await UserAccountEntity.findByUserIdWithProfileName(userId, 'CSR Representative');
      if (!user) throw new AppError('CSR Rep profile not found', 404);

      const shortlists = await ShortlistEntity.findByCSRRep(user.id, 1, 100);

      res.json({ shortlists });
    } catch (error) {
      next(error);
    }
  }
}
