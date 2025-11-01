import { Response, NextFunction } from 'express';
import { Match } from '../../entities/Match.entity';
import { AuthRequest } from '../../middleware/auth';

/**
 * View Match Controller (Singular)
 * 
 * Returns a single match by ID for modal/detail view.
 * Used when user clicks on a match to see full details.
 */
export class ViewMatchController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const match = await Match.findById(id);
      res.json({ match });
    } catch (error) {
      next(error);
    }
  }
}

