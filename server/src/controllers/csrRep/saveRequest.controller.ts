import { Request, Response, NextFunction } from 'express';
import { CSRRepRepository } from '../../repositories/CSRRep.repository';
import { RequestRepository } from '../../repositories/Request.repository';
import { ShortlistRepository } from '../../repositories/Shortlist.repository';
import { AppError } from '../../middleware/errorHandler';

/**
 * Save Request Controller
 * Story #28: As a CSR Rep, I want to save requests (shortlist)
 */
export class SaveRequestController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { requestId } = req.body;

      const csrRepRepository = new CSRRepRepository();
      const requestRepository = new RequestRepository();
      const shortlistRepository = new ShortlistRepository();

      const csrRep = await csrRepRepository.findByUserId(userId);
      if (!csrRep) throw new AppError('CSR Rep profile not found', 404);

      const request = await requestRepository.findById(requestId);
      if (!request) throw new AppError('Request not found', 404);

      const exists = await shortlistRepository.exists(csrRep.id, requestId);
      if (exists) throw new AppError('Request already shortlisted', 409);

      const shortlist = await shortlistRepository.create({
        csrRepId: csrRep.id,
        requestId,
      });

      await requestRepository.incrementShortlistCount(requestId);

      res.status(201).json({ message: 'Request shortlisted successfully', shortlist });
    } catch (error) {
      next(error);
    }
  }
}
