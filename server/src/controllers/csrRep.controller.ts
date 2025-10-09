import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { OfferStatus } from '@prisma/client';

export class CSRRepController {
  // Shortlist a request
  static async shortlistRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { requestId } = req.body;

      // Get CSR Rep profile
      const csrRep = await prisma.cSRRep.findUnique({ where: { userId } });
      if (!csrRep) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      // Check if request exists
      const request = await prisma.request.findUnique({ where: { id: requestId } });
      if (!request) {
        throw new AppError('Request not found', 404);
      }

      // Check if already shortlisted
      const existing = await prisma.shortlist.findUnique({
        where: {
          csrRepId_requestId: {
            csrRepId: csrRep.id,
            requestId,
          },
        },
      });

      if (existing) {
        throw new AppError('Request already shortlisted', 409);
      }

      // Create shortlist
      const shortlist = await prisma.shortlist.create({
        data: {
          csrRepId: csrRep.id,
          requestId,
        },
        include: {
          request: {
            include: {
              category: true,
              pin: {
                select: {
                  name: true,
                  location: true,
                },
              },
            },
          },
        },
      });

      // Increment shortlist count
      await prisma.request.update({
        where: { id: requestId },
        data: { shortlistCount: { increment: 1 } },
      });

      res.status(201).json({
        message: 'Request shortlisted successfully',
        shortlist,
      });
    } catch (error) {
      next(error);
    }
  }

  // Remove from shortlist
  static async removeShortlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { requestId } = req.params;

      // Get CSR Rep profile
      const csrRep = await prisma.cSRRep.findUnique({ where: { userId } });
      if (!csrRep) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      // Delete shortlist
      await prisma.shortlist.delete({
        where: {
          csrRepId_requestId: {
            csrRepId: csrRep.id,
            requestId,
          },
        },
      });

      // Decrement shortlist count
      await prisma.request.update({
        where: { id: requestId },
        data: { shortlistCount: { decrement: 1 } },
      });

      res.json({ message: 'Request removed from shortlist' });
    } catch (error) {
      next(error);
    }
  }

  // Get shortlisted requests
  static async getShortlists(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      // Get CSR Rep profile
      const csrRep = await prisma.cSRRep.findUnique({ where: { userId } });
      if (!csrRep) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      const shortlists = await prisma.shortlist.findMany({
        where: { csrRepId: csrRep.id },
        include: {
          request: {
            include: {
              category: true,
              pin: {
                select: {
                  name: true,
                  location: true,
                  accessibilityNeeds: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json({ shortlists });
    } catch (error) {
      next(error);
    }
  }

  // Submit volunteer offer
  static async submitOffer(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { requestId, message } = req.body;

      // Get CSR Rep profile
      const csrRep = await prisma.cSRRep.findUnique({ where: { userId } });
      if (!csrRep) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      // Check if request exists and is active
      const request = await prisma.request.findUnique({
        where: { id: requestId },
        include: {
          pin: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!request) {
        throw new AppError('Request not found', 404);
      }

      if (request.status !== 'ACTIVE') {
        throw new AppError('Request is not active', 400);
      }

      // Check if already offered
      const existingOffer = await prisma.volunteerOffer.findFirst({
        where: {
          csrRepId: csrRep.id,
          requestId,
        },
      });

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
            userId: request.pin.userId,
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

  // Get my offers
  static async getMyOffers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      // Get CSR Rep profile
      const csrRep = await prisma.cSRRep.findUnique({ where: { userId } });
      if (!csrRep) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      const offers = await prisma.volunteerOffer.findMany({
        where: { csrRepId: csrRep.id },
        include: {
          request: {
            include: {
              category: true,
              pin: {
                select: {
                  name: true,
                  location: true,
                },
              },
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

  // Get my matches
  static async getMyMatches(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      // Get CSR Rep profile
      const csrRep = await prisma.cSRRep.findUnique({ where: { userId } });
      if (!csrRep) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      const matches = await prisma.match.findMany({
        where: { csrRepId: csrRep.id },
        include: {
          request: {
            include: {
              category: true,
            },
          },
          pin: {
            select: {
              name: true,
              location: true,
              phoneNumber: true,
              accessibilityNeeds: true,
            },
          },
        },
        orderBy: {
          matchedAt: 'desc',
        },
      });

      res.json({ matches });
    } catch (error) {
      next(error);
    }
  }

  // Update profile
  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { industry, contactPerson, phoneNumber, companyAddress, companyLogo } = req.body;

      // Get CSR Rep profile
      const csrRep = await prisma.cSRRep.findUnique({ where: { userId } });
      if (!csrRep) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      // Update profile
      const updated = await prisma.cSRRep.update({
        where: { id: csrRep.id },
        data: {
          ...(industry && { industry }),
          ...(contactPerson && { contactPerson }),
          ...(phoneNumber && { phoneNumber }),
          ...(companyAddress && { companyAddress }),
          ...(companyLogo && { companyLogo }),
        },
      });

      res.json({
        message: 'Profile updated successfully',
        profile: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

