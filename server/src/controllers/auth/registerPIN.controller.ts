import { Request, Response, NextFunction } from 'express';
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { hashPassword } from '../../utils/password';
import { generateToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';
import { UserStatus } from '@prisma/client';
import { prisma } from '../../config/database';

/**
 * Controller for PIN user registration
 * User Story: Register as a Person in Need (PIN)
 * Architecture: BCE framework - Controller calls Entity methods directly
 */
export class RegisterPINController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name, age, location, phoneNumber, accessibilityNeeds } = req.body;

      // Check if user already exists via Entity
      const existingUser = await UserAccountEntity.findByEmail(email);
      if (existingUser) {
        throw new AppError('Email already registered', 409);
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Get PIN profile
      const pinProfile = await prisma.userProfile.findUnique({
        where: { name: 'Person in Need' }
      });

      if (!pinProfile) {
        throw new AppError('PIN profile not found', 404);
      }

      // Create user account with PIN fields
      const user = await UserAccountEntity.create({
        email,
        password: hashedPassword,
        name,
        userProfileId: pinProfile.id,
        status: UserStatus.ACTIVE,
        phoneNumber,
        age,
        location,
        accessibilityNeeds,
      });

      // Generate token
      const role = user.getRole();
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: role!,
      });

      res.status(201).json({
        message: 'PIN registered successfully',
        user: {
          id: user.id,
          email: user.email,
          role,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
}
