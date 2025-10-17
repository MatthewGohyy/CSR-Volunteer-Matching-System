import { Request, Response, NextFunction } from 'express';
import { PINEntity } from '../../entities/PIN.entity';
import { RequestEntity } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';
import { RequestStatus } from '@prisma/client';

/**
 * View Completed Requests Controller
 * 
 * Story #23: As a PIN, I want to view the history of previously completed requests 
 * so that I can review past help I've received.
 */
export class ViewCompletedRequestsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { page = '1', limit = '10' } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Get PIN profile

      const pin = await PINEntity.findByUserId(userId);
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      const completed = await RequestEntity.findByStatus(RequestStatus.COMPLETED, pageNum, limitNum);
      const matched = await RequestEntity.findByStatus(RequestStatus.MATCHED, pageNum, limitNum);
      const requests = [...completed, ...matched].filter(r => r.pinId === pin.id);
      const total = await RequestEntity.countByPIN(pin.id);

      res.json({
        requests,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

