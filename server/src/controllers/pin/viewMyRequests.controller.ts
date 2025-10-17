import { Request, Response, NextFunction } from 'express';
import { PINRepository } from '../../repositories/PIN.repository';
import { RequestRepository } from '../../repositories/Request.repository';
import { AppError } from '../../middleware/errorHandler';

/**
 * View My Requests Controller
 * 
 * Story #16: As a PIN, I want to view my requests so that I can monitor their status and progress.
 */
export class ViewMyRequestsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pinRepository = new PINRepository();
      const requestRepository = new RequestRepository();
      const userId = (req as any).user!.userId;

      const pin = await pinRepository.findByUserId(userId);
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      const requests = await requestRepository.findByPIN(pin.id, 1, 100);

      res.json({ requests });
    } catch (error) {
      next(error);
    }
  }
}

