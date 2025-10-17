import { Request, Response, NextFunction } from 'express';
import { UserEntity } from '../../entities/User.entity';
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

      const user = await UserEntity.findById(id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      await UserEntity.delete(id);

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
