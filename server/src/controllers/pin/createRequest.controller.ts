import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { RequestEntity } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';
import { UrgencyLevel, RequestStatus } from '@prisma/client';

/**
 * Create Request Controller
 * 
 * Story #15: As a PIN, I want to create a request so that I can get matched with a CSR Rep.
 */
export class CreateRequestController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { categoryId, title, description, urgency, dateNeeded, location } = req.body;

      const user = await UserAccountEntity.findByUserIdWithProfileName(userId, 'Person in Need');
      if (!user) {
        throw new AppError('PIN profile not found', 404);
      }

      const request = await RequestEntity.create({
        pinId: user.id, // User account ID is now the PIN ID
        categoryId,
        title,
        description,
        urgency: urgency || UrgencyLevel.MEDIUM,
        dateNeeded: dateNeeded ? new Date(dateNeeded) : undefined,
        location,
        status: RequestStatus.ACTIVE,
      });

      res.status(201).json({
        message: 'Request created successfully',
        request,
      });
    } catch (error) {
      next(error);
    }
  }
}

