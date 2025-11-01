import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View Request View Controller (Singular)
 * 
 * Story #20: As a PIN, I want to view the number of views of my request 
 * so that I can track engagement and progress.
 * Follows BCE pattern - all database operations through entity class
 */
export class ViewRequestViewController {
  static async handle(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user!.userId;

      // Entity method returns count directly
      const viewCount = await Request.getViewCount(userId, id);

      res.json({
        viewCount,
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

