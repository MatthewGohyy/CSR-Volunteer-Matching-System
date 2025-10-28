import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

/**
 * Cancel Match Controller
 * Allows either PIN or CSR Rep to cancel an active match
 */
export class CancelMatchController {
  static async handle(req: AuthRequest, res: Response) {
    try {
      const { matchId } = req.params;
      const { reason } = req.body;
      const userId = req.user!.userId;

      // Get match details
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          request: {
            select: {
              title: true
            }
          },
          pin: {
            select: {
              name: true
            }
          },
          csrRep: {
            select: {
              name: true,
              companyName: true
            }
          }
        }
      });

      if (!match) {
        throw new AppError('Match not found', 404);
      }

      // Verify user is part of this match
      if (match.pinId !== userId && match.csrRepId !== userId) {
        throw new AppError('You are not authorized to cancel this match', 403);
      }

      // Check if match can be cancelled
      if (match.status === 'COMPLETED') {
        throw new AppError('Cannot cancel a completed match', 400);
      }

      if (match.status === 'CANCELLED') {
        throw new AppError('Match is already cancelled', 400);
      }

      const cancelledBy = match.pinId === userId ? 'PIN' : 'CSR';

      await prisma.$transaction(async (tx) => {
        // Update match status
        await tx.match.update({
          where: { id: matchId },
          data: {
            status: 'CANCELLED',
            cancellationReason: reason || `Cancelled by ${cancelledBy}`
          }
        });

        // Update request status back to ACTIVE (can be matched again)
        await tx.request.update({
          where: { id: match.requestId },
          data: { status: 'ACTIVE' }
        });

        // Create cancellation notifications
        const csrName = match.csrRep.companyName || match.csrRep.name;
        const notificationMessage = reason 
          ? `Match cancelled. Reason: ${reason}` 
          : 'Match has been cancelled.';

        await tx.notification.createMany({
          data: [
            {
              userId: match.pinId,
              type: 'MATCH_CANCELLED',
              message: `Match with ${csrName} cancelled. ${notificationMessage}`,
              isRead: false
            },
            {
              userId: match.csrRepId,
              type: 'MATCH_CANCELLED',
              message: `Match with ${match.pin.name} cancelled. ${notificationMessage}`,
              isRead: false
            }
          ]
        });
      });

      res.json({
        message: 'Match cancelled successfully',
        requestStatus: 'Request is now available for other volunteers'
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to cancel match', 500);
    }
  }
}
