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

      // Check if profile exists
      const profile = await UserProfile.findById(id);
      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      // Check if already active
      if (profile.isActive) {
        throw new AppError('Profile is already active', 400);
      }

      // Activate profile by setting isActive to true
      const updatedProfile = await UserProfile.update(id, { isActive: true });

      res.json({
        message: 'User profile activated successfully. This role is now enabled for all users.',
        profile: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }
}
