import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { ShortlistEntity } from '../../entities/Shortlist.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Get Shortlisted IDs Controller
 * Returns list of request IDs that are shortlisted by the current CSR Rep
 */
export class GetShortlistedIdsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      
      const user = await UserAccountEntity.findByUserIdWithProfileName(userId, 'CSR Representative');
      if (!user) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      const shortlistedIds = await ShortlistEntity.getShortlistedRequestIds(user.id);

      res.json({ shortlistedIds });
    } catch (error) {
      next(error);
    }
  }
}

