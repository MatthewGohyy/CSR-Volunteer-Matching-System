import { Request, Response, NextFunction } from 'express';
import { CSRRepEntity } from '../../entities/CSRRep.entity';
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


      const csrRep = await CSRRepEntity.findByUserId(userId);
      if (!csrRep) throw new AppError('CSR Rep profile not found', 404);

      let allMatches = await MatchEntity.findByCSRRep(csrRep.id, 1, 100);
      let matches = allMatches.filter(m => m.status === MatchStatus.COMPLETED);

      res.json({ matches, total: matches.length });
    } catch (error) {
      next(error);
    }
  }
}
