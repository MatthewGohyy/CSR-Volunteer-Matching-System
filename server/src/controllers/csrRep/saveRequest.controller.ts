import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Shortlist } from '../../entities/Shortlist.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Save Request Controller
 * Story #28: As a CSR Rep, I want to save requests (shortlist)
 */
export class SaveRequestController {
  static async handle(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { requestId } = req.body;

      const shortlist = await Shortlist.create({
        csrRepId: userId,
        requestId,
      });

      res.status(201).json({ message: 'Request shortlisted successfully', shortlist });
    } catch (error) {
      next(error);
    }
  }
}
