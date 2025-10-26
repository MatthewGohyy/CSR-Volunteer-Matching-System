import { Request, Response, NextFunction } from 'express';
import { UserProfileEntity } from '../../entities/UserProfile.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Create User Profile Controller
 * Story #8: As a User Admin, I want to create user profiles so that new roles can be assigned.
 * 
 * Creates a new role/profile definition in the system.
 */
export class CreateUserProfileController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description, isActive, permissions } = req.body;

      // Check if profile with this name already exists
      const existingProfile = await UserProfileEntity.findByName(name);
      if (existingProfile) {
        throw new AppError('Profile with this name already exists', 409);
      }

      // Create new profile
      const profile = await UserProfileEntity.create({
        name,
        description,
        isActive: isActive !== undefined ? isActive : true,
        permissions,
      });

      res.status(201).json({
        message: 'User profile created successfully',
        profile: profile,
      });
    } catch (error) {
      next(error);
    }
  }
}
