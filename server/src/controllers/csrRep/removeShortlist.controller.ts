import { Response, NextFunction } from 'express';
import { CSRRepEntity } from '../../entities/CSRRep.entity';
import { ShortlistEntity } from '../../entities/Shortlist.entity';
import { RequestEntity } from '../../entities/Request.entity';
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

      const csrRep = await CSRRepEntity.findByUserId(userId);
      if (!csrRep) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      await ShortlistEntity.deleteByCSRRepAndRequest(csrRep.id, requestId);
      await RequestEntity.incrementShortlistCountDB(requestId);

      res.json({ message: 'Request removed from shortlist' });
    } catch (error) {
      next(error);
    }
  }
}
