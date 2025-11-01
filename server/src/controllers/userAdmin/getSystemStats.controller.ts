import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { UserAccount } from '../../entities/UserAccount.entity';
import { Request } from '../../entities/Request.entity';
import { Match } from '../../entities/Match.entity';
import { UserStatus, RequestStatus, MatchStatus } from '@prisma/client';

/**
 * Get System Statistics Controller
 * 
 * Utility: Get overall system statistics (not part of user stories)
 */
export class GetSystemStatsController {
  static async handle(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
    try {

      const [
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalRequests,
        activeRequests,
        totalMatches,
      ] = await Promise.all([
        UserAccount.count(),
        UserAccount.countByStatus(UserStatus.ACTIVE),
        UserAccount.countByStatus(UserStatus.SUSPENDED),
        Request.count(),
        Request.countByStatus(RequestStatus.ACTIVE),
        Match.count(),
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
