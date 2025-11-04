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
export class ViewCompletedRequestsController {
  static async handle(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user!.userId;

      const request = await Request.findById(id);

      if (!request) {
        throw new AppError('Request not found', 404);
      }

      // Verify request belongs to the PIN
      if (request.pinId !== userId) {
        throw new AppError('Unauthorized access to this request', 403);
      }

      // Verify request is completed (not just matched - matches are active)
      if (request.status !== RequestStatus.COMPLETED) {
        throw new AppError('This request is not in completed history', 400);
      }

      res.json({
        request,
      });
    } catch (error) {
      next(error);
    }
  }
}

