import { Request, Response, NextFunction } from 'express';
import { UserProfile } from '../../entities/UserProfile.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View User Profiles Controller
 * 
 * Story #9: As a User Admin, I want to view user profiles so that I can update the details.
 * 
 * Note: This endpoint returns UserProfile entities (role definitions), not individual user accounts.
 */
export class ViewUserProfilesController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (id) {
        const profile = await UserProfile.findById(id);
        if (!profile) {
          throw new AppError('Profile not found', 404);
        }

        res.json({ profile });
        return;
      }

      // Get all role profile definitions
      const profiles = await UserProfile.findAll();

      res.json({ profiles });
    } catch (error) {
      next(error);
    }
  }
}
