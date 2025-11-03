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

      // Suspend user (existence check handled in update method)
      const user = await UserAccount.suspend(id);

      res.json({
        message: 'User account suspended successfully',
        user: user.toJSON(),
      });
    } catch (error: any) {
      // Convert entity errors to AppError
      if (error.message && error.message.includes('not found')) {
        next(new AppError(error.message, 404));
      } else {
        next(error);
      }
    }
  }
}

