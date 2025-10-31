import { Response, NextFunction } from 'express';
import { Shortlist } from '../../entities/Shortlist.entity';
import { Request } from '../../entities/Request.entity';
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

      await Shortlist.deleteByCSRRepAndRequest(userId, requestId);
      await Request.incrementShortlistCountDB(requestId);

      res.json({ message: 'Request removed from shortlist' });
    } catch (error) {
      next(error);
    }
  }
}
