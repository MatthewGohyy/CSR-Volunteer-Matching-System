import { Response, NextFunction } from 'express';
import { ServiceCategoryRepository } from '../../repositories/ServiceCategory.repository';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../config/database';

/**
 * Controller for deleting a service category
 * User Story #38: Delete service category
 */
export class DeleteCategoryController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Check if category exists
      const categoryRepository = new ServiceCategoryRepository();

      const category = await categoryRepository.findById(id);

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      await categoryRepository.delete(id);

      res.json({
        message: 'Service category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
