import { Request, Response, NextFunction } from 'express';
import { Shortlist } from '../../entities/Shortlist.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Get Shortlisted IDs Controller
 * Returns list of request IDs that are shortlisted by the current CSR Rep
 */
export class GetShortlistedIdsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      
      const shortlistedIds = await Shortlist.getShortlistedRequestIds(userId);

      res.json({ shortlistedIds });
    } catch (error) {
      next(error);
    }
  }
}

