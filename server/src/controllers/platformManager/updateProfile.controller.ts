import { Response, NextFunction } from 'express';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { UserProfileRole } from '@prisma/client';

/**
 * Update Platform Manager Profile Controller
 * 
 * Utility: Update current Platform Manager's profile (not part of user stories)
 */
export class UpdateProfileController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { fullName, department, phone } = req.body;

      // Get Platform Manager profile
      const user = await UserAccountEntity.findByUserIdWithRole(userId, UserProfileRole.PLATFORM_MANAGER);
      if (!user) {
        throw new AppError('Platform Manager profile not found', 404);
      }

      const updateData: any = {};
      if (fullName) updateData.name = fullName;
      if (department) updateData.department = department;
      if (phone) updateData.phoneNumber = phone;

      const updated = await UserAccountEntity.updatePlatformManagerProfile(userId, updateData);

      res.json({
        message: 'Profile updated successfully',
        profile: {
          id: updated.id,
          name: updated.name,
          department: updated.department,
          phoneNumber: updated.phoneNumber,
          status: updated.profileStatus,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
