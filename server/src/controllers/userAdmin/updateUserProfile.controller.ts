import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Update User Profile Controller
 * 
 * Story #10: As a User Admin, I want to update a user profile so that the latest information is shown.
 * 
 * With the consolidated structure, updating a profile means updating the user account fields.
 */
export class UpdateUserProfileController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const profileData = req.body;

      const user = await UserAccountEntity.findById(id);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Update user account with profile data
      const updatedUser = await UserAccountEntity.update(id, profileData);

      res.json({
        message: 'Profile updated successfully',
        user: updatedUser.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }
}
