import { Response, NextFunction } from 'express';
import { CSRRepEntity } from '../../entities/CSRRep.entity';
import { VolunteerOfferEntity } from '../../entities/VolunteerOffer.entity';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for viewing CSR Rep's submitted volunteer offers
 * User Story: View my submitted volunteer offers
 */
export class ViewOffersController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      // Get CSR Rep profile

      const csrRep = await CSRRepEntity.findByUserId(userId);
      if (!csrRep) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      const offers = await VolunteerOfferEntity.findByCSRRep(csrRep.id, 1, 100);

      res.json({ offers });
    } catch (error) {
      next(error);
    }
  }
}
