import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View Request Shortlist Controller (Singular)
 * 
 * Story #21: As a PIN, I want to view the number of shortlists of my request 
 * so that I can track interest from CSR Reps.
 * Follows BCE pattern - all database operations through entity class
 */
export class ViewRequestShortlistController {
  static async handle(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user!.userId;

      // Entity method returns count directly
      const shortlistCount = await Request.getShortlistCount(userId, id);

      res.json({
        shortlistCount,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Request not found') {
          return next(new AppError('Request not found', 404));
        }
        if (error.message === 'Unauthorized access to this request') {
          return next(new AppError('Unauthorized access to this request', 403));
        }
      }
      next(error);
    }
  }
}

