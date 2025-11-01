import { Request, Response, NextFunction } from 'express';
import { UserProfile } from '../../entities/UserProfile.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View User Profile Controller (Singular)
 * 
 * Story #9: As a User Admin, I want to view user profiles so that I can update the details.
 * 
 * Follows BCE pattern - all database operations through entity class
 * Returns details of a single user profile by ID
 * 
 * Note: This endpoint returns UserProfile entities (role definitions), not individual user accounts.
 */
export class ViewUserProfileController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const profile = await UserProfile.findById(id);
      
      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      res.json({ profile });
    } catch (error) {
      next(error);
    }
  }
}
