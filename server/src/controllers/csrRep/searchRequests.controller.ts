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

      // Use searchWithFilters to get only active requests with applied filters
      const requests = await RequestEntity.searchWithFilters({
        query: typeof query === 'string' ? query : undefined,
        urgency: typeof urgency === 'string' ? urgency as UrgencyLevel : undefined,
        categoryId: typeof categoryId === 'string' ? categoryId : undefined,
      }, 1, 100);

      res.json({ requests, total: requests.length });
    } catch (error) {
      next(error);
    }
  }
}
