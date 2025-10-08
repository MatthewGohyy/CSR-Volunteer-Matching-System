import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { OfferStatus, RequestStatus, MatchStatus } from '@prisma/client';

export class MatchController {
  // Accept a volunteer offer (PIN only)
  static async acceptOffer(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { offerId } = req.params;

      // Get PIN profile
      const pin = await prisma.pIN.findUnique({ where: { userId } });
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      // Get offer with related data
      const offer = await prisma.volunteerOffer.findUnique({
        where: { id: offerId },
        include: {
          request: true,
          csrRep: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!offer) {
        throw new AppError('Offer not found', 404);
      }

      // Verify request belongs to the PIN
      if (offer.request.pinId !== pin.id) {
        throw new AppError('Unauthorized to accept this offer', 403);
      }

      // Check if request is still active
      if (offer.request.status !== RequestStatus.ACTIVE) {
        throw new AppError('Request is no longer active', 400);
      }

      // Check if offer is pending
      if (offer.status !== OfferStatus.PENDING) {
        throw new AppError('Offer has already been processed', 400);
      }

      // Create match and update statuses
      const match = await prisma.$transaction(async (tx) => {
        // Accept the offer
        await tx.volunteerOffer.update({
          where: { id: offerId },
          data: { status: OfferStatus.ACCEPTED },
        });

        // Decline all other pending offers for this request
        await tx.volunteerOffer.updateMany({
          where: {
            requestId: offer.requestId,
            id: { not: offerId },
            status: OfferStatus.PENDING,
          },
          data: { status: OfferStatus.DECLINED },
        });

        // Update request status
        await tx.request.update({
          where: { id: offer.requestId },
          data: { status: RequestStatus.MATCHED },
        });

        // Create match
        const newMatch = await tx.match.create({
          data: {
            requestId: offer.requestId,
            csrRepId: offer.csrRepId,
            pinId: pin.id,
            status: MatchStatus.ACTIVE,
          },
          include: {
            request: {
              include: {
                category: true,
              },
            },
            csrRep: {
              select: {
                companyName: true,
                contactPerson: true,
                phoneNumber: true,
              },
            },
          },
        });

        // Create notifications
        await tx.notification.createMany({
          data: [
            {
              userId: offer.csrRep.userId,
              type: 'OFFER_ACCEPTED',
              message: `Your offer for "${offer.request.title}" has been accepted!`,
            },
            {
              userId: userId,
              type: 'MATCH_CONFIRMED',
              message: `You have been matched with ${offer.csrRep.companyName} for your request.`,
            },
          ],
        });

        return newMatch;
      });

      res.json({
        message: 'Offer accepted and match created successfully',
        match,
      });
    } catch (error) {
      next(error);
    }
  }

  // Decline a volunteer offer (PIN only)
  static async declineOffer(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { offerId } = req.params;

      // Get PIN profile
      const pin = await prisma.pIN.findUnique({ where: { userId } });
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      // Get offer
      const offer = await prisma.volunteerOffer.findUnique({
        where: { id: offerId },
        include: {
          request: true,
          csrRep: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!offer) {
        throw new AppError('Offer not found', 404);
      }

      // Verify request belongs to the PIN
      if (offer.request.pinId !== pin.id) {
        throw new AppError('Unauthorized to decline this offer', 403);
      }

      // Check if offer is pending
      if (offer.status !== OfferStatus.PENDING) {
        throw new AppError('Offer has already been processed', 400);
      }

      // Decline the offer
      await prisma.$transaction(async (tx) => {
        await tx.volunteerOffer.update({
          where: { id: offerId },
          data: { status: OfferStatus.DECLINED },
        });

        // Create notification for CSR Rep
        await tx.notification.create({
          data: {
            userId: offer.csrRep.userId,
            type: 'OFFER_DECLINED',
            message: `Your offer for "${offer.request.title}" was declined.`,
          },
        });
      });

      res.json({ message: 'Offer declined successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Get offers for my requests (PIN only)
  static async getOffersForMyRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      // Get PIN profile
      const pin = await prisma.pIN.findUnique({ where: { userId } });
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      const offers = await prisma.volunteerOffer.findMany({
        where: {
          request: {
            pinId: pin.id,
          },
        },
        include: {
          request: {
            include: {
              category: true,
            },
          },
          csrRep: {
            select: {
              companyName: true,
              contactPerson: true,
              phoneNumber: true,
              industry: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json({ offers });
    } catch (error) {
      next(error);
    }
  }

  // Complete a match
  static async completeMatch(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { matchId } = req.params;
      const userId = req.user!.userId;
      const userType = req.user!.userType;

      // Get match
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          pin: { include: { user: true } },
          csrRep: { include: { user: true } },
          request: true,
        },
      });

      if (!match) {
        throw new AppError('Match not found', 404);
      }

      // Verify user is part of this match
      if (userType === 'PIN' && match.pin.userId !== userId) {
        throw new AppError('Unauthorized', 403);
      }
      if (userType === 'CSR_REP' && match.csrRep.userId !== userId) {
        throw new AppError('Unauthorized', 403);
      }

      // Check if match is active
      if (match.status !== MatchStatus.ACTIVE) {
        throw new AppError('Match is not active', 400);
      }

      // Complete the match
      await prisma.$transaction(async (tx) => {
        await tx.match.update({
          where: { id: matchId },
          data: {
            status: MatchStatus.COMPLETED,
            completedAt: new Date(),
          },
        });

        await tx.request.update({
          where: { id: match.requestId },
          data: { status: RequestStatus.COMPLETED },
        });

        // Create notifications
        await tx.notification.createMany({
          data: [
            {
              userId: match.pin.userId,
              type: 'MATCH_CONFIRMED',
              message: `Your request "${match.request.title}" has been marked as completed.`,
            },
            {
              userId: match.csrRep.userId,
              type: 'MATCH_CONFIRMED',
              message: `Match for "${match.request.title}" has been marked as completed.`,
            },
          ],
        });
      });

      res.json({ message: 'Match completed successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Cancel a match
  static async cancelMatch(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { matchId } = req.params;
      const { reason } = req.body;
      const userId = req.user!.userId;
      const userType = req.user!.userType;

      // Get match
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          pin: { include: { user: true } },
          csrRep: { include: { user: true } },
          request: true,
        },
      });

      if (!match) {
        throw new AppError('Match not found', 404);
      }

      // Verify user is part of this match
      if (userType === 'PIN' && match.pin.userId !== userId) {
        throw new AppError('Unauthorized', 403);
      }
      if (userType === 'CSR_REP' && match.csrRep.userId !== userId) {
        throw new AppError('Unauthorized', 403);
      }

      // Check if match can be cancelled
      if (match.status !== MatchStatus.ACTIVE) {
        throw new AppError('Match cannot be cancelled', 400);
      }

      // Cancel the match
      await prisma.$transaction(async (tx) => {
        await tx.match.update({
          where: { id: matchId },
          data: {
            status: MatchStatus.CANCELLED,
            cancellationReason: reason,
          },
        });

        await tx.request.update({
          where: { id: match.requestId },
          data: { status: RequestStatus.ACTIVE },
        });

        // Create notifications
        await tx.notification.createMany({
          data: [
            {
              userId: match.pin.userId,
              type: 'MATCH_CANCELLED',
              message: `Match for "${match.request.title}" has been cancelled.`,
            },
            {
              userId: match.csrRep.userId,
              type: 'MATCH_CANCELLED',
              message: `Match for "${match.request.title}" has been cancelled.`,
            },
          ],
        });
      });

      res.json({ message: 'Match cancelled successfully' });
    } catch (error) {
      next(error);
    }
  }
}

