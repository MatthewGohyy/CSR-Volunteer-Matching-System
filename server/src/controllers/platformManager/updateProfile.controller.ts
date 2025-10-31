import { Response, NextFunction } from 'express';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';
import { UserAccount } from '../../entities/UserAccount.entity';

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

      const updateData: any = {};
      if (fullName) updateData.name = fullName;
      if (department) updateData.department = department;
      if (phone) updateData.phoneNumber = phone;

      const updated = await UserAccount.updatePlatformManagerProfile(userId, updateData);

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
