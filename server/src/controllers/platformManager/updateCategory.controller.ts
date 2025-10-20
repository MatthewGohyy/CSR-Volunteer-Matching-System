import { Response, NextFunction } from 'express';
import { ServiceCategoryEntity } from '../../entities/ServiceCategory.entity';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../config/database';

/**
 * Controller for updating a service category
 * User Story #37: Update service category
 */
export class UpdateCategoryController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, iconUrl, isActive } = req.body;

      // Check if category exists

      const existingCategory = await ServiceCategoryEntity.findById(id);

      if (!existingCategory) {
        throw new AppError('Category not found', 404);
      }

      if (name && name !== existingCategory.name) {
        const allCategories = await ServiceCategoryEntity.findAll(1, 1000);
        const duplicate = allCategories.find(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== id);

        if (duplicate) {
          throw new AppError('Category with this name already exists', 409);
        }
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (iconUrl !== undefined) updateData.iconUrl = iconUrl;
      if (isActive !== undefined) updateData.isActive = isActive;

      const category = await ServiceCategoryEntity.update(id, updateData);

      res.json({
        message: 'Service category updated successfully',
        category,
      });
    } catch (error) {
      next(error);
    }
  }
}
