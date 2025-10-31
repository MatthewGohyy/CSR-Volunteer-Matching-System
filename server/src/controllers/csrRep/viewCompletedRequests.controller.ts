import { Request, Response, NextFunction } from 'express';
import { Match } from '../../entities/Match.entity';
import { AppError } from '../../middleware/errorHandler';
import { MatchStatus } from '@prisma/client';

/**
 * View Completed Requests Controller
 * Story #32: As a CSR Rep, I want to view the history of previously completed requests
 */
export class ViewCompletedRequestsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;

      const allMatches = await Match.findByCSRRep(userId, 1, 100);
      const matches = allMatches.filter(m => m.status === MatchStatus.COMPLETED);

      res.json({ matches });
    } catch (error) {
      next(error);
    }
  }
}
