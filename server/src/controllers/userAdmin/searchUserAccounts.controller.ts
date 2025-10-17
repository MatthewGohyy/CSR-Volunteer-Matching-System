import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../repositories/User.repository';
import { UserType, UserStatus } from '@prisma/client';

/**
 * Search User Accounts Controller
 * 
 * Story #7: As a User Admin, I want to search user accounts so that I can find the correct user account.
 * 
 * Architecture: Uses UserRepository to access database instead of direct Prisma calls
 */
export class SearchUserAccountsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRepository = new UserRepository();
      const { query, userType, status } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      let users;
      let total;

      // Search by query string
      if (query && typeof query === 'string') {
        users = await userRepository.search(query, page, limit);
        // For simplicity, count all matching users
        const allMatches = await userRepository.search(query, 1, 9999);
        total = allMatches.length;
      }
      // Filter by user type
      else if (userType) {
        users = await userRepository.findByType(userType as UserType, page, limit);
        total = await userRepository.countByType(userType as UserType);
      }
      // Filter by status
      else if (status) {
        users = await userRepository.findByStatus(status as UserStatus, page, limit);
        total = await userRepository.countByStatus(status as UserStatus);
      }
      // Get all users
      else {
        users = await userRepository.findAll(page, limit);
        total = await userRepository.count();
      }

      res.json({
        users: users.map(user => user.toJSON()),
        total,
        page,
        limit,
      });
    } catch (error) {
      next(error);
    }
  }
}

