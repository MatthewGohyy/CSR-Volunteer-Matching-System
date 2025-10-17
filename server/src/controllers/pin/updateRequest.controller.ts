import { Request, Response, NextFunction } from 'express';
import { PINRepository } from '../../repositories/PIN.repository';
import { RequestRepository } from '../../repositories/Request.repository';
import { AppError } from '../../middleware/errorHandler';

/**
 * Update Request Controller
 * 
 * Story #17: As a PIN, I want to update my request so that I can update details if something changes.
 */
export class UpdateRequestController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pinRepository = new PINRepository();
      const requestRepository = new RequestRepository();
      const userId = (req as any).user!.userId;
      const { id } = req.params;
      const { title, description, urgency, dateNeeded, location, status } = req.body;

      const pin = await pinRepository.findByUserId(userId);
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      const existingRequest = await requestRepository.findById(id);
      if (!existingRequest) {
        throw new AppError('Request not found', 404);
      }
      if (existingRequest.pinId !== pin.id) {
        throw new AppError('Unauthorized to update this request', 403);
      }

      const updateData: any = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (urgency) updateData.urgency = urgency;
      if (dateNeeded) updateData.dateNeeded = new Date(dateNeeded);
      if (location) updateData.location = location;
      if (status) updateData.status = status;

      const request = await requestRepository.update(id, updateData);

      res.json({
        message: 'Request updated successfully',
        request,
      });
    } catch (error) {
      next(error);
    }
  }
}

