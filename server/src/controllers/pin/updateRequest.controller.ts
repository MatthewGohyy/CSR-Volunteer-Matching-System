import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request } from '../../entities/Request.entity';
import { AppError } from '../../middleware/errorHandler';
import { RequestStatus } from '@prisma/client';

/**
 * Update Request Controller
 * 
 * Story #17: As a PIN, I want to update my request so that I can update details if something changes.
 */
export class UpdateRequestController {
  static async handle(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user!.userId;
      const { id } = req.params;
      const { title, description, urgency, dateNeeded, location, status } = req.body;

      // Check if request exists and belongs to user
      const existingRequest = await Request.findById(id);
      if (!existingRequest) {
        throw new AppError('Request not found', 404);
      }

      // Verify request belongs to the PIN
      if (existingRequest.pinId !== userId) {
        throw new AppError('Unauthorized access to this request', 403);
      }

      // Prevent editing COMPLETED or MATCHED requests
      if (existingRequest.status === RequestStatus.COMPLETED || existingRequest.status === RequestStatus.MATCHED) {
        throw new AppError('Cannot edit a completed or matched request', 400);
      }

      // Update request
      const updateData: any = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (req.body.categoryId) updateData.categoryId = req.body.categoryId;
      if (urgency) updateData.urgency = urgency;
      if (dateNeeded) updateData.dateNeeded = new Date(dateNeeded);
      if (location) updateData.location = location;
      // Note: status updates should be handled by match/complete flows, not manual edits
      // if (status) updateData.status = status;

      const request = await Request.update(id, updateData);

      res.json({
        message: 'Request updated successfully',
        request,
      });
    } catch (error: any) {
      // Convert entity errors to AppError
      if (error.message && error.message.includes('not found')) {
        next(new AppError(error.message, 404));
      } else {
        next(error);
      }
    }
  }
}

