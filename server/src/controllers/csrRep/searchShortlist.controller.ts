import { Request, Response, NextFunction } from 'express';
import { Shortlist } from '../../entities/Shortlist.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Search Shortlist Controller
 * Story #29: As a CSR Rep, I want to search my shortlist
 */
export class SearchShortlistController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { query } = req.query;

      const shortlists = await Shortlist.findByCSRRep(userId, 1, 100);

      res.json({ shortlists, total: shortlists.length });
    } catch (error) {
      next(error);
    }
  }
}
