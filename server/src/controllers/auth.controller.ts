import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { UserType, UserStatus } from '@prisma/client';

export class AuthController {
  // Register new PIN user
  static async registerPIN(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name, age, location, phoneNumber, accessibilityNeeds } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
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

  // Register new CSR Rep user
  static async registerCSRRep(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        email,
        password,
        companyName,
        companyRegistrationNumber,
        industry,
        contactPerson,
        phoneNumber,
        companyAddress,
      } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new AppError('Email already registered', 409);
      }

      // Check if company registration number exists
      const existingCompany = await prisma.cSRRep.findUnique({
        where: { companyRegistrationNumber },
      });
      if (existingCompany) {
        throw new AppError('Company registration number already exists', 409);
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user and CSR Rep profile
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          userType: UserType.CSR_REP,
          status: UserStatus.ACTIVE,
          csrRep: {
            create: {
              companyName,
              companyRegistrationNumber,
              industry,
              contactPerson,
              phoneNumber,
              companyAddress,
              approvalStatus: UserStatus.PENDING, // Requires admin approval
            },
          },
        },
        include: {
          csrRep: true,
        },
      });

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        userType: user.userType,
      });

      res.status(201).json({
        message: 'CSR Representative registered successfully. Pending admin approval.',
        user: {
          id: user.id,
          email: user.email,
          userType: user.userType,
          profile: user.csrRep,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  // Login
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          pin: true,
          csrRep: true,
        },
      });

      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check if user is active
      if (user.status !== UserStatus.ACTIVE) {
        throw new AppError('Account is not active', 403);
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check CSR Rep approval status
      if (user.userType === UserType.CSR_REP && user.csrRep?.approvalStatus === UserStatus.PENDING) {
        throw new AppError('Account pending admin approval', 403);
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
          profile: user.pin || user.csrRep,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          pin: true,
          csrRep: true,
        },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({
        user: {
          ...user,
          password: undefined,
          profile: user.pin || user.csrRep,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Update password
  static async updatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { currentPassword, newPassword } = req.body;

      // Get user
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify current password
      const isPasswordValid = await comparePassword(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 401);
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  }
}

