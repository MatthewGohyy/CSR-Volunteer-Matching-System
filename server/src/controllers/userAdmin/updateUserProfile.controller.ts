import { Request, Response, NextFunction } from 'express';
import { UserProfile } from '../../entities/UserProfile.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Update User Profile Controller
 * 
 * Story #10: As a User Admin, I want to update a user profile so that the latest information is shown.
 * 
 * Updates a role/profile definition (UserProfile entity), not individual user accounts.
 */
export class UpdateUserProfileController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, permissions, isActive } = req.body;

      // Build update data (only include fields that are provided)
      const updateData: Partial<{
        name: string;
        description: string;
        permissions: any;
        isActive: boolean;
      }> = {};
      
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (permissions !== undefined) updateData.permissions = permissions;
      if (isActive !== undefined) updateData.isActive = isActive;

      // Update profile (validation handled in entity)
      const updatedProfile = await UserProfile.update(id, updateData);

      res.json({
        message: 'User profile updated successfully',
        profile: updatedProfile,
      });
    } catch (error: any) {
      // Convert entity errors to AppError
      if (error.message && (error.message.includes('not found') || error.message.includes('already exists'))) {
        const statusCode = error.message.includes('not found') ? 404 : 409;
        next(new AppError(error.message, statusCode));
      } else {
        next(error);
      }
    }
  }
}
