import { Request, Response, NextFunction } from 'express';
import { UserAccount } from '../../entities/UserAccount.entity';
import { AppError } from '../../middleware/errorHandler';

/**
 * Login Controller
 * 
 * Handles login functionality for all user types:
 * - Story #1: As a User Admin, I want to log in to my account
 * - Story #13: As a PIN, I want to log in to my account
 * - Story #24: As a CSR Rep, I want to log in to my account
 * - Story #33: As a Platform Manager, I want to log in to my account
 * 
 * Architecture: BCE framework - Controller calls Entity login method (contains all login logic)
 */
export class LoginController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Call Entity login method (contains all login logic)
      const result = await UserAccount.login(email, password);

      // Return success response
      res.json({
        message: 'Login successful',
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.role,
          name: result.user.name,
        },
        token: result.token,
      });
    } catch (error: any) {
      // Convert entity errors to AppError
      if (error.message) {
        next(new AppError(error.message, 401));
      } else {
        next(error);
      }
    }
  }
}

