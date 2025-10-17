import { Request, Response, NextFunction } from 'express';
import { CSRRepEntity } from '../../entities/CSRRep.entity';
import { RequestEntity } from '../../entities/Request.entity';
import { ShortlistEntity } from '../../entities/Shortlist.entity';
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


      const csrRep = await CSRRepEntity.findByUserId(userId);
      if (!csrRep) throw new AppError('CSR Rep profile not found', 404);

      const request = await RequestEntity.findById(requestId);
      if (!request) throw new AppError('Request not found', 404);

      const exists = await ShortlistEntity.exists(csrRep.id, requestId);
      if (exists) throw new AppError('Request already shortlisted', 409);

      const shortlist = await ShortlistEntity.create({
        csrRepId: csrRep.id,
        requestId,
      });

      await RequestEntity.incrementShortlistCountDB(requestId);

      res.status(201).json({ message: 'Request shortlisted successfully', shortlist });
    } catch (error) {
      next(error);
    }
  }
}
