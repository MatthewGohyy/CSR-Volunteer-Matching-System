import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { AppError } from '../../middleware/errorHandler';
import { UserProfileRole } from '@prisma/client';

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
        const user = await UserAccountEntity.findById(id);
        if (!user) {
          throw new AppError('User not found', 404);
        }

        res.json({ 
          user: user.toJSON(),
          role: user.getRole(),
        });
        return;
      }

      const users = userType 
        ? await UserAccountEntity.findByProfileRole(userType as UserProfileRole, 1, 1000)
        : await UserAccountEntity.findAll(1, 1000);

      const profiles = users.map((user: UserAccountEntity) => ({
        user: user.toJSON(),
        role: user.getRole(),
      }));

      res.json({ profiles });
    } catch (error) {
      next(error);
    }
  }
}
