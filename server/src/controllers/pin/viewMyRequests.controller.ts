import { Request, Response, NextFunction } from 'express';
import { PINEntity } from '../../entities/PIN.entity';
import { RequestEntity } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * View My Requests Controller
 * 
 * Story #16: As a PIN, I want to view my requests so that I can monitor their status and progress.
 */
export class ViewMyRequestsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;

      const pin = await PINEntity.findByUserId(userId);
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      const requests = await RequestEntity.findByPIN(pin.id, 1, 100);

      res.json({ requests });
    } catch (error) {
      next(error);
    }
  }
}

