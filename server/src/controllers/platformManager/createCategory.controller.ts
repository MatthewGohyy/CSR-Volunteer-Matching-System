import { Response, NextFunction } from 'express';
import { ServiceCategoryRepository } from '../../repositories/ServiceCategory.repository';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../config/database';

/**
 * Controller for creating a new service category
 * User Story #35: Create service category
 */
export class CreateCategoryController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description, iconUrl } = req.body;

      // Check if category with same name already exists
      const categoryRepository = new ServiceCategoryRepository();

      const allCategories = await categoryRepository.findAll(1, 1000);
      const existingCategory = allCategories.find(c => c.name.toLowerCase() === name.toLowerCase());

      if (existingCategory) {
        throw new AppError('Category with this name already exists', 409);
      }

      const category = await categoryRepository.create({
        name,
        description,
        iconUrl,
        isActive: true,
      });

      res.status(201).json({
        message: 'Service category created successfully',
        category,
      });
    } catch (error) {
      next(error);
    }
  }
}
