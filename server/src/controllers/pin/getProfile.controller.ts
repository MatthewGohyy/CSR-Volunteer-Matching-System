import { Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { UserProfileRole } from '@prisma/client';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for viewing PIN profile
 * User Story: View my PIN profile information
 */
export class GetProfileController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      const user = await UserAccountEntity.findByUserIdWithRole(userId, UserProfileRole.PIN);

      if (!user) {
        throw new AppError('PIN profile not found', 404);
      }

      res.json({ 
        profile: {
          id: user.id,
          name: user.name,
          age: user.age,
          location: user.location,
          phoneNumber: user.phoneNumber,
          accessibilityNeeds: user.accessibilityNeeds,
          profilePhoto: user.profilePhoto,
          status: user.profileStatus,
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
