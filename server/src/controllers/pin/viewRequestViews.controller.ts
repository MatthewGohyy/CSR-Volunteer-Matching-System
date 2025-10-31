import { Request, Response, NextFunction } from 'express';
import { RequestEntity } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View Request Views Controller
 * 
 * Story #20: As a PIN, I want to view the number of views of my requests 
 * so that I can track engagement and progress.
 */
export class ViewRequestViewsController {
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

