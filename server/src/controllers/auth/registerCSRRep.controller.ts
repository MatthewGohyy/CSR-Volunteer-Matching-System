import { Request, Response, NextFunction } from 'express';
import { UserAccount } from '../../entities/UserAccount.entity';
import { UserProfile } from '../../entities/UserProfile.entity';
import { hashPassword } from '../../utils/password';
import { generateToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';
import { UserStatus } from '@prisma/client';

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

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Get CSR Rep profile via entity
      const csrRepProfile = await UserProfile.findByName('CSR Representative');

      if (!csrRepProfile) {
        throw new AppError('CSR Rep profile not found', 404);
      }

      // Create user account with CSR Rep fields
      const user = await UserAccount.create({
        email,
        password: hashedPassword,
        name: contactPerson,
        userProfileId: csrRepProfile.id,
        status: UserStatus.ACTIVE,
        phoneNumber,
        companyName,
        companyRegistrationNumber,
        industry,
        contactPerson,
        companyAddress,
      });

      // Generate token
      const role = user.getRole();
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: role!,
      });

      res.status(201).json({
        message: 'CSR Representative registered successfully.',
        user: {
          id: user.id,
          email: user.email,
          role,
          name: user.name,
        },
        token,
      });
    } catch (error: any) {
      // Convert entity errors to AppError
      if (error.message && error.message.includes('already')) {
        next(new AppError(error.message, 409));
      } else {
        next(error);
      }
    }
  }
}
