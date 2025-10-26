import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { UserProfileRole } from '@prisma/client';
import { RequestEntity } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';
import { RequestStatus, UrgencyLevel } from '@prisma/client';
import { prisma } from '../../config/database';

/**
 * Search My Requests Controller
 * 
 * Story #19: As a PIN, I want to search my request so that I can quickly find a specific one.
 */
export class SearchMyRequestsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { query, status, urgency } = req.query;

      const user = await UserAccountEntity.findByUserIdWithRole(userId, UserProfileRole.PIN);
      if (!user) {
        throw new AppError('PIN profile not found', 404);
      }

      let requests;
      if (status) {
        requests = await RequestEntity.findByStatus(status as RequestStatus, 1, 100);
        requests = requests.filter(r => r.pinId === user.id);
      } else if (urgency) {
        requests = await RequestEntity.findByUrgency(urgency as UrgencyLevel, 1, 100);
        requests = requests.filter(r => r.pinId === user.id);
      } else {
        requests = await RequestEntity.findByPIN(user.id, 1, 100);
      }

      if (query && typeof query === 'string') {
        const lowerQuery = query.toLowerCase();
        requests = requests.filter(r => 
          r.title.toLowerCase().includes(lowerQuery) ||
          r.description.toLowerCase().includes(lowerQuery)
        );
      }

      res.json({ requests, total: requests.length });
    } catch (error) {
      next(error);
    }
  }
}

