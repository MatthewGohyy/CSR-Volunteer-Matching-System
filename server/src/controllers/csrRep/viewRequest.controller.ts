import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request } from '../../entities/Request.entity';

/**
 * View Request Controller (Singular)
 * 
 * Returns a single request by ID for modal/detail view.
 * Used when user clicks on a request card to see full details.
 */
export class ViewRequestController {
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

