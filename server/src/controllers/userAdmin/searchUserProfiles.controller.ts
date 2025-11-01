import { Request, Response, NextFunction } from 'express';
import { UserProfile } from '../../entities/UserProfile.entity';

/**
 * Search User Profiles Controller
 * 
 * Story #9: As a User Admin, I want to view user profiles so that I can update the details.
 * Story #12: As a User Admin, I want to search user profiles 
 * so that I can find the correct user profile.
 * 
 * Handles listing/searching user profiles.
 * Returns all found profile instances matching the criteria.
 * 
 * Follows BCE pattern - all database operations through entity class
 */
export class SearchUserProfilesController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query } = req.query;

      // Use entity search method (handles query, filters to active profiles only)
      const searchQuery = typeof query === 'string' && query.trim() ? query.trim() : null;

      const profiles = await UserProfile.search(searchQuery);

      res.json({
        query: searchQuery,
        profiles,
        total: profiles.length,
      });
    } catch (error) {
      next(error);
    }
  }
}
