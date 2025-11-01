import { Response, NextFunction } from 'express';
import { VolunteerOffer } from '../../entities/VolunteerOffer.entity';
import { AuthRequest } from '../../middleware/auth';

/**
 * View Offer Controller (Singular)
 * 
 * Returns a single offer by ID for modal/detail view.
 * Used when user clicks on an offer to see full details.
 */
export class ViewOfferController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const offer = await VolunteerOffer.findById(id);
      res.json({ offer });
    } catch (error) {
      next(error);
    }
  }
}

