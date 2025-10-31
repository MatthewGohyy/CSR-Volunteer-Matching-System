import { Request, Response, NextFunction } from 'express';
import { RequestEntity } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Update Request Controller
 * 
 * Story #17: As a PIN, I want to update my request so that I can update details if something changes.
 */
export class UpdateRequestController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { id } = req.params;
      const { title, description, urgency, dateNeeded, location, status } = req.body;

      const existingRequest = await RequestEntity.findById(id);
      if (!existingRequest) {
        throw new AppError('Request not found', 404);
      }
      if (existingRequest.pinId !== userId) {
        throw new AppError('Unauthorized to update this request', 403);
      }

      const updateData: any = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (req.body.categoryId) updateData.categoryId = req.body.categoryId;
      if (urgency) updateData.urgency = urgency;
      if (dateNeeded) updateData.dateNeeded = new Date(dateNeeded);
      if (location) updateData.location = location;
      if (status) updateData.status = status;

      const request = await RequestEntity.update(id, updateData);

      res.json({
        message: 'Request updated successfully',
        request,
      });
    } catch (error) {
      next(error);
    }
  }
}

