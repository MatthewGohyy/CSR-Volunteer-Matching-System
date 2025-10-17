import { Request, Response, NextFunction } from 'express';
import { CSRRepRepository } from '../../repositories/CSRRep.repository';
import { ShortlistRepository } from '../../repositories/Shortlist.repository';
import { AppError } from '../../middleware/errorHandler';

/**
 * View Shortlist Controller
 * Story #30: As a CSR Rep, I want to view my shortlist
 */
export class ViewShortlistController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;

      const csrRepRepository = new CSRRepRepository();
      const shortlistRepository = new ShortlistRepository();

      const csrRep = await csrRepRepository.findByUserId(userId);
      if (!csrRep) throw new AppError('CSR Rep profile not found', 404);

      const shortlists = await shortlistRepository.findByCSRRep(csrRep.id, 1, 100);

      res.json({ shortlists });
    } catch (error) {
      next(error);
    }
  }
}
