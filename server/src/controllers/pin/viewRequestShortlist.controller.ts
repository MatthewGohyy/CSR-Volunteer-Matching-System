import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View Request Shortlist Controller (Singular)
 * 
 * Story #21: As a PIN, I want to view the number of shortlists of my request 
 * so that I can track interest from CSR Reps.
 */
export class ViewRequestShortlistController {
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

