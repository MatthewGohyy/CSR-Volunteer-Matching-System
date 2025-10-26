import { Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
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
      const user = await UserAccountEntity.findByUserIdWithProfileName(userId, 'CSR Representative');
      if (!user) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      await ShortlistEntity.deleteByCSRRepAndRequest(user.id, requestId);
      await RequestEntity.incrementShortlistCountDB(requestId);

      res.json({ message: 'Request removed from shortlist' });
    } catch (error) {
      next(error);
    }
  }
}
