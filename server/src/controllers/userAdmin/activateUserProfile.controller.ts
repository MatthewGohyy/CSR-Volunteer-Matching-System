import { Request, Response, NextFunction } from 'express';
import { UserEntity } from '../../entities/User.entity';
import { PINEntity } from '../../entities/PIN.entity';
import { CSRRepEntity } from '../../entities/CSRRep.entity';
import { PlatformManagerEntity } from '../../entities/PlatformManager.entity';
import { AppError } from '../../middleware/errorHandler';
import { UserType } from '@prisma/client';

/**
 * Activate User Profile Controller
 * 
 * Activates a suspended user profile, allowing the user to perform role-specific tasks again.
 */
export class ActivateUserProfileController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Find the user to determine their type
      const user = await UserEntity.findById(id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      let activatedProfile;

      // Activate the appropriate profile based on user type
      switch (user.userType) {
        case UserType.PIN:
          if (!user.pin) {
            throw new AppError('PIN profile not found', 404);
          }
          activatedProfile = await PINEntity.activateByUserId(id);
          break;

        case UserType.CSR_REP:
          if (!user.csrRep) {
            throw new AppError('CSR Rep profile not found', 404);
          }
          activatedProfile = await CSRRepEntity.activateByUserId(id);
          break;

        case UserType.PLATFORM_MANAGER:
          if (!user.platformManager) {
            throw new AppError('Platform Manager profile not found', 404);
          }
          activatedProfile = await PlatformManagerEntity.activateByUserId(id);
          break;

        case UserType.ADMIN:
          throw new AppError('Cannot activate admin profile', 400);

        default:
          throw new AppError('Invalid user type', 400);
      }

      res.json({
        message: 'User profile activated successfully. User can now perform role-specific tasks.',
        user: {
          id: user.id,
          email: user.email,
          userType: user.userType,
          status: user.status,
        },
        profile: activatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }
}

