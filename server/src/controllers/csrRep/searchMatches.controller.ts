import { Response, NextFunction } from 'express';
import { Match } from '../../entities/Match.entity';
import { AuthRequest } from '../../middleware/auth';

/**
 * Search Matches Controller
 * 
 * Handles listing/searching matches:
 * - No params: returns all matches for CSR Rep
 * - With query: returns filtered matches (by request title/description)
 */
export class SearchMatchesController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { search } = req.query;

      // Use Match.search() with optional query
      // query=null means return all matches (no status filter)
      const matches = await Match.search(
        userId,
        typeof search === 'string' && search.trim() ? search : null,
        null // No status filter - return all matches
      );

      res.json({ matches, total: matches.length });
    } catch (error) {
      next(error);
    }
  }
}

