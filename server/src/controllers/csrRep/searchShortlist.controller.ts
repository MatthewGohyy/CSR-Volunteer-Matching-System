import { Request, Response, NextFunction } from 'express';
import { CSRRepRepository } from '../../repositories/CSRRep.repository';
import { ShortlistRepository } from '../../repositories/Shortlist.repository';
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

      const csrRepRepository = new CSRRepRepository();
      const shortlistRepository = new ShortlistRepository();

      const csrRep = await csrRepRepository.findByUserId(userId);
      if (!csrRep) throw new AppError('CSR Rep profile not found', 404);

      const shortlists = await shortlistRepository.findByCSRRep(csrRep.id, 1, 100);

      res.json({ shortlists, total: shortlists.length });
    } catch (error) {
      next(error);
    }
  }
}
