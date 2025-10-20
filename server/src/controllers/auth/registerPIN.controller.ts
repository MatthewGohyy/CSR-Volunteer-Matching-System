import { Request, Response, NextFunction } from 'express';
import { UserEntity } from '../../entities/User.entity';
import { hashPassword } from '../../utils/password';
import { generateToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';
import { UserType, UserStatus } from '@prisma/client';
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
      const existingUser = await UserEntity.findByEmail(email);
      if (existingUser) {
        throw new AppError('Email already registered', 409);
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user and PIN profile
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          userType: UserType.PIN,
          status: UserStatus.ACTIVE,
          pin: {
            create: {
              name,
              age,
              location,
              phoneNumber,
              accessibilityNeeds,
            },
          },
        },
        include: {
          pin: true,
        },
      });

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        userType: user.userType,
      });

      res.status(201).json({
        message: 'PIN registered successfully',
        user: {
          id: user.id,
          email: user.email,
          userType: user.userType,
          profile: user.pin,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
}
