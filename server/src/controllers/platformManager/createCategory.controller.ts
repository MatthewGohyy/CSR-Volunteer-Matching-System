import { Response, NextFunction } from 'express';
import { RequestCategoryEntity } from '../../entities/RequestCategory.entity';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for creating a new request category
 * User Story #35: Create request category
 */
export class CreateCategoryController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description, iconUrl } = req.body;

      // Check if category with same name already exists
      const allCategories = await RequestCategoryEntity.findAll();
      const existingCategory = allCategories.find(c => c.name.toLowerCase() === name.toLowerCase());

      if (existingCategory) {
        throw new AppError('Category with this name already exists', 409);
      }

      const category = await RequestCategoryEntity.create({
        name,
        description,
        iconUrl,
        isActive: true,
      });

      res.status(201).json({
        message: 'Request category created successfully',
        category,
      });
    } catch (error) {
      next(error);
    }
  }
}
