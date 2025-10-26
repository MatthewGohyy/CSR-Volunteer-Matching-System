import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';

/**
 * Search User Profiles Controller
 * 
 * Story #12: As a User Admin, I want to search user profiles 
 * so that I can find the correct user profile.
 */
export class SearchUserProfilesController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query, userType } = req.query;

      let users;
      if (query && typeof query === 'string') {
        users = await UserAccountEntity.search(query, 1, 1000);
      } else if (userType) {
        users = await UserAccountEntity.findByProfileRole(userType as string, 1, 1000);
      } else {
        users = await UserAccountEntity.findAll(1, 1000);
      }

      const profiles = users.map((user: UserAccountEntity) => ({
        user: user.toJSON(),
        role: user.getRole(),
      }));

      res.json({ profiles, total: profiles.length });
    } catch (error) {
      next(error);
    }
  }
}
