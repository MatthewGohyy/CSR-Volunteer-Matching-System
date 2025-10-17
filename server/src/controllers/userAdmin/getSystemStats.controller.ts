import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../repositories/User.repository';
import { RequestRepository } from '../../repositories/Request.repository';
import { MatchRepository } from '../../repositories/Match.repository';
import { UserStatus, RequestStatus, MatchStatus } from '@prisma/client';

/**
 * Get System Statistics Controller
 * 
 * Utility: Get overall system statistics (not part of user stories)
 */
export class GetSystemStatsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRepository = new UserRepository();
      const requestRepository = new RequestRepository();
      const matchRepository = new MatchRepository();

      const [
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalRequests,
        activeRequests,
        totalMatches,
      ] = await Promise.all([
        userRepository.count(),
        userRepository.countByStatus(UserStatus.ACTIVE),
        userRepository.countByStatus(UserStatus.SUSPENDED),
        requestRepository.count(),
        requestRepository.countByStatus(RequestStatus.ACTIVE),
        matchRepository.count(),
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
