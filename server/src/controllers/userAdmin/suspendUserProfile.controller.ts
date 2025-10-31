import { Request, Response, NextFunction } from 'express';
import { UserAccount } from '../../entities/UserAccount.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Suspend User Profile Controller
 * 
 * Story #11: As a User Admin, I want to suspend a user profile 
 * so that the associated role or permissions are temporarily disabled.
 * 
 * NOTE: This suspends the USER PROFILE,
 * NOT the user account. A suspended profile means the user can still login
 * but cannot perform role-specific tasks.
 */
export class SuspendUserProfileController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Find the user
      const user = await UserAccount.findById(id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Suspend profile using the new consolidated method
      await UserAccount.suspendProfile(id);

      res.json({
        message: 'User profile suspended successfully. User can still login but cannot perform role-specific tasks.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.getRole(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
