import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { RequestEntity } from '../../entities/Request.entity';
import { MatchEntity } from '../../entities/Match.entity';
import { UserStatus, RequestStatus, MatchStatus } from '@prisma/client';

/**
 * Get System Statistics Controller
 * 
 * Utility: Get overall system statistics (not part of user stories)
 */
export class GetSystemStatsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const [
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalRequests,
        activeRequests,
        totalMatches,
      ] = await Promise.all([
        UserAccountEntity.count(),
        UserAccountEntity.countByStatus(UserStatus.ACTIVE),
        UserAccountEntity.countByStatus(UserStatus.SUSPENDED),
        RequestEntity.count(),
        RequestEntity.countByStatus(RequestStatus.ACTIVE),
        MatchEntity.count(),
      ]);

      res.json({
        users: {
          total: totalUsers,
          active: activeUsers,
          suspended: suspendedUsers,
        },
        requests: {
          total: totalRequests,
          active: activeRequests,
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
