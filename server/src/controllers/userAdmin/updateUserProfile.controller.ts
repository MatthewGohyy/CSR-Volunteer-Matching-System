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

      // Check if profile exists
      const existingProfile = await UserProfile.findById(id);
      if (!existingProfile) {
        throw new AppError('Profile not found', 404);
      }

      // If name is being changed, check if new name already exists
      if (name && name !== existingProfile.name) {
        const nameExists = await UserProfile.findByName(name);
        if (nameExists) {
          throw new AppError('Profile with this name already exists', 409);
        }
      }

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

      // Update profile
      const updatedProfile = await UserProfile.update(id, updateData);

      res.json({
        message: 'User profile updated successfully',
        profile: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }
}
