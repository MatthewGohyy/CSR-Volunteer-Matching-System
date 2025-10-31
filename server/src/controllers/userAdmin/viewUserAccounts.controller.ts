import { Request, Response, NextFunction } from 'express';
import { UserAccount } from '../../entities/UserAccount.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View User Accounts Controller
 * 
 * Story #4: As a User Admin, I want to view user accounts so that I can update the details.
 * 
 * Architecture: BCE framework - Uses UserEntity to access database instead of direct Prisma calls
 */
export class ViewUserAccountsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { id } = req.params;

      // If ID is provided, get single user
      if (id) {
        const user = await UserAccount.findById(id);

        if (!user) {
          throw new AppError('User not found', 404);
        }

        res.json({ user: user.toJSON() });
        return;
      }

      // Otherwise get all users with pagination
      const [users, total] = await Promise.all([
        UserAccount.findAll(page, limit),
        UserAccount.count(),
      ]);

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

