import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { AppError } from '../../middleware/errorHandler';
import { UserProfileRole } from '@prisma/client';

/**
 * Create User Profile Controller
 * Story #8: As a User Admin, I want to create user profiles so that new roles can be assigned.
 * 
 * NOTE: With the new consolidated structure, profiles are created as part of user accounts.
 * This endpoint now updates existing user accounts with profile data.
 */
export class CreateUserProfileController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, profileData } = req.body;

      const user = await UserAccountEntity.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Update user with profile data
      const updatedUser = await UserAccountEntity.update(userId, profileData);

      res.status(201).json({
        message: 'User profile updated successfully',
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          role: updatedUser.getRole(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
