import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';
import { RequestStatus, UrgencyLevel } from '@prisma/client';

/**
 * Search My Requests Controller
 * 
 * Story #19: As a PIN, I want to search my request so that I can quickly find a specific one.
 */
export class SearchMyRequestsController {
  static async handle(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { query, search, status, urgency } = req.query;
      
      // Support both 'query' and 'search' parameters (frontend uses 'search')
      const searchQuery = query || search;

      const requests = await Request.searchByPIN(
        userId,
        typeof searchQuery === 'string' && searchQuery.trim() ? searchQuery : null,
        typeof status === 'string' ? status as RequestStatus : undefined,
        undefined, // categoryId not used in this controller
        typeof urgency === 'string' ? urgency as UrgencyLevel : undefined
      );

      res.json({ requests, total: requests.length });
    } catch (error) {
      next(error);
    }
  }
}

