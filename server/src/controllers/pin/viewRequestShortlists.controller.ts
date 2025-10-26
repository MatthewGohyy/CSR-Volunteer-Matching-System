import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { UserProfileRole } from '@prisma/client';
import { RequestEntity } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View Request Shortlists Controller
 * 
 * Story #21: As a PIN, I want to view the number of shortlists of my requests 
 * so that I can track interest from CSR Reps.
 */
export class ViewRequestShortlistsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;


      const user = await UserAccountEntity.findByUserIdWithRole(userId, UserProfileRole.PIN);
      if (!user) {
        throw new AppError('PIN profile not found', 404);
      }

      const requests = await RequestEntity.findByPIN(user.id, 1, 1000);

      res.json({ requests });
    } catch (error) {
      next(error);
    }
  }
}

