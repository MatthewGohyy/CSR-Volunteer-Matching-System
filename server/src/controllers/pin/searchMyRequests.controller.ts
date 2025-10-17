import { Request, Response, NextFunction } from 'express';
import { PINRepository } from '../../repositories/PIN.repository';
import { RequestRepository } from '../../repositories/Request.repository';
import { AppError } from '../../middleware/errorHandler';
import { RequestStatus, UrgencyLevel } from '@prisma/client';
import { prisma } from '../../config/database';

/**
 * Search My Requests Controller
 * 
 * Story #19: As a PIN, I want to search my request so that I can quickly find a specific one.
 */
export class SearchMyRequestsController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pinRepository = new PINRepository();
      const requestRepository = new RequestRepository();
      const userId = (req as any).user!.userId;
      const { query, status, urgency } = req.query;

      const pin = await pinRepository.findByUserId(userId);
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      let requests;
      if (status) {
        requests = await requestRepository.findByStatus(status as RequestStatus, 1, 100);
        requests = requests.filter(r => r.pinId === pin.id);
      } else if (urgency) {
        requests = await requestRepository.findByUrgency(urgency as UrgencyLevel, 1, 100);
        requests = requests.filter(r => r.pinId === pin.id);
      } else {
        requests = await requestRepository.findByPIN(pin.id, 1, 100);
      }

      if (query && typeof query === 'string') {
        const lowerQuery = query.toLowerCase();
        requests = requests.filter(r => 
          r.title.toLowerCase().includes(lowerQuery) ||
          r.description.toLowerCase().includes(lowerQuery)
        );
      }

      res.json({ requests, total: requests.length });
    } catch (error) {
      next(error);
    }
  }
}

