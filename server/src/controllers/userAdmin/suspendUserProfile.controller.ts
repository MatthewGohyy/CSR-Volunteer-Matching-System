import { Request, Response, NextFunction } from 'express';
import { UserEntity } from '../../entities/User.entity';
import { PINEntity } from '../../entities/PIN.entity';
import { CSRRepEntity } from '../../entities/CSRRep.entity';
import { PlatformManagerEntity } from '../../entities/PlatformManager.entity';
import { AppError } from '../../middleware/errorHandler';
import { UserType } from '@prisma/client';

/**
 * Suspend User Profile Controller
 * 
 * Story #11: As a User Admin, I want to suspend a user profile 
 * so that the associated role or permissions are temporarily disabled.
 * 
 * NOTE: This suspends the USER PROFILE (PIN, CSRRep, or PlatformManager),
 * NOT the user account. A suspended profile means the user can still login
 * but cannot perform role-specific tasks.
 */
export class SuspendUserProfileController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Find the user to determine their type
      const user = await UserEntity.findById(id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      let suspendedProfile;

      // Suspend the appropriate profile based on user type
      switch (user.userType) {
        case UserType.PIN:
          if (!user.pin) {
            throw new AppError('PIN profile not found', 404);
          }
          suspendedProfile = await PINEntity.suspendByUserId(id);
          break;

        case UserType.CSR_REP:
          if (!user.csrRep) {
            throw new AppError('CSR Rep profile not found', 404);
          }
          suspendedProfile = await CSRRepEntity.suspendByUserId(id);
          break;

        case UserType.PLATFORM_MANAGER:
          if (!user.platformManager) {
            throw new AppError('Platform Manager profile not found', 404);
          }
          suspendedProfile = await PlatformManagerEntity.suspendByUserId(id);
          break;

        case UserType.ADMIN:
          throw new AppError('Cannot suspend admin profile', 400);

        default:
          throw new AppError('Invalid user type', 400);
      }

      res.json({
        message: 'User profile suspended successfully. User can still login but cannot perform role-specific tasks.',
        user: {
          id: user.id,
          email: user.email,
          userType: user.userType,
          status: user.status, // Account status remains unchanged
        },
        profile: suspendedProfile,
      });
    } catch (error) {
      next(error);
    }
  }
}

