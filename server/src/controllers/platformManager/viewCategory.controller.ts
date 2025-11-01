import { Response, NextFunction } from 'express';
import { RequestCategory } from '../../entities/RequestCategory.entity';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for viewing a single request category by ID
 * User Story #36: View request categories (singular - view details of one category)
 * Follows BCE pattern - all database operations through entity class
 * Used when Platform Manager clicks into a category to view more details
 */
export class ViewCategoryController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const category = await RequestCategory.findById(id);

      res.json({
        category,
      });
    } catch (error) {
      next(error);
    }
  }
}
