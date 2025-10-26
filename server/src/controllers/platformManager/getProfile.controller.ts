import { Response, NextFunction } from 'express';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { UserProfileRole } from '@prisma/client';

/**
 * Get Platform Manager Profile Controller
 * 
 * Utility: Get current Platform Manager's profile (not part of user stories)
 */
export class GetProfileController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      const user = await UserAccountEntity.findByUserIdWithRole(userId, UserProfileRole.PLATFORM_MANAGER);
      if (!user) {
        throw new AppError('Platform Manager profile not found', 404);
      }

      res.json({ 
        profile: {
          id: user.id,
          name: user.name,
          department: user.department,
          phoneNumber: user.phoneNumber,
          email: user.email,
          status: user.status,
          profileStatus: user.profileStatus,
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
