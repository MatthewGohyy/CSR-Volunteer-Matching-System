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
      const { query, isActive } = req.query;

      // Use entity search method (handles query and optional isActive filter)
      const searchQuery = typeof query === 'string' && query.trim() ? query.trim() : null;
      
      // Parse isActive filter - can be 'true', 'false', or undefined (all)
      let isActiveFilter: boolean | undefined = undefined;
      if (isActive !== undefined) {
        if (typeof isActive === 'string') {
          isActiveFilter = isActive.toLowerCase() === 'true';
        } else if (typeof isActive === 'boolean') {
          isActiveFilter = isActive;
        }
      }

      const profiles = await UserProfile.search(searchQuery, isActiveFilter);

      res.json({
        query: searchQuery,
        isActive: isActiveFilter,
        profiles,
        total: profiles.length,
      });
    } catch (error) {
      next(error);
    }
  }
}
