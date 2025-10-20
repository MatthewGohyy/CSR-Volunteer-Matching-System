import { Response, NextFunction } from 'express';
import { CSRRepEntity } from '../../entities/CSRRep.entity';
import { RequestEntity } from '../../entities/Request.entity';
import { VolunteerOfferEntity } from '../../entities/VolunteerOffer.entity';
import { NotificationEntity } from '../../entities/Notification.entity';
import { PINEntity } from '../../entities/PIN.entity';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';
import { OfferStatus, RequestStatus, NotificationType } from '@prisma/client';
import { prisma } from '../../config/database';

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

      const csrRep = await CSRRepEntity.findByUserId(userId);
      if (!csrRep) {
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
      const pin = await PINEntity.findById(request.pinId);
      if (!pin) {
        throw new AppError('PIN not found', 404);
      }

      const offers = await VolunteerOfferEntity.findByCSRRep(csrRep.id, 1, 1000);
      const existingOffer = offers.find(o => o.requestId === requestId);
      if (existingOffer) {
        throw new AppError('Offer already submitted', 409);
      }

      // Create offer
      const offer = await prisma.$transaction(async (tx) => {
        const newOffer = await tx.volunteerOffer.create({
          data: {
            csrRepId: csrRep.id,
            requestId,
            message,
            status: OfferStatus.PENDING,
          },
          include: {
            csrRep: {
              select: {
                companyName: true,
                contactPerson: true,
              },
            },
            request: {
              include: {
                category: true,
              },
            },
          },
        });

        // Create notification for PIN
        await tx.notification.create({
          data: {
            userId: pin.userId,
            type: 'VOLUNTEER_OFFER',
            message: `${csrRep.companyName} has offered to help with your request: ${request.title}`,
          },
        });

        return newOffer;
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
