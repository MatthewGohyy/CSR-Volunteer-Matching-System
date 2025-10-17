import { Request, Response, NextFunction } from 'express';
import { PINRepository } from '../../repositories/PIN.repository';
import { RequestRepository } from '../../repositories/Request.repository';
import { AppError } from '../../middleware/errorHandler';

/**
 * Delete Request Controller
 * 
 * Story #18: As a PIN, I want to delete my request so that I no longer get matched with a CSR Representative.
 */
export class DeleteRequestController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pinRepository = new PINRepository();
      const requestRepository = new RequestRepository();
      const userId = (req as any).user!.userId;
      const { id } = req.params;

      const pin = await pinRepository.findByUserId(userId);
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      const existingRequest = await requestRepository.findById(id);
      if (!existingRequest) {
        throw new AppError('Request not found', 404);
      }
      if (existingRequest.pinId !== pin.id) {
        throw new AppError('Unauthorized to delete this request', 403);
      }

      await requestRepository.delete(id);

      res.json({ message: 'Request deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

