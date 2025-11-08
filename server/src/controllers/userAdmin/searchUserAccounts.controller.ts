import { Request, Response, NextFunction } from 'express';
import { UserAccount } from '../../entities/UserAccount.entity';

/**
 * Search User Accounts Controller
 * 
 * Story #7: As a User Admin, I want to search user accounts so that I can find the correct user account.
 * 
 * Handles listing/searching user accounts:
 * - No query: returns all user accounts
 * - With query: returns filtered user accounts (by email, name, or company name)
 * 
 * Architecture: BCE framework - Uses UserAccount entity to access database instead of direct Prisma calls
 */
export class SearchUserAccountsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query } = req.query;

      // Extract and normalize query parameter
      const searchQuery = typeof query === 'string' && query.trim() ? query.trim() : null;

      // Use UserAccount.search() - handles both search and return all (when query is null)
      const users = await UserAccount.search(searchQuery);

      res.json({
        users: users.map(user => user.toJSON()),
        total: users.length,
      });
    } catch (error) {
      next(error);
    }
  }
}

