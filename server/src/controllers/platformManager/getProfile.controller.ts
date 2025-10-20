import { Response, NextFunction } from 'express';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../config/database';

/**
 * Get Platform Manager Profile Controller
 * 
 * Utility: Get current Platform Manager's profile (not part of user stories)
 */
export class GetProfileController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      const platformManager = await prisma.platformManager.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              email: true,
              status: true,
              createdAt: true,
            },
          },
        },
      });

      if (!platformManager) {
        throw new AppError('Platform Manager profile not found', 404);
      }

      res.json({ profile: platformManager });
    } catch (error) {
      next(error);
    }
  }
}
