import { Request, Response, NextFunction } from 'express';
import { RequestEntity } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Delete Request Controller
 * 
 * Story #18: As a PIN, I want to delete my request so that I no longer get matched with a CSR Representative.
 */
export class DeleteRequestController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { id } = req.params;

      const existingRequest = await RequestEntity.findById(id);
      if (!existingRequest) {
        throw new AppError('Request not found', 404);
      }
      if (existingRequest.pinId !== userId) {
        throw new AppError('Unauthorized to delete this request', 403);
      }

      await RequestEntity.delete(id);

      res.json({ message: 'Request deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

