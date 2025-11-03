import { Request, Response, NextFunction } from 'express';
import { UserProfile } from '../../entities/UserProfile.entity';
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

      // Create new profile (validation handled in entity)
      const profile = await UserProfile.create({
        name,
        description,
        isActive: isActive !== undefined ? isActive : true,
        permissions,
      });

      res.status(201).json({
        message: 'User profile created successfully',
        profile: profile,
      });
    } catch (error: any) {
      // Convert entity errors to AppError
      if (error.message && error.message.includes('already exists')) {
        next(new AppError(error.message, 409));
      } else {
        next(error);
      }
    }
  }
}
