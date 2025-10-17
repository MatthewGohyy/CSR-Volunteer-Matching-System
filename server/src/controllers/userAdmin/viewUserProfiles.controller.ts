import { Request, Response, NextFunction } from 'express';
import { UserEntity } from '../../entities/User.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View User Profiles Controller
 * 
 * Story #9: As a User Admin, I want to view user profiles so that I can update the details.
 */
export class ViewUserProfilesController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { userType } = req.query;

      if (id) {
        const user = await UserEntity.findById(id);
        if (!user) {
          throw new AppError('User not found', 404);
        }

        const profile = user.getProfile();
        res.json({ 
          user: user.toJSON(),
          profile 
        });
        return;
      }

      const users = userType 
        ? await UserEntity.findByType(userType as any, 1, 1000)
        : await UserEntity.findAll(1, 1000);

      const profiles = users.map(user => ({
        user: user.toJSON(),
        profile: user.getProfile(),
      }));

      res.json({ profiles });
    } catch (error) {
      next(error);
    }
  }
}

