import { Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { RequestEntity } from '../../entities/Request.entity';
import { VolunteerOfferEntity } from '../../entities/VolunteerOffer.entity';
import { NotificationEntity } from '../../entities/Notification.entity';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';
import { RequestStatus, NotificationType } from '@prisma/client';

/**
 * Controller for submitting a volunteer offer to a request
 * User Story: Submit volunteer offer to help with a request
 */
export class SubmitOfferController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { requestId, message } = req.body;

      // Get CSR Rep profile

      const user = await UserAccountEntity.findByUserIdWithProfileName(userId, 'CSR Representative');
      if (!user) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      const request = await RequestEntity.findById(requestId);
      if (!request) {
        throw new AppError('Request not found', 404);
      }

      if (request.status !== RequestStatus.ACTIVE) {
        throw new AppError('Request is not active', 400);
      }

      // Get PIN for notification
      const pinUser = await UserAccountEntity.findById(request.pinId);
      if (!pinUser) {
        throw new AppError('PIN not found', 404);
      }

      const offers = await VolunteerOfferEntity.findByCSRRep(user.id, 1, 1000);
      const existingOffer = offers.find(o => o.requestId === requestId);
      if (existingOffer) {
        throw new AppError('Offer already submitted', 409);
      }

      // Create offer
      const offer = await VolunteerOfferEntity.create({
        csrRepId: user.id,
        requestId,
        message,
      });

      // Create notification (supplementary logic)
      await NotificationEntity.create({
        userId: pinUser.id,
        type: NotificationType.VOLUNTEER_OFFER,
        message: `${user.companyName} has offered to help with your request: ${request.title}`,
      });

      res.status(201).json({
        message: 'Volunteer offer submitted successfully',
        offer,
      });
    } catch (error) {
      next(error);
    }
  }
}
