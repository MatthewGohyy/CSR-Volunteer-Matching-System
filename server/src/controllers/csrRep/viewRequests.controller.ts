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
      const { status, categoryId } = req.query;

      let requests;
      if (status) {
        requests = await RequestEntity.findByStatus(status as RequestStatus, 1, 100);
      } else if (categoryId) {
        requests = await RequestEntity.findByCategory(categoryId as string, 1, 100);
      } else {
        requests = await RequestEntity.findAll(1, 100);
      }

      res.json({ requests });
    } catch (error) {
      next(error);
    }
  }
}
