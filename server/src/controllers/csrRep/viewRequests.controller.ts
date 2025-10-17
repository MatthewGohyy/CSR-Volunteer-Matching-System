import { Request, Response, NextFunction } from 'express';
import { RequestRepository } from '../../repositories/Request.repository';
import { RequestStatus } from '@prisma/client';

/**
 * View Requests Controller
 * Story #27: As a CSR Rep, I want to view requests
 */
export class ViewRequestsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestRepository = new RequestRepository();
      const { status, categoryId } = req.query;

      let requests;
      if (status) {
        requests = await requestRepository.findByStatus(status as RequestStatus, 1, 100);
      } else if (categoryId) {
        requests = await requestRepository.findByCategory(categoryId as string, 1, 100);
      } else {
        requests = await requestRepository.findAll(1, 100);
      }

      res.json({ requests });
    } catch (error) {
      next(error);
    }
  }
}
