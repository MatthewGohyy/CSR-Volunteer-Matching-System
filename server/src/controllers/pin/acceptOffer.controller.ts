import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

/**
 * Accept Offer Controller
 * Allows PIN users to accept a volunteer offer
 * Creates a Match and updates request status
 */
export class AcceptOfferController {
  static async handle(req: AuthRequest, res: Response) {
    try {
      const { offerId } = req.params;
      const userId = req.user!.userId;

      // Get offer with request details
      const offer = await prisma.volunteerOffer.findUnique({
        where: { id: offerId },
        include: {
          request: true,
          csrRep: {
            select: {
              name: true,
              companyName: true
            }
          }
        }
      });

      if (!offer) {
        throw new AppError('Offer not found', 404);
      }

      // Verify PIN owns this request
      if (offer.request.pinId !== userId) {
        throw new AppError('You can only accept offers on your own requests', 403);
      }

      // Check if offer is still pending
      if (offer.status !== 'PENDING') {
        throw new AppError('This offer has already been responded to', 400);
      }

      // Check if request is already matched
      if (offer.request.status === 'MATCHED') {
        throw new AppError('This request is already matched', 400);
      }

      // Start transaction to ensure data consistency
      const result = await prisma.$transaction(async (tx) => {
        // 1. Update offer status to ACCEPTED
        await tx.volunteerOffer.update({
          where: { id: offerId },
          data: { status: 'ACCEPTED' }
        });

        // 2. Create match
        const match = await tx.match.create({
          data: {
            requestId: offer.requestId,
            csrRepId: offer.csrRepId,
            pinId: userId,
            status: 'ACTIVE'
          }
        });

        // 3. Update request status to MATCHED
        await tx.request.update({
          where: { id: offer.requestId },
          data: { status: 'MATCHED' }
        });

        // 4. Auto-decline all other pending offers on this request
        await tx.volunteerOffer.updateMany({
          where: {
            requestId: offer.requestId,
            id: { not: offerId },
            status: 'PENDING'
          },
          data: { status: 'DECLINED' }
        });

        // 5. Create notifications for both parties
        await tx.notification.createMany({
          data: [
            {
              userId: offer.csrRepId,
              type: 'OFFER_ACCEPTED',
              message: `Great news! Your offer for "${offer.request.title}" has been accepted.`,
              isRead: false
            },
            {
              userId: userId,
              type: 'MATCH_CONFIRMED',
              message: `Match confirmed! You can now work with ${offer.csrRep.companyName || offer.csrRep.name}.`,
              isRead: false
            }
          ]
        });

        return match;
      });

      res.json({
        message: 'Offer accepted successfully',
        match: result
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to accept offer', 500);
    }
  }
}
