import { Response, NextFunction } from 'express';
import { RequestCategory } from '../../entities/RequestCategory.entity';
import { Request } from '../../entities/Request.entity';
import { Match } from '../../entities/Match.entity';
import { AuthRequest } from '../../middleware/auth';
import { RequestStatus, MatchStatus } from '@prisma/client';

/**
 * Get Platform Statistics Controller
 * 
 * Utility: Get platform statistics for Platform Manager (not part of user stories)
 */
export class GetPlatformStatsController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {

      const [
        totalCategories,
        activeCategories,
        totalRequests,
        activeRequests,
        completedRequests,
        totalMatches,
      ] = await Promise.all([
        RequestCategory.count(),
        RequestCategory.findActive().then(c => c.length),
        Request.count(),
        Request.countByStatus(RequestStatus.ACTIVE),
        Request.countByStatus(RequestStatus.COMPLETED),
        Match.count(),
      ]);

      res.json({
        categories: {
          total: totalCategories,
          active: activeCategories,
          inactive: totalCategories - activeCategories,
        },
        requests: {
          total: totalRequests,
          active: activeRequests,
          completed: completedRequests,
        },
        matches: {
          total: totalMatches,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
