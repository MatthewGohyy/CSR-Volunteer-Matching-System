import { Response, NextFunction } from 'express';
import { RequestCategoryEntity } from '../../entities/RequestCategory.entity';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for viewing request categories
 * User Story #36: View request categories
 * Follows BCE pattern - all database operations through entity class
 */
export class ViewCategoriesController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { includeInactive, search } = req.query;

      // Handle search query
      let categories;
      if (search && typeof search === 'string' && search.trim()) {
        // Search categories
        categories = await RequestCategoryEntity.search(search.trim());
      } else {
        // Get all or active categories
        categories = includeInactive === 'true' 
          ? await RequestCategoryEntity.findAll()
          : await RequestCategoryEntity.findActive();
      }

      // Filter by active status if needed
      if (includeInactive !== 'true' && search) {
        categories = categories.filter(c => c.isActive);
      }

      res.json({
        categories,
      });
    } catch (error) {
      next(error);
    }
  }
}
