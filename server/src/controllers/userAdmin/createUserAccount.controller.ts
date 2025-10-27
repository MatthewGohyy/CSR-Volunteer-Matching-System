import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { hashPassword } from '../../utils/password';
import { AppError } from '../../middleware/errorHandler';
import { UserStatus } from '@prisma/client';

/**
 * Create User Account Controller
 * 
 * Story #3: As a User Admin, I want to create user accounts so that new users can log in.
 */
export class CreateUserAccountController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, userProfileId, name, ...profileData } = req.body;

      // Check if user already exists
      const existingUser = await UserAccountEntity.findByEmail(email);
      if (existingUser) {
        throw new AppError('Email already registered', 409);
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user account with all profile fields
      const user = await UserAccountEntity.create({
        email,
        password: hashedPassword,
        name,
        userProfileId,
        status: UserStatus.ACTIVE,
        ...profileData, // This includes role-specific fields
      });

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.getRole(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
