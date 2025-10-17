import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../repositories/User.repository';
import { PINRepository } from '../../repositories/PIN.repository';
import { CSRRepRepository } from '../../repositories/CSRRep.repository';
import { AppError } from '../../middleware/errorHandler';
import { UserType } from '@prisma/client';
import { prisma } from '../../config/database';

/**
 * Create User Profile Controller
 * Story #8: As a User Admin, I want to create user profiles so that new roles can be assigned.
 */
export class CreateUserProfileController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, userType, profileData } = req.body;

      const userRepository = new UserRepository();
      const pinRepository = new PINRepository();
      const csrRepRepository = new CSRRepRepository();

      const user = await userRepository.findById(userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Check if profile already exists
      if (userType === UserType.PIN && user.pin) {
        throw new AppError('PIN profile already exists for this user', 409);
      }
      if (userType === UserType.CSR_REP && user.csrRep) {
        throw new AppError('CSR Rep profile already exists for this user', 409);
      }
      if (userType === UserType.PLATFORM_MANAGER && user.platformManager) {
        throw new AppError('Platform Manager profile already exists for this user', 409);
      }

      let profile;

      switch (userType) {
        case UserType.PIN:
          profile = await prisma.pIN.create({
            data: {
              userId,
              ...profileData,
            },
          });
          break;

        case UserType.CSR_REP:
          profile = await prisma.cSRRep.create({
            data: {
              userId,
              ...profileData,
            },
          });
          break;

        case UserType.PLATFORM_MANAGER:
          profile = await prisma.platformManager.create({
            data: {
              userId,
              ...profileData,
            },
          });
          break;

        default:
          throw new AppError('Invalid user type for profile creation', 400);
      }

      // Update user's userType
      await prisma.user.update({
        where: { id: userId },
        data: { userType },
      });

      res.status(201).json({
        message: 'User profile created successfully',
        profile,
      });
    } catch (error) {
      next(error);
    }
  }
}
