import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../repositories/User.repository';
import { UserType } from '@prisma/client';

/**
 * Search User Profiles Controller
 * 
 * Story #12: As a User Admin, I want to search user profiles 
 * so that I can find the correct user profile.
 */
export class SearchUserProfilesController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRepository = new UserRepository();
      const { query, userType } = req.query;

      let users;
      if (query && typeof query === 'string') {
        users = await userRepository.search(query, 1, 1000);
      } else if (userType) {
        users = await userRepository.findByType(userType as UserType, 1, 1000);
      } else {
        users = await userRepository.findAll(1, 1000);
      }

      const profiles = users.map(user => ({
        user: user.toJSON(),
        profile: user.getProfile(),
      }));

      res.json({ profiles, total: profiles.length });
    } catch (error) {
      next(error);
    }
  }
}

