import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View My Requests Controller
 * 
 * Story #16: As a PIN, I want to view my requests so that I can monitor their status and progress.
 */
export class ViewMyRequestsController {
  static async handle(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;

      const requests = await Request.findByPIN(userId, 1, 100);
      const total = requests.length;

      res.json({ requests, total });
    } catch (error) {
      next(error);
    }
  }
}

