import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { RequestEntity } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';
import { RequestStatus, UrgencyLevel } from '@prisma/client';

/**
 * Search Requests Controller
 * Story #26: As a CSR Rep, I want to search requests so that I can find appropriate requests
 */
export class SearchRequestsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { query, status, urgency, categoryId } = req.query;


      const user = await UserAccountEntity.findByUserIdWithProfileName(userId, 'CSR Representative');
      if (!user) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      let requests = await RequestEntity.findAll(1, 100);

      if (status) {
        requests = requests.filter(r => r.status === status);
      }
      if (urgency) {
        requests = requests.filter(r => r.urgency === urgency);
      }
      if (categoryId) {
        requests = requests.filter(r => r.categoryId === categoryId);
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
