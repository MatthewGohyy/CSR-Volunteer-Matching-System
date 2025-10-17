import { Response, NextFunction } from 'express';
import { PINRepository } from '../../repositories/PIN.repository';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for viewing PIN profile
 * User Story: View my PIN profile information
 */
export class GetProfileController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const pinRepository = new PINRepository();
      const userId = req.user!.userId;

      const pin = await pinRepository.findByUserId(userId);

      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      res.json({ profile: pin });
    } catch (error) {
      next(error);
    }
  }
}
