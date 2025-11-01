import { Request, Response, NextFunction } from 'express';
import { UserAccount } from '../../entities/UserAccount.entity';
import { UserStatus } from '@prisma/client';

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
        users = await UserAccount.search(query, page, limit);
        // For simplicity, count all matching users
        const allMatches = await UserAccount.search(query, 1, 9999);
        total = allMatches.length;
      }
      // Filter by user profile name
      else if (userType) {
        users = await UserAccount.findByProfileRole(userType as string, page, limit);
        total = await UserAccount.countByProfileRole(userType as string);
      }
      // Filter by status
      else if (status) {
        users = await UserAccount.findByStatus(status as UserStatus, page, limit);
        total = await UserAccount.countByStatus(status as UserStatus);
      }
      // Get all users
      else {
        users = await UserAccount.findAll(page, limit);
        total = await UserAccount.count();
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

