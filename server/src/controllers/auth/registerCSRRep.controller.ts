import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../repositories/User.repository';
import { CSRRepRepository } from '../../repositories/CSRRep.repository';
import { hashPassword } from '../../utils/password';
import { generateToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';
import { UserType, UserStatus } from '@prisma/client';
import { prisma } from '../../config/database';

/**
 * Controller for CSR Representative registration
 * User Story: Register as a CSR Representative
 */
export class RegisterCSRRepController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const userRepository = new UserRepository();
      const csrRepRepository = new CSRRepRepository();

      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        throw new AppError('Email already registered', 409);
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
        message: 'CSR Representative registered successfully.',
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
}
