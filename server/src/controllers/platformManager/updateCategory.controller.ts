import { Response, NextFunction } from 'express';
import { RequestCategory } from '../../entities/RequestCategory.entity';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for updating a request category
 * User Story #37: Update request category
 */
export class UpdateCategoryController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, iconUrl, isActive } = req.body;

      const updateData: any = {};
      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (iconUrl !== undefined) updateData.iconUrl = iconUrl;
      if (isActive !== undefined) updateData.isActive = isActive;

      // Update category (validation handled in entity)
      const category = await RequestCategory.update(id, updateData);

      res.json({
        message: 'Request category updated successfully',
        category,
      });
    } catch (error: any) {
      // Convert entity errors to AppError
      if (error.message && (error.message.includes('not found') || error.message.includes('already exists'))) {
        const statusCode = error.message.includes('not found') ? 404 : 409;
        next(new AppError(error.message, statusCode));
      } else {
        next(error);
      }
    }
  }
}
