import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Shortlist } from '../../entities/Shortlist.entity';
import { Request } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';
import { RequestStatus } from '@prisma/client';

/**
 * Save Request Controller
 * Story #28: As a CSR Rep, I want to save requests (shortlist)
 */
export class SaveRequestController {
  static async handle(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { requestId } = req.body;

      // Check if request exists and is still ACTIVE
      const request = await Request.findById(requestId);
      if (!request) {
        throw new AppError('Request not found', 404);
      }

      // Can only shortlist ACTIVE requests
      if (request.status !== RequestStatus.ACTIVE) {
        throw new AppError('Can only shortlist active requests', 400);
      }

      const shortlist = await Shortlist.create({
        csrRepId: userId,
        requestId,
      });

      res.status(201).json({ message: 'Request shortlisted successfully', shortlist });
    } catch (error) {
      next(error);
    }
  }
}
