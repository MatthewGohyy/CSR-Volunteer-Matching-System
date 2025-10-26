import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { UserProfileRole, UserStatus } from '@prisma/client';

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
        users = await UserAccountEntity.search(query, page, limit);
        // For simplicity, count all matching users
        const allMatches = await UserAccountEntity.search(query, 1, 9999);
        total = allMatches.length;
      }
      // Filter by user role
      else if (userType) {
        users = await UserAccountEntity.findByProfileRole(userType as UserProfileRole, page, limit);
        total = await UserAccountEntity.countByProfileRole(userType as UserProfileRole);
      }
      // Filter by status
      else if (status) {
        users = await UserAccountEntity.findByStatus(status as UserStatus, page, limit);
        total = await UserAccountEntity.countByStatus(status as UserStatus);
      }
      // Get all users
      else {
        users = await UserAccountEntity.findAll(page, limit);
        total = await UserAccountEntity.count();
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

