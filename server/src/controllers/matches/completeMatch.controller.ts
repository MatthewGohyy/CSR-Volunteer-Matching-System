import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

/**
 * Complete Match Controller
 * Allows either PIN or CSR Rep to mark a match as completed
 */
export class CompleteMatchController {
  static async handle(req: AuthRequest, res: Response) {
    try {
      const { matchId } = req.params;
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

      // Verify user is part of this match (either PIN or CSR)
      if (match.pinId !== userId && match.csrRepId !== userId) {
        throw new AppError('You are not authorized to complete this match', 403);
      }

      // Check if match is still active
      if (match.status !== 'ACTIVE') {
        throw new AppError(`Match is already ${match.status.toLowerCase()}`, 400);
      }

      await prisma.$transaction(async (tx) => {
        // Update match status
        await tx.match.update({
          where: { id: matchId },
          data: {
            status: 'COMPLETED',
            completedAt: new Date()
          }
        });

        // Update request status
        await tx.request.update({
          where: { id: match.requestId },
          data: { status: 'COMPLETED' }
        });

        // Create completion notifications for both parties
        const csrName = match.csrRep.companyName || match.csrRep.name;
        
        await tx.notification.createMany({
          data: [
            {
              userId: match.pinId,
              type: 'MATCH_CONFIRMED',
              message: `Match completed! Thank you for working with ${csrName}.`,
              isRead: false
            },
            {
              userId: match.csrRepId,
              type: 'MATCH_CONFIRMED',
              message: `Match completed! Great work helping ${match.pin.name}.`,
              isRead: false
            }
          ]
        });
      });

      res.json({
        message: 'Match completed successfully',
        completedAt: new Date()
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to complete match', 500);
    }
  }
}
