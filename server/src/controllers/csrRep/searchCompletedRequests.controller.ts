import { Request, Response, NextFunction } from 'express';
import { Match } from '../../entities/Match.entity';
import { MatchStatus } from '@prisma/client';

/**
 * Search Completed Requests Controller
 * Story #31: As a CSR Rep, I want to search the history of previously completed requests
 * 
 * Handles listing/searching completed matches:
 * - No params: returns all completed matches
 * - With query: returns filtered completed matches (by request title/description)
 */
export class SearchCompletedRequestsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { search } = req.query;

      // Use Match.search() with COMPLETED status filter
      // query=null means return all completed matches
      const matches = await Match.search(
        userId,
        typeof search === 'string' && search.trim() ? search : null,
        MatchStatus.COMPLETED // Filter by completed status
      );

      res.json({ matches, total: matches.length });
    } catch (error) {
      next(error);
    }
  }
}
