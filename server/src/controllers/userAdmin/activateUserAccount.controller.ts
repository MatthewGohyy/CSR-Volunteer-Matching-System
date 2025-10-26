import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Activate User Account Controller
 * 
 * Activates a suspended user account, allowing the user to login again.
 */
export class ActivateUserAccountController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const existingUser = await UserAccountEntity.findById(id);
      if (!existingUser) {
        throw new AppError('User not found', 404);
      }

      const user = await UserAccountEntity.activate(id);

      res.json({
        message: 'User account activated successfully',
        user: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }
}
