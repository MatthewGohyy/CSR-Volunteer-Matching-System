import { Request, Response, NextFunction } from 'express';
import { UserAccount } from '../../entities/UserAccount.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Suspend User Account Controller
 * 
 * Story #6: As a User Admin, I want to suspend a user account so that user cannot log in.
 */
export class SuspendUserAccountController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const existingUser = await UserAccount.findById(id);
      if (!existingUser) {
        throw new AppError('User not found', 404);
      }

      const user = await UserAccount.suspend(id);

      res.json({
        message: 'User account suspended successfully',
        user: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }
}

