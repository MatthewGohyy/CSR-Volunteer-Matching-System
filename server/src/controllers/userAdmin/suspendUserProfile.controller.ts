import { Request, Response, NextFunction } from 'express';
import { UserEntity } from '../../entities/User.entity';
import { AppError } from '../../middleware/errorHandler';
import { UserStatus } from '@prisma/client';

/**
 * Suspend User Profile Controller
 * 
 * Story #11: As a User Admin, I want to suspend a user profile 
 * so that the associated role or permissions are temporarily disabled.
 */
export class SuspendUserProfileController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;


      const user = await UserEntity.suspend(id);

      res.json({
        message: 'User profile suspended successfully',
        user: {
          id: user.id,
          email: user.email,
          userType: user.userType,
          status: user.status,
        },
        profile: user.pin || user.csrRep || user.platformManager,
      });
    } catch (error) {
      next(error);
    }
  }
}

