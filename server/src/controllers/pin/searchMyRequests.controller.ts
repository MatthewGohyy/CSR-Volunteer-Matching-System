import { Request, Response, NextFunction } from 'express';
import { RequestEntity } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';
import { RequestStatus, UrgencyLevel } from '@prisma/client';

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

      let requests;
      if (status) {
        requests = await RequestEntity.findByStatus(status as RequestStatus, 1, 100);
        requests = requests.filter(r => r.pinId === userId);
      } else if (urgency) {
        requests = await RequestEntity.findByUrgency(urgency as UrgencyLevel, 1, 100);
        requests = requests.filter(r => r.pinId === userId);
      } else {
        requests = await RequestEntity.findByPIN(userId, 1, 100);
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

