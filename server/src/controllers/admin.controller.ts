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
      } else if (userType === UserType.ADMIN) {
        // Create ADMIN user without profile table
        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            userType: UserType.ADMIN,
            status: UserStatus.ACTIVE,
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

  // Get system statistics
  static async getSystemStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalRequests,
        activeRequests,
        totalMatches,
        activeMatches,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
        prisma.user.count({ where: { status: UserStatus.SUSPENDED } }),
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

  // Update user account (email)
  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { email } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { id } });
      if (!existingUser) {
        throw new AppError('User not found', 404);
      }

      // If updating email, check for duplicates
      if (email && email !== existingUser.email) {
        const duplicate = await prisma.user.findUnique({ where: { email } });
        if (duplicate) {
          throw new AppError('Email already registered', 409);
        }
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          ...(email && { email }),
        },
        include: {
          pin: true,
          csrRep: true,
          platformManager: true,
        },
      });

      res.json({
        message: 'User updated successfully',
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update PIN profile
  static async updatePINProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, age, location, phoneNumber, accessibilityNeeds, profilePhoto } = req.body;

      // Get user and verify it's a PIN
      const user = await prisma.user.findUnique({
        where: { id },
        include: { pin: true },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (user.userType !== UserType.PIN) {
        throw new AppError('User is not a PIN', 400);
      }

      if (!user.pin) {
        throw new AppError('PIN profile not found', 404);
      }

      const updatedProfile = await prisma.pIN.update({
        where: { id: user.pin.id },
        data: {
          ...(name && { name }),
          ...(age !== undefined && { age: parseInt(age) }),
          ...(location && { location }),
          ...(phoneNumber && { phoneNumber }),
          ...(accessibilityNeeds !== undefined && { accessibilityNeeds }),
          ...(profilePhoto && { profilePhoto }),
        },
      });

      res.json({
        message: 'PIN profile updated successfully',
        profile: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update CSR Rep profile
  static async updateCSRRepProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { companyName, industry, contactPerson, phoneNumber, companyAddress, companyLogo } = req.body;

      // Get user and verify it's a CSR Rep
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

      if (!user.csrRep) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      const updatedProfile = await prisma.cSRRep.update({
        where: { id: user.csrRep.id },
        data: {
          ...(companyName && { companyName }),
          ...(industry && { industry }),
          ...(contactPerson && { contactPerson }),
          ...(phoneNumber && { phoneNumber }),
          ...(companyAddress && { companyAddress }),
          ...(companyLogo && { companyLogo }),
        },
      });

      res.json({
        message: 'CSR Rep profile updated successfully',
        profile: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update Platform Manager profile
  static async updatePlatformManagerProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { fullName, department, phone } = req.body;

      // Get user and verify it's a Platform Manager
      const user = await prisma.user.findUnique({
        where: { id },
        include: { platformManager: true },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (user.userType !== UserType.PLATFORM_MANAGER) {
        throw new AppError('User is not a Platform Manager', 400);
      }

      if (!user.platformManager) {
        throw new AppError('Platform Manager profile not found', 404);
      }

      const updatedProfile = await prisma.platformManager.update({
        where: { id: user.platformManager.id },
        data: {
          ...(fullName && { fullName }),
          ...(department && { department }),
          ...(phone && { phone }),
        },
      });

      res.json({
        message: 'Platform Manager profile updated successfully',
        profile: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  // Search users
  static async searchUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, userType, status, page = '1', limit = '10' } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};

      // Filter by user type
      if (userType) {
        where.userType = userType;
      }

      // Filter by status
      if (status) {
        where.status = status;
      }

      // Text search
      if (q && typeof q === 'string') {
        where.OR = [
          { email: { contains: q, mode: 'insensitive' } },
          {
            pin: {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { location: { contains: q, mode: 'insensitive' } },
              ],
            },
          },
          {
            csrRep: {
              OR: [
                { companyName: { contains: q, mode: 'insensitive' } },
                { contactPerson: { contains: q, mode: 'insensitive' } },
              ],
            },
          },
          {
            platformManager: {
              OR: [
                { fullName: { contains: q, mode: 'insensitive' } },
                { department: { contains: q, mode: 'insensitive' } },
              ],
            },
          },
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          include: {
            pin: true,
            csrRep: true,
            platformManager: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limitNum,
        }),
        prisma.user.count({ where }),
      ]);

      res.json({
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
