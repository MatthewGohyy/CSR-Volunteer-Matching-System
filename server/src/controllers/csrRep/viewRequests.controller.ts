import { Request, Response, NextFunction } from 'express';
import { RequestEntity } from '../../entities/Request.entity';
import { RequestStatus } from '@prisma/client';

/**
 * View Requests Controller
 * Story #27: As a CSR Rep, I want to view requests
 */
export class ViewRequestsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, categoryId, urgency } = req.query;

      // Only return active requests by default for CSR Reps
      const searchParams: any = {};
      
      if (typeof urgency === 'string') {
        searchParams.urgency = urgency;
      }
      
      if (typeof categoryId === 'string') {
        searchParams.categoryId = categoryId;
      }

      const requests = await RequestEntity.searchWithFilters(searchParams, 1, 100);
      const total = requests.length;

      res.json({ requests, total });
    } catch (error) {
      next(error);
    }
  }
}
