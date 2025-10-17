import { Response, NextFunction } from 'express';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../config/database';

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
      const platformManager = await prisma.platformManager.findUnique({ where: { userId } });
      if (!platformManager) {
        throw new AppError('Platform Manager profile not found', 404);
      }

      // Update profile
      const updated = await prisma.platformManager.update({
        where: { id: platformManager.id },
        data: {
          ...(fullName && { fullName }),
          ...(department && { department }),
          ...(phone && { phone }),
        },
      });

      res.json({
        message: 'Profile updated successfully',
        profile: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
