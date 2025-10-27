import { Response, NextFunction } from 'express';
import { ServiceCategoryEntity } from '../../entities/ServiceCategory.entity';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for deleting a service category
 * User Story #38: Delete service category
 */
export class DeleteCategoryController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Check if category exists

      const category = await ServiceCategoryEntity.findById(id);

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      await ServiceCategoryEntity.delete(id);

      res.json({
        message: 'Service category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
