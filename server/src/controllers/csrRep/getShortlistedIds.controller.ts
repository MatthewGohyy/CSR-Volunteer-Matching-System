import { Request, Response, NextFunction } from 'express';
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
      
      const shortlistedIds = await ShortlistEntity.getShortlistedRequestIds(userId);

      res.json({ shortlistedIds });
    } catch (error) {
      next(error);
    }
  }
}

