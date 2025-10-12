import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { hashPassword } from '../utils/password';
import { AppError } from '../middleware/errorHandler';
import { UserType, UserStatus } from '@prisma/client';

export class AdminController {
  // Get all users with pagination
  static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,
          include: {
            pin: true,
            csrRep: true,
            platformManager: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.user.count(),
      ]);

      res.json({
        users,
        total,
        page,
        limit,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID
  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          pin: true,
          csrRep: true,
          platformManager: true,
        },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  // Create new user
  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, userType, ...profileData } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new AppError('Email already registered', 409);
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      let user;

      if (userType === UserType.PIN) {
        const { name, age, location, phoneNumber, accessibilityNeeds } = profileData;

        // Check if company registration number exists for CSR Rep
        if (profileData.companyRegistrationNumber) {
          const existingCompany = await prisma.cSRRep.findUnique({
            where: { companyRegistrationNumber: profileData.companyRegistrationNumber },
          });
          if (existingCompany) {
            throw new AppError('Company registration number already exists', 409);
          }
        }

        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            userType: UserType.PIN,
            status: UserStatus.ACTIVE,
            pin: {
              create: {
                name,
                age: age ? parseInt(age) : undefined,
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
      } else if (userType === UserType.CSR_REP) {
        const {
          companyName,
          companyRegistrationNumber,
          industry,
          contactPerson,
          phoneNumber,
          companyAddress,
        } = profileData;

        // Check if company registration number exists
        const existingCompany = await prisma.cSRRep.findUnique({
          where: { companyRegistrationNumber },
        });
        if (existingCompany) {
          throw new AppError('Company registration number already exists', 409);
        }

        user = await prisma.user.create({
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
                approvalStatus: UserStatus.ACTIVE, // Admin-created CSR reps are auto-approved
                approvedAt: new Date(),
              },
            },
          },
        include: {
          csrRep: true,
        },
      });
      } else if (userType === UserType.PLATFORM_MANAGER) {
        const { fullName, department, phone } = profileData;

        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            userType: UserType.PLATFORM_MANAGER,
            status: UserStatus.ACTIVE,
            platformManager: {
              create: {
                fullName,
                department,
                phone,
              },
            },
          },
          include: {
            platformManager: true,
          },
        });
      } else {
        throw new AppError('Invalid user type', 400);
      }

      res.status(201).json({
        message: 'User created successfully',
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user status
  static async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const user = await prisma.user.update({
        where: { id },
        data: { status },
        include: {
          pin: true,
          csrRep: true,
          platformManager: true,
        },
      });

      res.json({
        message: 'User status updated successfully',
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Approve CSR Rep
  static async approveCSRRep(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        include: { csrRep: true },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (user.userType !== UserType.CSR_REP) {
        throw new AppError('User is not a CSR Representative', 400);
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          status: UserStatus.ACTIVE,
          csrRep: {
            update: {
              approvalStatus: UserStatus.ACTIVE,
              approvedAt: new Date(),
            },
          },
        },
        include: {
          pin: true,
          csrRep: true,
          platformManager: true,
        },
      });

      res.json({
        message: 'CSR Representative approved successfully',
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete user
  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await prisma.user.delete({
        where: { id },
      });

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Get pending CSR Reps
  static async getPendingCSRReps(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await prisma.user.findMany({
        where: {
          userType: UserType.CSR_REP,
          status: UserStatus.PENDING,
        },
        include: {
          csrRep: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json({ users });
    } catch (error) {
      next(error);
    }
  }

  // Get system statistics
  static async getSystemStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [
        totalUsers,
        activeUsers,
        suspendedUsers,
        pendingCSRReps,
        totalRequests,
        activeRequests,
        totalMatches,
        activeMatches,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
        prisma.user.count({ where: { status: UserStatus.SUSPENDED } }),
        prisma.user.count({
          where: {
            userType: UserType.CSR_REP,
            status: UserStatus.PENDING,
          },
        }),
        prisma.request.count(),
        prisma.request.count({ where: { status: 'ACTIVE' } }),
        prisma.match.count(),
        prisma.match.count({ where: { status: 'ACTIVE' } }),
      ]);

      res.json({
        users: {
          total: totalUsers,
          active: activeUsers,
          suspended: suspendedUsers,
          pendingCSRReps,
        },
        requests: {
          total: totalRequests,
          active: activeRequests,
        },
        matches: {
          total: totalMatches,
          active: activeMatches,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
