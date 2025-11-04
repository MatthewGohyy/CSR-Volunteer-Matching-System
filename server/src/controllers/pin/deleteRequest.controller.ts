import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';
import { RequestStatus } from '@prisma/client';

/**
 * Delete Request Controller
 * 
 * Story #18: As a PIN, I want to delete my request so that I no longer get matched with a CSR Representative.
 */
export class DeleteRequestController {
  static async handle(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user!.userId;

      // Check if request exists and belongs to user
      const existingRequest = await Request.findById(id);
      if (!existingRequest) {
        throw new AppError('Request not found', 404);
      }

      // Verify request belongs to the PIN
      if (existingRequest.pinId !== userId) {
        throw new AppError('Unauthorized access to this request', 403);
      }

      // Prevent deleting COMPLETED or MATCHED requests
      if (existingRequest.status === RequestStatus.COMPLETED || existingRequest.status === RequestStatus.MATCHED) {
        throw new AppError('Cannot delete a completed or matched request', 400);
      }

      await Request.delete(id);

      res.json({ message: 'Request deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

