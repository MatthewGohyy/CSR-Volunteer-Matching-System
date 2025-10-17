import { Request, Response, NextFunction } from 'express';
import { PINRepository } from '../../repositories/PIN.repository';
import { RequestRepository } from '../../repositories/Request.repository';
import { AppError } from '../../middleware/errorHandler';
import { RequestStatus } from '@prisma/client';

/**
 * Search Completed Requests Controller
 * 
 * Story #22: As a PIN, I want to search the history of previously completed requests 
 * so that I can review past help I've received.
 */
export class SearchCompletedRequestsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { q, page = '1', limit = '10' } = req.query;

      if (!q || typeof q !== 'string') {
        throw new AppError('Search query is required', 400);
      }

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Get PIN profile
      const pinRepository = new PINRepository();
      const requestRepository = new RequestRepository();

      const pin = await pinRepository.findByUserId(userId);
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      let allRequests = await requestRepository.findByPIN(pin.id, 1, 1000);
      allRequests = allRequests.filter(r => 
        (r.status === RequestStatus.COMPLETED || r.status === RequestStatus.MATCHED) &&
        (r.title.toLowerCase().includes(q.toLowerCase()) || r.description.toLowerCase().includes(q.toLowerCase()))
      );

      const total = allRequests.length;
      const requests = allRequests.slice(skip, skip + limitNum);

      res.json({
        requests,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

