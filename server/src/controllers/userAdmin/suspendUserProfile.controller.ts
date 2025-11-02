import { Request, Response, NextFunction } from 'express';
import { UserProfile } from '../../entities/UserProfile.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Suspend User Profile Controller
 * 
 * Story #11: As a User Admin, I want to suspend a user profile 
 * so that the associated role or permissions are temporarily disabled.
 * 
 * Suspends the UserProfile entity (role definition), which disables this role
 * for all users who have this profile assigned. Users with suspended profiles
 * cannot perform role-specific tasks but can still login.
 */
export class SuspendUserProfileController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Check if profile exists
      const profile = await UserProfile.findById(id);
      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      // Check if already suspended
      if (!profile.isActive) {
        throw new AppError('Profile is already suspended', 400);
      }

      // Suspend profile by setting isActive to false
      const updatedProfile = await UserProfile.update(id, { isActive: false });

      res.json({
        message: 'User profile suspended successfully. This role is now disabled for all users.',
        profile: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }
}
