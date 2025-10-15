import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { RequestStatus, UrgencyLevel, UserType } from '@prisma/client';

export class RequestController {
  // Create a new request (PIN only)
  static async createRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { categoryId, title, description, urgency, dateNeeded, location } = req.body;

      // Get PIN profile
      const pin = await prisma.pIN.findUnique({ where: { userId } });
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      // Create request
      const request = await prisma.request.create({
        data: {
          pinId: pin.id,
          categoryId,
          title,
          description,
          urgency: urgency || UrgencyLevel.MEDIUM,
          dateNeeded: dateNeeded ? new Date(dateNeeded) : null,
          location,
          status: RequestStatus.ACTIVE,
        },
        include: {
          category: true,
          pin: {
            include: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      });

      res.status(201).json({
        message: 'Request created successfully',
        request,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all requests (with filters)
  static async getRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, urgency, categoryId, search, page = '1', limit = '10' } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};

      if (status) {
        where.status = status;
      }
      if (urgency) {
        where.urgency = urgency;
      }
      if (categoryId) {
        where.categoryId = categoryId;
      }

      // Add text search
      if (search && typeof search === 'string') {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [requests, total] = await Promise.all([
        prisma.request.findMany({
          where,
          include: {
            category: true,
            pin: {
              select: {
                name: true,
                location: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limitNum,
        }),
        prisma.request.count({ where }),
      ]);

      res.json({
        requests,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single request
  static async getRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const request = await prisma.request.findUnique({
        where: { id },
        include: {
          category: true,
          pin: {
            include: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          shortlists: {
            include: {
              csrRep: {
                include: {
                  user: {
                    select: {
                      email: true,
                    },
                  },
                },
              },
            },
          },
          volunteerOffers: {
            include: {
              csrRep: {
                select: {
                  companyName: true,
                },
              },
            },
          },
        },
      });

      if (!request) {
        throw new AppError('Request not found', 404);
      }

      // Increment view count
      await prisma.request.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });

      res.json({ request });
    } catch (error) {
      next(error);
    }
  }

  // Get user's own requests (PIN only)
  static async getMyRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      const pin = await prisma.pIN.findUnique({ where: { userId } });
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      const requests = await prisma.request.findMany({
        where: { pinId: pin.id },
        include: {
          category: true,
          volunteerOffers: {
            include: {
              csrRep: {
                select: {
                  companyName: true,
                  contactPerson: true,
                  phoneNumber: true,
                },
              },
            },
          },
          match: {
            include: {
              csrRep: {
                select: {
                  companyName: true,
                  contactPerson: true,
                  phoneNumber: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json({ requests });
    } catch (error) {
      next(error);
    }
  }

  // Update request (PIN only, own requests)
  static async updateRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const { title, description, urgency, dateNeeded, location, status } = req.body;

      // Get PIN profile
      const pin = await prisma.pIN.findUnique({ where: { userId } });
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      // Check if request belongs to user
      const existingRequest = await prisma.request.findUnique({ where: { id } });
      if (!existingRequest) {
        throw new AppError('Request not found', 404);
      }
      if (existingRequest.pinId !== pin.id) {
        throw new AppError('Unauthorized to update this request', 403);
      }

      // Update request
      const request = await prisma.request.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(urgency && { urgency }),
          ...(dateNeeded && { dateNeeded: new Date(dateNeeded) }),
          ...(location && { location }),
          ...(status && { status }),
        },
        include: {
          category: true,
        },
      });

      res.json({
        message: 'Request updated successfully',
        request,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete request (PIN only, own requests)
  static async deleteRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      // Get PIN profile
      const pin = await prisma.pIN.findUnique({ where: { userId } });
      if (!pin) {
        throw new AppError('PIN profile not found', 404);
      }

      // Check if request belongs to user
      const existingRequest = await prisma.request.findUnique({ where: { id } });
      if (!existingRequest) {
        throw new AppError('Request not found', 404);
      }
      if (existingRequest.pinId !== pin.id) {
        throw new AppError('Unauthorized to delete this request', 403);
      }

      // Delete request (cascade will handle related records)
      await prisma.request.delete({ where: { id } });

      res.json({ message: 'Request deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Get service categories
  static async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await prisma.serviceCategory.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });

      res.json({ categories });
    } catch (error) {
      next(error);
    }
  }
}

