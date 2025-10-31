import { Response, NextFunction } from 'express';
import { RequestCategoryEntity } from '../../entities/RequestCategory.entity';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for searching request categories
 * User Story #39: Search request categories
 */
export class SearchCategoriesController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, includeInactive } = req.query;

      // Simplified - get all categories, filter on frontend
      let allCategories;
      if (q && typeof q === 'string' && q.trim()) {
        allCategories = await RequestCategoryEntity.search(q.trim());
      } else {
        allCategories = await RequestCategoryEntity.findAll();
      }

      if (includeInactive !== 'true') {
        allCategories = allCategories.filter(c => c.isActive);
      }

      res.json({
        query: q,
        categories: allCategories,
      });
    } catch (error) {
      next(error);
    }
  }
}
