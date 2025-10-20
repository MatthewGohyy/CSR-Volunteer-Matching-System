import { Request, Response, NextFunction } from 'express';
import { UserEntity } from '../../entities/User.entity';
import { comparePassword } from '../../utils/password';
import { generateToken } from '../../utils/jwt';
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
 * Architecture: BCE framework - Controller calls Entity methods directly
 */
export class LoginController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user via Entity (direct database access)
      const user = await UserEntity.findByEmail(email);

      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check if user is active using entity method
      if (!user.isActive()) {
        throw new AppError('Account is not active', 403);
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        userType: user.userType,
      });

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          userType: user.userType,
          profile: user.getProfile(),
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
}

