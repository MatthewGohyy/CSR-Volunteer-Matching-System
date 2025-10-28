import { Response } from 'express';
import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * View Offers Controller
 * Allows PIN users to view all volunteer offers on their requests
 */
export class ViewOffersController {
  static async handle(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;

      // Get all offers on PIN's requests
      const offers = await prisma.volunteerOffer.findMany({
        where: {
          request: {
            pinId: userId
          }
        },
        include: {
          request: {
            select: {
              id: true,
              title: true,
              status: true,
              urgency: true
            }
          },
          csrRep: {
            select: {
              id: true,
              name: true,
              email: true,
              companyName: true,
              companyLogo: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json({
        offers,
        total: offers.length,
        pending: offers.filter(o => o.status === 'PENDING').length,
        accepted: offers.filter(o => o.status === 'ACCEPTED').length,
        declined: offers.filter(o => o.status === 'DECLINED').length
      });
    } catch (error: any) {
      throw new AppError(error.message || 'Failed to fetch offers', 500);
    }
  }
}
