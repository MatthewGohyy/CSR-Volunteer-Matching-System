import { Request, Response, NextFunction } from 'express';

/**
 * Logout Controller
 * 
 * Handles logout functionality for all user types:
 * - Story #2: As a User Admin, I want to log out of my account
 * - Story #14: As a PIN, I want to log out of my account
 * - Story #25: As a CSR Rep, I want to log out of my account
 * - Story #34: As a Platform Manager, I want to log out of my account
 * 
 * Note: Actual logout happens on the frontend by removing the token.
 * This endpoint confirms logout and can be used for logging/analytics.
 */
export class LogoutController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a JWT-based system, logout is primarily handled client-side
      // by removing the token. This endpoint can be used for:
      // 1. Logging the logout event
      // 2. Invalidating refresh tokens (if implemented)
      // 3. Cleanup operations

      const userId = (req as any).user?.userId;

      // You can add logout logging here if needed
      // await logUserActivity(userId, 'LOGOUT');

      res.json({
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }
}

