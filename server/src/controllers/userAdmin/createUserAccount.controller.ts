import { Request, Response, NextFunction } from 'express';
import { UserEntity } from '../../entities/User.entity';
import { PINEntity } from '../../entities/PIN.entity';
import { CSRRepEntity } from '../../entities/CSRRep.entity';
import { hashPassword } from '../../utils/password';
import { AppError } from '../../middleware/errorHandler';
import { UserType, UserStatus } from '@prisma/client';
import { prisma } from '../../config/database';

/**
 * Create User Account Controller
 * 
 * Story #3: As a User Admin, I want to create user accounts so that new users can log in.
 */
export class CreateUserAccountController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, userType, ...profileData } = req.body;


      // Check if user already exists
      const existingUser = await UserEntity.findByEmail(email);
      if (existingUser) {
        throw new AppError('Email already registered', 409);
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      let user;

      if (userType === UserType.PIN) {
        const { name, age, location, phoneNumber, accessibilityNeeds } = profileData;

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
}

