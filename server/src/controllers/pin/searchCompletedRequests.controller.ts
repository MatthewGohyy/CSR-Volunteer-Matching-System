import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request } from '../../entities/Request.entity';

/**
 * Search Completed Requests Controller
 * 
 * Story #22: As a PIN, I want to search the history of previously completed requests 
 * so that I can review past help I've received.
 * Also handles viewing all completed requests when no search query is provided
 * Follows BCE pattern - all database operations through entity class
 */
export class SearchCompletedRequestsController {
  static async handle(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { q, search } = req.query;

      // Support both 'q' and 'search' parameters, make it optional
      const searchQuery = typeof q === 'string' || typeof search === 'string'
        ? (q || search) as string
        : null;

      // All logic encapsulated in entity method
      const requests = await Request.findCompletedByPIN(userId, searchQuery);

      res.json({
        requests,
        total: requests.length,
      });
    } catch (error) {
      next(error);
    }
  }
}

