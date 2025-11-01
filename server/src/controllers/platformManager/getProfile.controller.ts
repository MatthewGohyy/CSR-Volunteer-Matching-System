import { Response, NextFunction } from 'express';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';
import { UserAccount } from '../../entities/UserAccount.entity';

/**
 * Get Platform Manager Profile Controller
 * 
 * Utility: Get current Platform Manager's profile (not part of user stories)
 */
export class GetProfileController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      const user = await UserAccount.findByUserIdWithProfileName(userId, 'Platform Manager');
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
