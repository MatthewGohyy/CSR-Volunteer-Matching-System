import { Response, NextFunction } from 'express';
import { CSRRepRepository } from '../../repositories/CSRRep.repository';
import { ShortlistRepository } from '../../repositories/Shortlist.repository';
import { RequestRepository } from '../../repositories/Request.repository';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for removing a request from CSR Rep's shortlist
 * User Story: Remove saved/shortlisted requests
 */
export class RemoveShortlistController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { requestId } = req.params;

      // Get CSR Rep profile
      const csrRepRepository = new CSRRepRepository();
      const shortlistRepository = new ShortlistRepository();
      const requestRepository = new RequestRepository();

      const csrRep = await csrRepRepository.findByUserId(userId);
      if (!csrRep) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      await shortlistRepository.deleteByCSRRepAndRequest(csrRep.id, requestId);
      await requestRepository.incrementShortlistCount(requestId);

      res.json({ message: 'Request removed from shortlist' });
    } catch (error) {
      next(error);
    }
  }
}
