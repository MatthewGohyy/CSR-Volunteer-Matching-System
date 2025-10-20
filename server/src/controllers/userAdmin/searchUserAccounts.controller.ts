import { Request, Response, NextFunction } from 'express';
import { UserEntity } from '../../entities/User.entity';
import { UserType, UserStatus } from '@prisma/client';

/**
 * Search User Accounts Controller
 * 
 * Story #7: As a User Admin, I want to search user accounts so that I can find the correct user account.
 * 
 * Architecture: BCE framework - Uses UserEntity to access database instead of direct Prisma calls
 */
export class SearchUserAccountsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query, userType, status } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      let users;
      let total;

      // Search by query string
      if (query && typeof query === 'string') {
        users = await UserEntity.search(query, page, limit);
        // For simplicity, count all matching users
        const allMatches = await UserEntity.search(query, 1, 9999);
        total = allMatches.length;
      }
      // Filter by user type
      else if (userType) {
        users = await UserEntity.findByType(userType as UserType, page, limit);
        total = await UserEntity.countByType(userType as UserType);
      }
      // Filter by status
      else if (status) {
        users = await UserEntity.findByStatus(status as UserStatus, page, limit);
        total = await UserEntity.countByStatus(status as UserStatus);
      }
      // Get all users
      else {
        users = await UserEntity.findAll(page, limit);
        total = await UserEntity.count();
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

