import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Delete User Account Controller
 * 
 * Utility: Delete a user account (not part of user stories, administrative utility)
 */
export class DeleteUserAccountController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const user = await UserAccountEntity.findById(id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      await UserAccountEntity.delete(id);

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
