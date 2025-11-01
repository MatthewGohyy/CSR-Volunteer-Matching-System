import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request } from '../../entities/Request.entity';
import { RequestStatus, UrgencyLevel } from '@prisma/client';

/**
 * Search Requests Controller
 * Story #26: As a CSR Rep, I want to search requests so that I can find appropriate requests
 * 
 * Handles listing/searching requests:
 * - No params: returns all ACTIVE requests
 * - With query/categoryId/urgency: returns filtered ACTIVE requests
 */
export class SearchRequestsController {
  static async handle(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query, urgency, categoryId } = req.query;

      // Use Request.search() with optional params
      // query=null means return all (with status filter)
      // Default status is ACTIVE
      const requests = await Request.search(
        typeof query === 'string' && query.trim() ? query : null,
        RequestStatus.ACTIVE, // Default to ACTIVE
        typeof categoryId === 'string' ? categoryId : undefined,
        typeof urgency === 'string' ? urgency as UrgencyLevel : undefined
      );

      res.json({ requests, total: requests.length });
    } catch (error) {
      next(error);
    }
  }
}
