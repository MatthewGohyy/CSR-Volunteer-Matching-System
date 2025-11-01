import { Request, Response, NextFunction } from 'express';
import { Shortlist } from '../../entities/Shortlist.entity';

/**
 * Search Shortlist Controller
 * Story #29: As a CSR Rep, I want to search my shortlist
 * 
 * Handles listing/searching shortlisted items:
 * - No params: returns all shortlisted items
 * - With query: returns filtered shortlisted items (by request title/description)
 */
export class SearchShortlistController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { search } = req.query;

      // Use Shortlist.search() with optional query
      // query=null means return all
      const shortlists = await Shortlist.search(
        userId,
        typeof search === 'string' && search.trim() ? search : null
      );

      // Format the response
      const formattedShortlists = shortlists.map((s: any) => ({
        id: s.id,
        createdAt: s.createdAt.toISOString(),
        request: s.request,
      }));

      res.json({ 
        shortlist: formattedShortlists,
        total: formattedShortlists.length 
      });
    } catch (error) {
      next(error);
    }
  }
}
