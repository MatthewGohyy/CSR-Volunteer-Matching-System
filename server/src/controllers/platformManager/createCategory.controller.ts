import { Response, NextFunction } from 'express';
import { RequestCategory } from '../../entities/RequestCategory.entity';
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

      // Create category (validation handled in entity)
      const category = await RequestCategory.create({
        name,
        description,
        iconUrl,
        isActive: true,
      });

      res.status(201).json({
        message: 'Request category created successfully',
        category,
      });
    } catch (error: any) {
      // Convert entity errors to AppError
      if (error.message && error.message.includes('already exists')) {
        next(new AppError(error.message, 409));
      } else {
        next(error);
      }
    }
  }
}
