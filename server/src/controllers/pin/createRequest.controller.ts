import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';
import { UrgencyLevel, RequestStatus } from '@prisma/client';

/**
 * Create Request Controller
 * 
 * Story #15: As a PIN, I want to create a request so that I can get matched with a CSR Rep.
 */
export class CreateRequestController {
  static async handle(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { categoryId, title, description, urgency, dateNeeded, location } = req.body;

      const request = await Request.create({
        pinId: userId, // User account ID is now the PIN ID
        categoryId,
        title,
        description,
        urgency: urgency || UrgencyLevel.MEDIUM,
        dateNeeded: new Date(dateNeeded),
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

