import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';
import { RequestStatus } from '@prisma/client';

/**
 * View Completed Request Controller (Singular)
 * 
 * Story #23: As a PIN, I want to view the history of previously completed requests 
 * so that I can review past help I've received.
 * Follows BCE pattern - all database operations through entity class
 * Used when PIN clicks into a completed request to view details
 */
export class ViewCompletedRequestController {
  static async handle(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user!.userId;

      const request = await Request.findById(id);

      if (!request) {
        throw new AppError('Request not found', 404);
      }

      res.json({
        request,
      });
    } catch (error) {
      next(error);
    }
  }
}

