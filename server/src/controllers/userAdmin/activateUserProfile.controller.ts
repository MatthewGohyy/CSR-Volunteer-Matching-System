import { Request, Response, NextFunction } from 'express';
import { UserProfile } from '../../entities/UserProfile.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Activate User Profile Controller
 * 
 * Activates a suspended user profile (role definition), allowing all users with this profile
 * to perform role-specific tasks again.
 */
export class ActivateUserProfileController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Activate profile by setting isActive to true (existence check handled in update)
      const updatedProfile = await UserProfile.update(id, { isActive: true });

      res.json({
        message: 'User profile activated successfully. This role is now enabled for all users.',
        profile: updatedProfile,
      });
    } catch (error: any) {
      // Convert entity errors to AppError
      if (error.message && error.message.includes('not found')) {
        next(new AppError(error.message, 404));
      } else {
        next(error);
      }
    }
  }
}
