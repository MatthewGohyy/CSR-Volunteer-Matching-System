import { Request, Response, NextFunction } from 'express';
import { RequestEntity } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View Request Shortlists Controller
 * 
 * Story #21: As a PIN, I want to view the number of shortlists of my requests 
 * so that I can track interest from CSR Reps.
 */
export class ViewRequestShortlistsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;

      const requests = await RequestEntity.findByPIN(userId, 1, 1000);

      res.json({ requests });
    } catch (error) {
      next(error);
    }
  }
}

