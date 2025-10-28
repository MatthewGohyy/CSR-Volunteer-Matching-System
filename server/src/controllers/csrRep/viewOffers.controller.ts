import { Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
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

      const user = await UserAccountEntity.findByUserIdWithProfileName(userId, 'CSR Representative');
      if (!user) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      const offers = await VolunteerOfferEntity.findByCSRRep(user.id, 1, 100);

      // Calculate statistics
      const total = offers.length;
      const pending = offers.filter(o => o.status === 'PENDING').length;
      const accepted = offers.filter(o => o.status === 'ACCEPTED').length;
      const declined = offers.filter(o => o.status === 'DECLINED').length;

      res.json({ 
        offers,
        total,
        pending,
        accepted,
        declined
      });
    } catch (error) {
      next(error);
    }
  }
}
