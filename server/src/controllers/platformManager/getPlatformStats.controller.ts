import { Response, NextFunction } from 'express';
import { RequestCategoryEntity } from '../../entities/RequestCategory.entity';
import { RequestEntity } from '../../entities/Request.entity';
import { MatchEntity } from '../../entities/Match.entity';
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
        RequestCategoryEntity.count(),
        RequestCategoryEntity.findActive().then(c => c.length),
        RequestEntity.count(),
        RequestEntity.countByStatus(RequestStatus.ACTIVE),
        RequestEntity.countByStatus(RequestStatus.COMPLETED),
        MatchEntity.count(),
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
