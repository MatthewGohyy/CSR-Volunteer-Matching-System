import { Response, NextFunction } from 'express';
import { UserProfileRole } from '@prisma/client';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { MatchEntity } from '../../entities/Match.entity';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for viewing CSR Rep's matched requests
 * User Story: View my matched volunteer opportunities
 */
export class ViewMatchesController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      // Get CSR Rep profile

      const user = await UserAccountEntity.findByUserIdWithRole(userId, UserProfileRole.CSR_REP);
      if (!user) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      const matches = await MatchEntity.findByCSRRep(user.id, 1, 100);

      res.json({ matches });
    } catch (error) {
      next(error);
    }
  }
}
