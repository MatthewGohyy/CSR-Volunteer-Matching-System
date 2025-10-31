import { Request, Response, NextFunction } from 'express';
import { MatchEntity } from '../../entities/Match.entity';
import { AppError } from '../../middleware/errorHandler';
import { MatchStatus } from '@prisma/client';

/**
 * Search Completed Requests Controller
 * Story #31: As a CSR Rep, I want to search the history of previously completed requests
 */
export class SearchCompletedRequestsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { query } = req.query;

      let allMatches = await MatchEntity.findByCSRRep(userId, 1, 100);
      let matches = allMatches.filter(m => m.status === MatchStatus.COMPLETED);

      res.json({ matches, total: matches.length });
    } catch (error) {
      next(error);
    }
  }
}
