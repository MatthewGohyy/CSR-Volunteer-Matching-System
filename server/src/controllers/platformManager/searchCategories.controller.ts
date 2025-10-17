import { Response, NextFunction } from 'express';
import { ServiceCategoryRepository } from '../../repositories/ServiceCategory.repository';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for searching service categories
 * User Story #39: Search service categories
 */
export class SearchCategoriesController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, includeInactive, page = '1', limit = '20' } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const categoryRepository = new ServiceCategoryRepository();

      let allCategories;
      if (q && typeof q === 'string' && q.trim()) {
        allCategories = await categoryRepository.search(q.trim(), 1, 1000);
      } else {
        allCategories = await categoryRepository.findAll(1, 1000);
      }

      if (includeInactive !== 'true') {
        allCategories = allCategories.filter(c => c.isActive);
      }

      const total = allCategories.length;
      const categories = allCategories.slice(skip, skip + limitNum);

      res.json({
        query: q,
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
