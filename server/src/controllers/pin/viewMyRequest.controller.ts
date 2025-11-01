import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View My Request Controller (Singular)
 * 
 * Story #16: As a PIN, I want to view my request so that I can monitor its status and progress.
 */
export class ViewMyRequestController {
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

