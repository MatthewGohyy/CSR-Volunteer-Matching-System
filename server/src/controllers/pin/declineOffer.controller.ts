import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

/**
 * Decline Offer Controller
 * Allows PIN users to decline a volunteer offer
 */
export class DeclineOfferController {
  static async handle(req: AuthRequest, res: Response) {
    try {
      const { offerId } = req.params;
      const userId = req.user!.userId;

      // Get offer with request details
      const offer = await prisma.volunteerOffer.findUnique({
        where: { id: offerId },
        include: {
          request: {
            select: {
              pinId: true,
              title: true
            }
          },
          csrRep: {
            select: {
              name: true
            }
          }
        }
      });

      if (!offer) {
        throw new AppError('Offer not found', 404);
      }

      // Verify PIN owns this request
      if (offer.request.pinId !== userId) {
        throw new AppError('You can only decline offers on your own requests', 403);
      }

      // Check if offer is still pending
      if (offer.status !== 'PENDING') {
        throw new AppError('This offer has already been responded to', 400);
      }

      await prisma.$transaction(async (tx) => {
        // Update offer status
        await tx.volunteerOffer.update({
          where: { id: offerId },
          data: { status: 'DECLINED' }
        });

        // Notify CSR Rep
        await tx.notification.create({
          data: {
            userId: offer.csrRepId,
            type: 'OFFER_DECLINED',
            message: `Your offer for "${offer.request.title}" was declined. You can try other requests.`,
            isRead: false
          }
        });
      });

      res.json({
        message: 'Offer declined successfully'
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to decline offer', 500);
    }
  }
}
