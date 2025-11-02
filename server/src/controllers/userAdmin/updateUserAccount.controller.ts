import { Request, Response, NextFunction } from 'express';
import { UserAccount } from '../../entities/UserAccount.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Update User Account Controller
 * 
 * Story #5: As a User Admin, I want to update a user account so that the latest information is shown.
 */
export class UpdateUserAccountController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { email, status } = req.body;

      // Update user (validation handled in entity)
      const updateData: any = {};
      if (email) updateData.email = email;
      if (status) updateData.status = status;
      
      const user = await UserAccount.update(id, updateData);

      res.json({
        message: 'User account updated successfully',
        user: user.toJSON(),
      });
    } catch (error: any) {
      // Convert entity errors to AppError
      if (error.message && (error.message.includes('not found') || error.message.includes('already'))) {
        const statusCode = error.message.includes('not found') ? 404 : 409;
        next(new AppError(error.message, statusCode));
      } else {
        next(error);
      }
    }
  }
}

