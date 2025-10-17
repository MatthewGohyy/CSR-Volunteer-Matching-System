import { Response, NextFunction } from 'express';
import { ServiceCategoryRepository } from '../../repositories/ServiceCategory.repository';
import { RequestRepository } from '../../repositories/Request.repository';
import { MatchRepository } from '../../repositories/Match.repository';
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
      const categoryRepository = new ServiceCategoryRepository();
      const requestRepository = new RequestRepository();
      const matchRepository = new MatchRepository();

      const [
        totalCategories,
        activeCategories,
        totalRequests,
        activeRequests,
        completedRequests,
        totalMatches,
      ] = await Promise.all([
        categoryRepository.count(),
        categoryRepository.findActive().then(c => c.length),
        requestRepository.count(),
        requestRepository.countByStatus(RequestStatus.ACTIVE),
        requestRepository.countByStatus(RequestStatus.COMPLETED),
        matchRepository.count(),
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
