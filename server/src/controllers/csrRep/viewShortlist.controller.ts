import { Request, Response, NextFunction } from 'express';
import { Shortlist } from '../../entities/Shortlist.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View Shortlist Controller
 * Story #30: As a CSR Rep, I want to view my shortlist
 */
export class ViewShortlistController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;

      const shortlists = await Shortlist.findByCSRRep(userId, 1, 100);
      const total = shortlists.length;

      // Format the response - ensure request data is properly structured
      const formattedShortlists = shortlists.map((s: any) => ({
        id: s.id,
        createdAt: s.createdAt.toISOString(),
        request: s.request,
      }));

      res.json({ 
        shortlist: formattedShortlists,
        total
      });
    } catch (error) {
      next(error);
    }
  }
}
