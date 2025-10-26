import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { AppError } from '../../middleware/errorHandler';
import { UserProfileRole } from '@prisma/client';

/**
 * Activate User Profile Controller
 * 
 * Activates a suspended user profile, allowing the user to perform role-specific tasks again.
 */
export class ActivateUserProfileController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Find the user
      const user = await UserAccountEntity.findById(id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Activate profile using the new consolidated method
      await UserAccountEntity.activateProfile(id);

      res.json({
        message: 'User profile activated successfully',
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
