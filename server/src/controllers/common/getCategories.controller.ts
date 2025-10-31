import { Request, Response, NextFunction } from 'express';
import { RequestCategory } from '../../entities/RequestCategory.entity';

/**
 * Get Categories Controller
 * 
 * Utility: Get all active request categories (public endpoint)
 */
export class GetCategoriesController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await RequestCategory.findActive();

      res.json({ categories });
    } catch (error) {
      next(error);
    }
  }
}
