import { Response, NextFunction } from 'express';
import { ServiceCategoryEntity } from '../../entities/ServiceCategory.entity';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for viewing service categories
 * User Story #36: View service categories
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
        categories = await ServiceCategoryEntity.search(search.trim());
      } else {
        // Get all or active categories
        categories = includeInactive === 'true' 
          ? await ServiceCategoryEntity.findAll()
          : await ServiceCategoryEntity.findActive();
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
