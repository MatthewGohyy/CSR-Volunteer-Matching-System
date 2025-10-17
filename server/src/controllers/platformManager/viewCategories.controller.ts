import { Response, NextFunction } from 'express';
import { ServiceCategoryRepository } from '../../repositories/ServiceCategory.repository';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../config/database';

/**
 * Controller for viewing service categories
 * User Story #36: View service categories
 */
export class ViewCategoriesController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // If ID is provided, return single category
      const categoryRepository = new ServiceCategoryRepository();

      if (id) {
        const category = await categoryRepository.findById(id);

        if (!category) {
          throw new AppError('Category not found', 404);
        }

        res.json({
          category,
        });
        return;
      }

      // Otherwise, return all categories
      const { page = '1', limit = '20', includeInactive } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};

      // By default, only show active categories unless explicitly requested
      if (includeInactive !== 'true') {
        where.isActive = true;
      }

      const [categories, total] = await Promise.all([
        prisma.serviceCategory.findMany({
          where,
          include: {
            _count: {
              select: {
                requests: true,
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
          skip,
          take: limitNum,
        }),
        prisma.serviceCategory.count({ where }),
      ]);

      res.json({
        query: {},
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
}
