import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export class PlatformManagerController {
  // Create category
  static async createCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description, icon } = req.body;

      // Check if category with same name already exists
      const existingCategory = await prisma.serviceCategory.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
      });

      if (existingCategory) {
        throw new AppError('Category with this name already exists', 409);
      }

      const category = await prisma.serviceCategory.create({
        data: {
          name,
          description,
          icon,
          isActive: true,
        },
      });

      res.status(201).json({
        message: 'Category created successfully',
        category,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all categories with pagination and search
  static async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = '1', limit = '10', search, isActive } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};

      // Filter by active status if provided
      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      // Add text search
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const [categories, total] = await Promise.all([
        prisma.serviceCategory.findMany({
          where,
          orderBy: { name: 'asc' },
          skip,
          take: limitNum,
        }),
        prisma.serviceCategory.count({ where }),
      ]);

      res.json({
        categories,
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

  // Get category by ID
  static async getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const category = await prisma.serviceCategory.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              requests: true,
            },
          },
        },
      });

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      res.json({ category });
    } catch (error) {
      next(error);
    }
  }

  // Update category
  static async updateCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, icon, isActive } = req.body;

      // Check if category exists
      const existingCategory = await prisma.serviceCategory.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        throw new AppError('Category not found', 404);
      }

      // If updating name, check for duplicates
      if (name && name !== existingCategory.name) {
        const duplicate = await prisma.serviceCategory.findFirst({
          where: {
            name: { equals: name, mode: 'insensitive' },
            id: { not: id },
          },
        });

        if (duplicate) {
          throw new AppError('Category with this name already exists', 409);
        }
      }

      const category = await prisma.serviceCategory.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(icon !== undefined && { icon }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      res.json({
        message: 'Category updated successfully',
        category,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete category (soft delete by setting isActive to false)
  static async deleteCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { permanent } = req.query;

      // Check if category exists
      const category = await prisma.serviceCategory.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              requests: true,
            },
          },
        },
      });

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      // Check if category has associated requests
      if (category._count.requests > 0 && permanent === 'true') {
        throw new AppError(
          `Cannot permanently delete category with ${category._count.requests} associated request(s). Please deactivate instead.`,
          400
        );
      }

      if (permanent === 'true') {
        // Hard delete (only if no associated requests)
        await prisma.serviceCategory.delete({
          where: { id },
        });

        res.json({ message: 'Category permanently deleted successfully' });
      } else {
        // Soft delete (deactivate)
        await prisma.serviceCategory.update({
          where: { id },
          data: { isActive: false },
        });

        res.json({ message: 'Category deactivated successfully' });
      }
    } catch (error) {
      next(error);
    }
  }

  // Search categories (dedicated search endpoint)
  static async searchCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, limit = '20' } = req.query;

      if (!q || typeof q !== 'string') {
        throw new AppError('Search query is required', 400);
      }

      const limitNum = parseInt(limit as string);

      const categories = await prisma.serviceCategory.findMany({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
              ],
            },
            { isActive: true },
          ],
        },
        orderBy: { name: 'asc' },
        take: limitNum,
      });

      res.json({
        query: q,
        results: categories,
        count: categories.length,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get platform statistics (daily, weekly, monthly reports)
  static async getPlatformStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { period = 'all' } = req.query;

      let startDate: Date | undefined;
      const now = new Date();

      switch (period) {
        case 'daily':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'weekly':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'monthly':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = undefined;
      }

      const dateFilter = startDate ? { gte: startDate } : undefined;

      const [
        totalCategories,
        activeCategories,
        totalRequests,
        activeRequests,
        completedRequests,
        totalMatches,
        activeMatches,
        completedMatches,
        totalUsers,
        pinCount,
        csrRepCount,
        periodRequests,
        periodMatches,
      ] = await Promise.all([
        prisma.serviceCategory.count(),
        prisma.serviceCategory.count({ where: { isActive: true } }),
        prisma.request.count(),
        prisma.request.count({ where: { status: 'ACTIVE' } }),
        prisma.request.count({ where: { status: 'COMPLETED' } }),
        prisma.match.count(),
        prisma.match.count({ where: { status: 'ACTIVE' } }),
        prisma.match.count({ where: { status: 'COMPLETED' } }),
        prisma.user.count({ where: { status: 'ACTIVE' } }),
        prisma.pIN.count(),
        prisma.cSRRep.count(),
        dateFilter
          ? prisma.request.count({ where: { createdAt: dateFilter } })
          : totalRequests,
        dateFilter
          ? prisma.match.count({ where: { matchedAt: dateFilter } })
          : totalMatches,
      ]);

      // Get category usage statistics
      const categoryStats = await prisma.serviceCategory.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              requests: true,
            },
          },
        },
        orderBy: {
          requests: {
            _count: 'desc',
          },
        },
        take: 10,
      });

      res.json({
        period,
        categories: {
          total: totalCategories,
          active: activeCategories,
          inactive: totalCategories - activeCategories,
          topCategories: categoryStats.map((cat) => ({
            id: cat.id,
            name: cat.name,
            requestCount: cat._count.requests,
          })),
        },
        requests: {
          total: totalRequests,
          active: activeRequests,
          completed: completedRequests,
          periodNew: periodRequests,
        },
        matches: {
          total: totalMatches,
          active: activeMatches,
          completed: completedMatches,
          periodNew: periodMatches,
        },
        users: {
          total: totalUsers,
          pins: pinCount,
          csrReps: csrRepCount,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get profile
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      const platformManager = await prisma.platformManager.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              email: true,
              status: true,
              createdAt: true,
            },
          },
        },
      });

      if (!platformManager) {
        throw new AppError('Platform Manager profile not found', 404);
      }

      res.json({ profile: platformManager });
    } catch (error) {
      next(error);
    }
  }

  // Update profile
  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { fullName, department, phone } = req.body;

      const platformManager = await prisma.platformManager.findUnique({
        where: { userId },
      });

      if (!platformManager) {
        throw new AppError('Platform Manager profile not found', 404);
      }

      const updated = await prisma.platformManager.update({
        where: { id: platformManager.id },
        data: {
          ...(fullName && { fullName }),
          ...(department && { department }),
          ...(phone && { phone }),
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

