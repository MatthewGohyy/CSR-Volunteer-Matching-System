import { Response, NextFunction } from 'express';
import { RequestCategory } from '../../entities/RequestCategory.entity';
import { AuthRequest } from '../../middleware/auth';

/**
 * Controller for searching request categories
 * User Story #39: Search request categories
 * Also handles viewing all/filtered categories (moved from ViewCategoriesController)
 * Follows BCE pattern - all database operations through entity class
 */
export class SearchCategoriesController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search } = req.query;

      // Extract and normalize query parameter
      const searchQuery = typeof search === 'string' && search.trim() ? search.trim() : null;

      // All logic encapsulated in entity method (default: active categories only)
      const categories = await RequestCategory.search(searchQuery);

      res.json({
        query: searchQuery,
        categories,
      });
    } catch (error) {
      next(error);
    }
  }
}
