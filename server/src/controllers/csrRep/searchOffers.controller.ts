import { Response, NextFunction } from 'express';
import { VolunteerOffer } from '../../entities/VolunteerOffer.entity';
import { AuthRequest } from '../../middleware/auth';

/**
 * Search Offers Controller
 * 
 * Handles listing/searching volunteer offers:
 * - No params: returns all offers for CSR Rep
 * - With query: returns filtered offers (by request title/description)
 */
export class SearchOffersController {
  static async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { search } = req.query;

      // Use VolunteerOffer.search() with optional query
      // query=null means return all offers
      const offers = await VolunteerOffer.search(
        userId,
        typeof search === 'string' && search.trim() ? search : null
      );

      res.json({ offers, total: offers.length });
    } catch (error) {
      next(error);
    }
  }
}

