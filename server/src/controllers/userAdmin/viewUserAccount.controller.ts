import { Request, Response, NextFunction } from 'express';
import { UserAccount } from '../../entities/UserAccount.entity';

/**
 * View User Account Controller (Singular)
 * 
 * Story #4: As a User Admin, I want to view user accounts so that I can update the details.
 * 
 * Follows BCE pattern - all database operations through entity class
 * Returns details of a single user account by ID
 */
export class ViewUserAccountController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const user = await UserAccount.findById(id);

      res.json({ user: user?.toJSON() || null });
    } catch (error) {
      next(error);
    }
  }
}

