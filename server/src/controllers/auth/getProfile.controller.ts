import { Request, Response, NextFunction } from 'express';
import { UserAccount } from '../../entities/UserAccount.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Controller for getting current authenticated user's profile
 * User Story: View my account profile
 * 
 * Architecture: BCE framework - Uses UserAccount for database access
 */
export class GetProfileController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;

      const user = await UserAccount.findById(userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({
        user: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }
}
