import { Response, NextFunction } from 'express';
import { RequestCategoryEntity } from '../../entities/RequestCategory.entity';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for deleting a request category
 * User Story #38: Delete request category
 */
export class DeleteCategoryController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Check if category exists

      const category = await RequestCategoryEntity.findById(id);

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      await RequestCategoryEntity.delete(id);

      res.json({
        message: 'Request category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
