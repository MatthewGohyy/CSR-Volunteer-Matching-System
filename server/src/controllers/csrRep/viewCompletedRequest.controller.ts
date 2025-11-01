import { Request, Response, NextFunction } from 'express';
import { Match } from '../../entities/Match.entity';

/**
 * View Completed Request Controller (Singular)
 * 
 * Returns a single completed match by ID for modal/detail view.
 * Used when user clicks on a completed match to see full details.
 */
export class ViewCompletedRequestController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const match = await Match.findById(id);
      res.json({ match });
    } catch (error) {
      next(error);
    }
  }
}

