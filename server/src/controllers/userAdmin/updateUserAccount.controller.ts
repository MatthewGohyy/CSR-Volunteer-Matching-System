import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
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

      // Check if user exists
      const existingUser = await UserAccountEntity.findById(id);
      if (!existingUser) {
        throw new AppError('User not found', 404);
      }

      // Check if email is being changed and if it already exists
      if (email && email !== existingUser.email) {
        const emailExists = await UserAccountEntity.findByEmail(email);
        if (emailExists) {
          throw new AppError('Email already in use', 409);
        }
      }

      // Update user
      const updateData: any = {};
      if (email) updateData.email = email;
      if (status) updateData.status = status;
      
      const user = await UserAccountEntity.update(id, updateData);

      res.json({
        message: 'User account updated successfully',
        user: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }
}

