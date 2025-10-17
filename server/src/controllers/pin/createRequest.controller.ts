import { Request, Response, NextFunction } from 'express';
import { PINEntity } from '../../entities/PIN.entity';
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

      const pin = await PINEntity.findByUserId(userId);
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      const request = await RequestEntity.create({
        pinId: pin.id,
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

