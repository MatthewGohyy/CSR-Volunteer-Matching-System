import { Request, Response, NextFunction } from 'express';
import { PINRepository } from '../../repositories/PIN.repository';
import { RequestRepository } from '../../repositories/Request.repository';
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

      const pinRepository = new PINRepository();
      const requestRepository = new RequestRepository();

      const pin = await pinRepository.findByUserId(userId);
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      const requests = await requestRepository.findByPIN(pin.id, 1, 1000);

      res.json({ requests });
    } catch (error) {
      next(error);
    }
  }
}

