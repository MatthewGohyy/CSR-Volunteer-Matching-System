import { Request, Response, NextFunction } from 'express';
import { Shortlist } from '../../entities/Shortlist.entity';

/**
 * View Shortlist Controller (Singular)
 * 
 * Returns a single shortlist item by ID for modal/detail view.
 * Used when user clicks on a shortlist item to see full details.
 */
export class ViewShortlistController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const shortlist = await Shortlist.findById(id);
      res.json({ shortlist });
    } catch (error) {
      next(error);
    }
  }
}
