import { Request, Response, NextFunction } from 'express';
import { ServiceCategoryEntity } from '../../entities/ServiceCategory.entity';

/**
 * Get Categories Controller
 * 
 * Utility: Get all active service categories (public endpoint)
 */
export class GetCategoriesController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await ServiceCategoryEntity.findActive();

      res.json({ categories });
    } catch (error) {
      next(error);
    }
  }
}
