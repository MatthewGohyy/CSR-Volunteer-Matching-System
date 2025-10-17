import { Request, Response, NextFunction } from 'express';
import { UserEntity } from '../../entities/User.entity';
import { hashPassword, comparePassword } from '../../utils/password';
import { AppError } from '../../middleware/errorHandler';

/**
 * Controller for updating user password
 * User Story: Update my account password
 */
export class UpdatePasswordController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { currentPassword, newPassword } = req.body;


      const user = await UserEntity.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const isPasswordValid = await comparePassword(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 401);
      }

      const hashedPassword = await hashPassword(newPassword);

      await UserEntity.update(userId, { password: hashedPassword });

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  }
}
