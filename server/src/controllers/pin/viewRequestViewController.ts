import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View Request View Controller (Singular)
 * 
 * Story #20: As a PIN, I want to view the number of views of my request 
 * so that I can track engagement and progress.
 */
export class ViewRequestViewController {
  static async handle(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const request = await Request.findById(id);
      res.json({ request });
    } catch (error) {
      next(error);
    }
  }
}

