import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Delete Request Controller
 * 
 * Story #18: As a PIN, I want to delete my request so that I no longer get matched with a CSR Representative.
 */
export class DeleteRequestController {
  static async handle(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await Request.delete(id);

      res.json({ message: 'Request deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

