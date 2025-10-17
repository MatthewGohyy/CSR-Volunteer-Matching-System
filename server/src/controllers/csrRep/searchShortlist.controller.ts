import { Request, Response, NextFunction } from 'express';
import { CSRRepEntity } from '../../entities/CSRRep.entity';
import { ShortlistEntity } from '../../entities/Shortlist.entity';
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


      const csrRep = await CSRRepEntity.findByUserId(userId);
      if (!csrRep) throw new AppError('CSR Rep profile not found', 404);

      const shortlists = await ShortlistEntity.findByCSRRep(csrRep.id, 1, 100);

      res.json({ shortlists, total: shortlists.length });
    } catch (error) {
      next(error);
    }
  }
}
