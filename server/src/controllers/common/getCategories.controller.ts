import { Request, Response, NextFunction } from 'express';
import { ServiceCategoryRepository } from '../../repositories/ServiceCategory.repository';

/**
 * Get Categories Controller
 * 
 * Utility: Get all active service categories (public endpoint)
 */
export class GetCategoriesController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryRepository = new ServiceCategoryRepository();
      const categories = await categoryRepository.findActive();

      res.json({ categories });
    } catch (error) {
      next(error);
    }
  }
}
